/** Per-million rates in one currency. Input counts INCLUDE cache reads/writes. */
export interface TokenRates {
  inputPerMillion: number;
  outputPerMillion: number;
  cachedInputPerMillion?: number;
  cacheWritePerMillion?: number;
}

export interface ModelTokenPrice extends TokenRates {
  source: string;
  asOf: string;
  longContext?: TokenRates & { above: number };
}

export interface TokenScenario {
  input: number;
  output: number;
  cachedInput: number;
  cacheWrite: number;
}

export type TokenEstimate = { total: number; fresh: number; cached: number; written: number; output: number; longContext: boolean }
  | { error: "invalid" | "unpriced" | "cache-read-unpriced" | "cache-write-unpriced" | "context-exceeded" };

/** One request, not a sum of tool rounds: long-context thresholds apply per call. */
export function estimateModelTokens(price: ModelTokenPrice | null, tokens: TokenScenario, contextWindow?: number): TokenEstimate {
  if ([tokens.input, tokens.output, tokens.cachedInput, tokens.cacheWrite].some(value => !Number.isSafeInteger(value) || value < 0)
    || tokens.cachedInput + tokens.cacheWrite > tokens.input) return { error: "invalid" };
  if (contextWindow !== undefined && Number.isSafeInteger(contextWindow) && contextWindow > 0
    && tokens.input + tokens.output > contextWindow) return { error: "context-exceeded" };
  if (!price) return { error: "unpriced" };
  const longContext = Boolean(price.longContext && tokens.input > price.longContext.above);
  const rates = longContext ? price.longContext! : price;
  if (tokens.cachedInput && rates.cachedInputPerMillion === undefined) return { error: "cache-read-unpriced" };
  if (tokens.cacheWrite && rates.cacheWritePerMillion === undefined) return { error: "cache-write-unpriced" };
  if ([rates.inputPerMillion, rates.outputPerMillion, rates.cachedInputPerMillion, rates.cacheWritePerMillion]
    .some(value => value !== undefined && (!Number.isFinite(value) || value < 0))) return { error: "unpriced" };
  const fresh = (tokens.input - tokens.cachedInput - tokens.cacheWrite) * rates.inputPerMillion / 1_000_000;
  const cached = tokens.cachedInput * (rates.cachedInputPerMillion ?? 0) / 1_000_000;
  const written = tokens.cacheWrite * (rates.cacheWritePerMillion ?? 0) / 1_000_000;
  const output = tokens.output * rates.outputPerMillion / 1_000_000;
  return { fresh, cached, written, output, total: fresh + cached + written + output, longContext };
}
