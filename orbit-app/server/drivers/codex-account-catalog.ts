import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ModelCatalog } from '../contracts.ts';
import { codexHome } from './codex-identity.ts';

/** Refresh the selected ChatGPT account's catalog. Credentials never leave
 * the backend or go to custom providers. Older/offline accounts keep the CLI catalog. */
export async function readCodexAccountCatalog(env: Record<string, string | undefined>, fetchImpl: typeof fetch = fetch): Promise<ModelCatalog | null> {
  const home = codexHome(env);
  if (!home) return null;
  try {
    const auth = JSON.parse(readFileSync(join(home, 'auth.json'), 'utf8'));
    const token = auth.tokens?.access_token;
    if (typeof token !== 'string' || !token || (auth.auth_mode && auth.auth_mode !== 'chatgpt')) return null;
    const response = await fetchImpl('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      redirect: 'error', signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;
    const text = await response.text();
    if (text.length > 1_000_000) return null;
    const payload = JSON.parse(text);
    if (!Array.isArray(payload.models)) return null;
    const seen = new Set<string>();
    const options: ModelCatalog['options'] = [];
    for (const row of payload.models) {
      if (row.visibility !== 'list' || typeof row.slug !== 'string' || !/^[\w][\w./:+-]*$/.test(row.slug) || seen.has(row.slug)) continue;
      seen.add(row.slug);
      options.push({ id: row.slug, label: typeof row.display_name === 'string' && row.display_name ? row.display_name : row.slug });
    }
    return options.length ? { default: options[0].id, options } : null;
  } catch { return null; } // No raw HTTP/auth errors in logs or renderer.
}
