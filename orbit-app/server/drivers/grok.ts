// xAI API driver. Grok uses the OpenAI chat-completions wire contract and
// adds the shared transient-failure retry policy.
import type { ModelCatalog, ProviderDriver } from "../contracts.ts";
import { createOpenAIChatRuntime } from "./openai-chat.ts";
import { object } from "./openai-chat-protocol.ts";

const DRIVER_KIND = "grok";
const DEFAULT_URL = "https://api.x.ai/v1";
const MODELS: ModelCatalog = {
  default: "grok-4.7",
  options: [
    { id: "grok-4.7", label: "Grok 4.7", contextWindow: 500_000 },
  ],
};

export interface GrokConfig {
  tools?: boolean;
  url: string;
  apiKeyEnv: string;
}

function decodeConfig(raw: unknown): GrokConfig {
  const config = (raw ?? {}) as Record<string, unknown>;
  if (config.tools !== undefined && typeof config.tools !== "boolean") throw new Error("tools must be a boolean");
  return {
    ...(config.tools !== undefined ? { tools: config.tools as boolean } : {}),
    url: typeof config.url === "string" ? config.url : DEFAULT_URL,
    apiKeyEnv: typeof config.apiKeyEnv === "string" ? config.apiKeyEnv : "XAI_API_KEY",
  };
}

export const GrokDriver: ProviderDriver<GrokConfig> = {
  driverKind: DRIVER_KIND,
  metadata: { displayName: "Grok (API)", supportsMultipleInstances: true },
  models: MODELS,
  decodeConfig,
  defaultConfig: () => decodeConfig({}),

  async create(input) {
    const { config } = input;
    const apiKey = input.environment[config.apiKeyEnv] ?? process.env[config.apiKeyEnv] ?? "";
    let catalog = MODELS;
    let refreshing: Promise<void> | undefined;
    const refreshModels = (): Promise<void> => {
      if (!apiKey) return Promise.resolve();
      if (refreshing) return refreshing;
      refreshing = (async () => {
        try {
          // Unlike /models, this endpoint excludes image/video generators.
          const response = await fetch(`${config.url.replace(/\/+$/, "")}/language-models`, {
            headers: { authorization: `Bearer ${apiKey}` },
            redirect: "error", signal: AbortSignal.timeout(8_000),
          });
          if (!response.ok) return;
          const payload = object(await response.json());
          if (!Array.isArray(payload?.models)) return;
          const options: ModelCatalog["options"] = [];
          const seen = new Set<string>();
          for (const raw of payload.models) {
            const row = object(raw);
            if (!row || typeof row.id !== "string" || !row.id.trim()) continue;
            if (Array.isArray(row.output_modalities) && !row.output_modalities.includes("text")) continue;
            // xAI prices are USD cents per 100M tokens: divide by 10,000 for $/1M.
            const rate = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0 ? value / 10_000 : undefined;
            const inputRate = rate(row.prompt_text_token_price);
            const outputRate = rate(row.completion_text_token_price);
            const pricing = inputRate !== undefined && outputRate !== undefined ? {
              inputPerMillion: inputRate, outputPerMillion: outputRate,
              cachedInputPerMillion: rate(row.cached_prompt_text_token_price),
              source: "https://docs.x.ai/developers/rest-api-reference/inference/models", asOf: new Date().toISOString().slice(0, 10),
            } : undefined;
            const threshold = row.long_context_threshold;
            if (pricing && typeof threshold === "number" && Number.isSafeInteger(threshold) && threshold > 0) {
              // Zero in the xAI long-context fields means use the base rate.
              const longInput = rate(row.prompt_text_token_price_long_context);
              const longOutput = rate(row.completion_text_token_price_long_context);
              const longCached = rate(row.cached_prompt_text_token_price_long_context);
              Object.assign(pricing, { longContext: {
                above: threshold - 1, inputPerMillion: longInput || pricing.inputPerMillion,
                outputPerMillion: longOutput || pricing.outputPerMillion,
                cachedInputPerMillion: longCached || pricing.cachedInputPerMillion,
              } });
            }
            for (const id of [row.id, ...(Array.isArray(row.aliases) ? row.aliases : [])]) {
              if (typeof id !== "string" || !id.trim() || seen.has(id)) continue;
              seen.add(id);
              const known = MODELS.options.find(option => option.id === id);
              options.push({ ...known, id, label: known?.label ?? id, ...(pricing ? { pricing } : {}) });
            }
          }
          if (options.length) catalog = { default: seen.has(MODELS.default) ? MODELS.default : options[0].id, options };
        } catch {
          // Keep the last usable catalog on network/auth/schema failures.
        }
      })().finally(() => { refreshing = undefined; });
      return refreshing;
    };
    if (apiKey) void refreshModels();
    return createOpenAIChatRuntime({
      input,
      driverKind: DRIVER_KIND,
      apiKey,
      apiUrl: config.url,
      tools: config.tools,
      models: () => catalog,
      refreshModels,
      requestBody: (model, messages, stream) => ({ model, messages, stream,
        stream_options: stream ? { include_usage: true } : undefined }),
      httpErrorLabel: "xAI",
      missingKeyError: `no xAI key — set ${config.apiKeyEnv} or config.json xai.key`,
      unavailableReason: `no xAI API key — add {"xai":{"key":"xai-…"}} to ~/.orbit/config.json or set ${config.apiKeyEnv}`,
      timeoutMs: 120_000,
      billing: "metered",
      includeUsageInCompleted: true,
      usageCostInUsdTicks: true,
      retryScale: Number(process.env.FAKE_GROK_RETRY_SCALE ?? "1"),
      generateModel: () => catalog.default,
      nativeLog: {
        source: "xai.chat.completions",
        outgoing: (_turn, messages, model) => ({ model, messages }),
        incoming: ({ text, usage }) => ({ text, usage }),
      },
    });
  },
};
