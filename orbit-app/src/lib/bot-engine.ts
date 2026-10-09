import { currentTaskBot, type Bot, type InstanceInfo, type ModelSelection } from "@/state/store";
import { t } from "./i18n";

/** The selected conversation overrides the bot's defaults. Missing catalogs
 * preserve the recorded IDs; another available provider is never a fallback. */
export function botEngineDetails(profile: Bot, instances: readonly InstanceInfo[]) {
  const bot = currentTaskBot(profile);
  const selection = bot.modelSelection;
  const instance = instances.find((candidate) => candidate.instanceId === selection.instanceId);
  const model = instance?.models.options.find((option) => option.id === selection.model)?.label ?? selection.model;
  return { bot, selection, instance, model: model || "—", engine: instance?.displayName ?? selection.instanceId };
}

/** Authentication can be absent for local custom models. Report the route's
 * actual setup state rather than a decorative, unconditional Ready badge. */
export function engineReadiness(instance: InstanceInfo | undefined, selection: ModelSelection) {
  if (!instance) return { ready: false, label: t("orbit.st.unavailable") };
  if (instance.policy) return { ready: false, label: instance.policy.reason };
  if (instance.snapshot.state !== "available") return { ready: false, label: instance.snapshot.reason || t("model.setupRequired") };
  const custom = instance.access === "custom" || instance.models.options.find((option) => option.id === selection.model)?.custom;
  if (instance.snapshot.authenticated === false && !custom) return { ready: false, label: t("model.signInRequired") };
  return { ready: true, label: t("orbit.st.ready") };
}
