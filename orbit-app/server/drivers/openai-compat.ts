// Transcript-replay driver for OpenRouter, Groq, Together, llama.cpp, and
// other endpoints that speak the OpenAI chat-completions contract.
import { createHash } from "node:crypto";
import type { ModelCatalog, ProviderDriver } from "../contracts.ts";
import { createOpenAIChatRuntime } from "./openai-chat.ts";
import { object } from "./openai-chat-protocol.ts";

const DRIVER_KIND = "openai-compat";
const DEFAULT_IDLE_TIMEOUT_MS = 180_000;
const idleTimeoutMs = () => {
  const raw = process.env.ORBIT_OPENAI_COMPAT_IDLE_TIMEOUT_MS;
  if (!raw) return DEFAULT_IDLE_TIMEOUT_MS;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value >= 1_000 && value <= 2_147_483_647 ? value : DEFAULT_IDLE_TIMEOUT_MS;
};
const DEFAULT_MODELS: ModelCatalog = {
  default: "meta-llama/llama-3.3-70b-instruct",
  options: [
    { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B (OpenRouter)", custom: true },
  ],
};
const GROQ_MODELS: ModelCatalog = {
  default: "openai/gpt-oss-120b",
  options: [
    { id: "openai/gpt-oss-120b", label: "GPT OSS 120B (Groq)", custom: true, contextWindow: 131_072,
      pricing: { inputPerMillion: 0.15, outputPerMillion: 0.6, source: "https://console.groq.com/docs/models", asOf: "2026-10-10" } },
    { id: "openai/gpt-oss-20b", label: "GPT OSS 20B (Groq)", custom: true, contextWindow: 131_072,
      pricing: { inputPerMillion: 0.075, outputPerMillion: 0.3, source: "https://console.groq.com/docs/models", asOf: "2026-10-10" } },
  ],
};

function seedModels(url: string): ModelCatalog {
  try { return new URL(url).hostname.toLowerCase() === "api.groq.com" ? GROQ_MODELS : DEFAULT_MODELS; }
  catch { return DEFAULT_MODELS; }
}

export interface OpenAICompatConfig {
  tools?: boolean;
  url: string;
  apiKeyEnv: string;
  key?: string;
  model?: string;
  provider?: string;
  managedModels?: string[];
}

function isOpenRouterUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "openrouter.ai" || host.endsWith(".openrouter.ai");
  } catch {
    return false;
  }
}

function decodeConfig(raw: unknown): OpenAICompatConfig {
  const config = (raw ?? {}) as Record<string, unknown>;
  if (config.tools !== undefined && typeof config.tools !== "boolean") throw new Error("tools must be a boolean");
  if (config.managedModels !== undefined && (!Array.isArray(config.managedModels) || !config.managedModels.length || config.managedModels.some(model => typeof model !== "string" || !model.trim()))) throw new Error("Invalid managed models.");
  const envUrl = process.env.OPENAI_COMPAT_URL;
  return {
    ...(config.tools !== undefined ? { tools: config.tools as boolean } : {}),
    ...(config.managedModels ? { managedModels: config.managedModels as string[] } : {}),
    url: (typeof config.url === "string" && config.url ? config.url : envUrl || "https://openrouter.ai/api/v1")
      .replace(/\/+$/, ""),
    apiKeyEnv: typeof config.apiKeyEnv === "string" && config.apiKeyEnv
      ? config.apiKeyEnv
      : "OPENAI_COMPAT_API_KEY",
    key: typeof config.key === "string" && config.key ? config.key : undefined,
    model: typeof config.model === "string" && config.model
      ? config.model
      : process.env.OPENAI_COMPAT_MODEL || undefined,
    // An explicit empty override disables inherited routing for an isolated
    // connection (CLI setup uses this). Absent still inherits the global pin.
    provider: typeof config.provider === "string"
      ? config.provider || undefined
      : process.env.OPENAI_COMPAT_PROVIDER || undefined,
  };
}

export const OpenAICompatDriver: ProviderDriver<OpenAICompatConfig> = {
  driverKind: DRIVER_KIND,
  metadata: {
    displayName: "OpenAI-compatible (OpenRouter / Groq)",
    supportsMultipleInstances: true,
    access: "custom",
  },
  models: DEFAULT_MODELS,
  install: {
    docsUrl: "https://openrouter.ai/keys",
    signInCommand:
      "add {\"openaiCompat\":{\"key\":\"sk-or-v1-…\"}} to ~/.orbit/config.json (or set OPENAI_COMPAT_API_KEY)",
    command: {
      darwin:
        "Get a free key at https://openrouter.ai/keys (or https://console.groq.com) then add it to ~/.orbit/config.json under openaiCompat.key",
      linux:
        "Get a free key at https://openrouter.ai/keys (or https://console.groq.com) then add it to ~/.orbit/config.json under openaiCompat.key",
      win32:
        "Get a free key at https://openrouter.ai/keys (or https://console.groq.com) then add it to %USERPROFILE%\\.orbit\\config.json under openaiCompat.key",
    },
  },
  decodeConfig,
  defaultConfig: () => decodeConfig({}),

  async create(input) {
    const { config } = input;
    const apiKey =
      config.key ??
      input.environment[config.apiKeyEnv] ??
      input.environment.OPENAI_COMPAT_API_KEY ??
      process.env[config.apiKeyEnv] ??
      process.env.OPENAI_COMPAT_API_KEY ??
      "";
    const seed = seedModels(config.url);
    let catalog: ModelCatalog = config.managedModels
      ? { default: config.managedModels[0], options: config.managedModels.map(id => ({ id, label: id })) }
      : config.model
      ? {
          default: config.model,
          options: seed.options.some((model) => model.id === config.model)
            ? seed.options
            : [{ id: config.model, label: config.model, custom: true }, ...seed.options],
        }
      : seed;

    const fetchModels = async () => {
      if (config.managedModels) return;
      if (!apiKey) return;
      try {
        const response = await fetch(`${config.url}/models`, {
          headers: { authorization: `Bearer ${apiKey}` },
          redirect: "error",
          signal: AbortSignal.timeout(8_000),
        });
        if (!response.ok) return;
        const json = await response.json() as { data?: Array<{ id?: unknown; name?: unknown }> } | Array<{ id?: unknown; name?: unknown }>;
        const rows = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
        const seen = new Set<string>();
        const options: ModelCatalog["options"] = [];
        for (const raw of rows) {
          const row = object(raw);
          if (!row) continue;
          const id = typeof row.id === "string" ? row.id.trim() : "";
          const architecture = object(row.architecture);
          if (!id || seen.has(id) || (Array.isArray(architecture?.output_modalities) && !architecture.output_modalities.includes("text"))) continue;
          seen.add(id);
          const context = row.context_length;
          const price = object(row.pricing);
          const perMillion = (value: unknown) => {
            if (typeof value !== "string" && typeof value !== "number") return undefined;
            if (typeof value === "string" && !value.trim()) return undefined;
            const rate = Number(value) * 1_000_000;
            return Number.isFinite(rate) && rate >= 0 ? rate : undefined;
          };
          const inputRate = perMillion(price?.prompt);
          const outputRate = perMillion(price?.completion);
          options.push({
            ...seed.options.find(option => option.id === id),
            id,
            label: typeof row.name === "string" && row.name.trim() ? row.name : id,
            custom: true,
            ...(typeof context === "number" && Number.isSafeInteger(context) && context > 0 ? { contextWindow: context } : {}),
            ...(isOpenRouterUrl(config.url) && inputRate !== undefined && outputRate !== undefined ? {
              pricing: { inputPerMillion: inputRate, outputPerMillion: outputRate,
                cachedInputPerMillion: perMillion(price?.input_cache_read), cacheWritePerMillion: perMillion(price?.input_cache_write),
                source: "https://openrouter.ai/api/v1/models", asOf: new Date().toISOString().slice(0, 10) },
            } : {}),
          });
        }
        if (!options.length) return;
        if (config.model && !options.some((model) => model.id === config.model)) {
          options.unshift({ id: config.model, label: config.model, custom: true });
        }
        catalog = { default: config.model ?? options[0].id, options };
      } catch {
        // Catalog refresh is opportunistic; keep the seeded options.
      }
    };
    if (apiKey) void fetchModels();

    return createOpenAIChatRuntime({
      input,
      driverKind: DRIVER_KIND,
      apiKey,
      apiUrl: config.url,
      tools: config.tools,
      computerUse: true,
      models: () => catalog,
      refreshModels: fetchModels,
      requestBody: (model, messages, stream, threadId) => ({
        model,
        messages,
        stream,
        stream_options: stream ? { include_usage: true } : undefined,
        // Stable across turns/tool rounds, even when replay drops the opening
        // messages. Opaque and bounded; custom endpoints receive no extra field.
        ...(threadId && isOpenRouterUrl(config.url) ? {
          session_id: `solar-${createHash("sha256").update(JSON.stringify([input.instanceId, threadId])).digest("hex")}`,
        } : {}),
        ...(config.provider && isOpenRouterUrl(config.url)
          ? { provider: { order: [config.provider], allow_fallbacks: false } }
          : {}),
      }),
      httpErrorLabel: "upstream",
      missingKeyError: `no API key — set ${config.apiKeyEnv} or add it to the instance config`,
      unavailableReason: `no API key — set ${config.apiKeyEnv} or add it to the instance config`,
      timeoutMs: idleTimeoutMs(),
      reasoning: true,
      billing: "metered",
      includeUsageInCompleted: true,
        usageCostInUsd: isOpenRouterUrl(config.url),
      nativeLog: {
        source: "openai-compat.chat.completions",
        outgoing: (_turn, messages, model) => ({ model, messageCount: messages.length }),
        incoming: ({ text, reasoning, usage }) => ({
          textLength: text.length,
          reasoningLength: reasoning.length,
          usage,
        }),
      },
    });
  },
};
