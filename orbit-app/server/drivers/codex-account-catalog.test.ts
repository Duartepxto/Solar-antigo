import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, expect, it, vi } from 'vitest';
import { readCodexAccountCatalog } from './codex-account-catalog.ts';
const dirs: string[] = [];
function account() { const home = mkdtempSync(join(tmpdir(),'solar-catalog-'));dirs.push(home);writeFileSync(join(home,'auth.json'),JSON.stringify({auth_mode:'chatgpt',tokens:{access_token:'fixture-token'}}));return {CODEX_HOME:home}; }
afterEach(()=>{for(const dir of dirs.splice(0))rmSync(dir,{recursive:true,force:true});});
it('uses the signed-in account list, labels and order, including new model slugs',async()=>{
  const fetcher=vi.fn().mockResolvedValue(new Response(JSON.stringify({models:[{slug:'gpt-6.1-sol',display_name:'GPT-6.1 Sol',visibility:'list'},{slug:'private',visibility:'hidden'},{slug:'gpt-6-astra',display_name:'GPT-6 Astra',visibility:'list'},{slug:'gpt-6.1-sol',visibility:'list'}]})));
  expect(await readCodexAccountCatalog(account(),fetcher)).toEqual({default:'gpt-6.1-sol',options:[{id:'gpt-6.1-sol',label:'GPT-6.1 Sol'},{id:'gpt-6-astra',label:'GPT-6 Astra'}]});
  expect(fetcher.mock.calls[0][0]).toBe('https://api.openai.com/v1/models');expect(fetcher.mock.calls[0][1].redirect).toBe('error');
});
it('falls back without logging credentials on missing auth, denied access or malformed payloads',async()=>{
  const fetcher=vi.fn().mockResolvedValue(new Response('{}',{status:401}));
  expect(await readCodexAccountCatalog({CODEX_HOME:'relative'},fetcher)).toBeNull();expect(fetcher).not.toHaveBeenCalled();
  expect(await readCodexAccountCatalog(account(),fetcher)).toBeNull();
  fetcher.mockResolvedValue(new Response(JSON.stringify({data:[{id:'image-model'}]})));
  expect(await readCodexAccountCatalog(account(),fetcher)).toBeNull();
});
