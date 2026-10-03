import type { IncomingMessage, ServerResponse } from 'node:http';

/** Public application code only. All workspace reads/writes still pass through
 * the companion's bearer authentication and route allowlist. */
export function serveSolarBrowser(req: IncomingMessage, res: ServerResponse): boolean {
  if (req.method !== 'GET') return false;
  const path = (req.url ?? '').split('?')[0];
  if (path !== '/solar' && path !== '/solar/app.js') return false;
  res.writeHead(200, {
    'content-type': path === '/solar' ? 'text/html; charset=utf-8' : 'text/javascript; charset=utf-8',
    'cache-control': 'no-store', 'referrer-policy': 'no-referrer', 'x-content-type-options': 'nosniff',
    'content-security-policy': "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  });
  res.end(path === '/solar' ? SOLAR_PHONE_HTML : SOLAR_PHONE_SCRIPT);
  return true;
}

export function solarSameOrigin(origin: string | undefined, host: string | undefined): boolean {
  if (!origin || !host) return false;
  try { const url = new URL(origin); return (url.protocol === 'http:' || url.protocol === 'https:') && url.host === host && url.origin === origin; }
  catch { return false; }
}

const SOLAR_PHONE_HTML = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Solar</title><style>
:root{color-scheme:dark;font:15px system-ui,sans-serif;background:#05090e;color:#edf0f4}*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:flex;flex-direction:column;background:radial-gradient(ellipse at 15% 0%,#162639,transparent 60%)}header{display:flex;align-items:center;gap:12px;padding:22px 20px;border-bottom:1px solid #ffffff16}header svg{color:#ffc98c;flex-shrink:0}h1{font-size:18px;letter-spacing:-.4px;margin:0}small{font-size:12px;color:#a3afbd}button,select,textarea{font:inherit;color:inherit}button{cursor:pointer;border:1px solid #ffffff25;border-radius:99px;background:#ffffff09;padding:10px 17px}button:disabled{opacity:.45;cursor:default}button:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #ffcd8a;outline-offset:3px}#leave{margin-left:auto;font-size:12px;padding:8px 12px}main{width:100%;max-width:760px;flex:1;margin:auto;display:flex;flex-direction:column;padding:24px 20px;gap:18px}#status{color:#b9c2cd;line-height:1.5;margin:0}#connect{align-self:start;border-color:#ffc98c55;color:#ffd4a0}select{width:100%;padding:12px 0;background:transparent;border:0;border-bottom:1px solid #ffffff24}select option{background:#101820}#messages{flex:1;display:flex;flex-direction:column;gap:24px;padding:16px 0;min-height:120px}article{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6}article strong{font-size:12px;color:#9dabbc;display:block;margin-bottom:5px}article[data-role=user]{padding-left:16px;border-left:1px solid #ffc98c55}form{position:sticky;bottom:0;display:flex;align-items:flex-end;gap:10px;padding:12px 0 calc(12px + env(safe-area-inset-bottom));background:#080f18}textarea{resize:vertical;min-height:48px;max-height:180px;width:100%;padding:12px;border:1px solid #ffffff24;border-radius:20px;background:#ffffff08}#send{color:#ffcf96;min-height:46px}footer{font-size:12px;color:#9aa7b7;line-height:1.5} [hidden]{display:none!important}
</style></head><body><header><svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="16" cy="16" r="7"/><path d="M16 2v4m0 20v4M2 16h4m20 0h4M6 6l3 3m14 14 3 3M6 26l3-3m14-14 3-3"/></svg><div><h1>Solar</h1><small>No teu telemóvel</small></div><button id="leave" hidden>Sair</button></header><main><p id="status" role="status" aria-live="polite">Liga este telemóvel ao teu Solar.</p><button id="connect">Ligar ao Solar</button><select id="agents" aria-label="Agente" hidden></select><section id="messages" aria-label="Conversa" hidden></section><form id="composer" hidden><textarea id="draft" aria-label="Mensagem" placeholder="Escreve uma mensagem…" maxlength="100000" required></textarea><button id="send" type="submit">Enviar</button></form><footer id="help">Mantém o Solar aberto no PC. Para uma ligação local, usa a mesma rede Wi-Fi. Podes revogar este dispositivo no Solar.</footer></main><script src="/solar/app.js" defer></script></body></html>`;

// The one-use credential is carried in the fragment, never an HTTP query or log.
// Connection is an explicit action. No session cookie, CORS or admin API is added.
const SOLAR_PHONE_SCRIPT = `(() => {
const $ = id => document.getElementById(id), status=$('status'), agents=$('agents'), messages=$('messages'), draft=$('draft'), form=$('composer'), connect=$('connect'), leave=$('leave');
let credential=new URLSearchParams(location.hash.slice(1)).get('token'), token=null, current=null, bots=[], busy=false, loading=false, timer=null;
history.replaceState(null,'',location.pathname);
try { token=localStorage.getItem('solar.companion.token'); } catch {}
function note(text){status.textContent=text;}
function disconnected(text){token=null;current=null;clearInterval(timer);timer=null;try{localStorage.removeItem('solar.companion.token');}catch{};form.hidden=agents.hidden=messages.hidden=leave.hidden=true;connect.hidden=false;connect.disabled=!credential;note(text);}
async function api(path,body){const response=await fetch(path,{method:body===undefined?'GET':'POST',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)}),cache:'no-store'});const data=await response.json();if(!response.ok){if(response.status===401&&token)disconnected('A ligação expirou ou foi revogada. Volta a ler um QR no PC.');throw new Error(data.error||'Não foi possível ligar.');}return data;}
function render(bot){messages.replaceChildren();for(const message of bot.messages||[]){if(!message.text)continue;const row=document.createElement('article'),label=document.createElement('strong'),text=document.createElement('div');row.dataset.role=message.role;label.textContent=message.role==='user'?'Tu':bot.name;text.textContent=message.text;row.append(label,text);messages.append(row);}note(bot.waiting?'O agente precisa de uma aprovação. Abre-a no PC.':bot.busy?'A trabalhar…':'Ligado ao Solar');}
async function refresh(){if(loading||!token)return;loading=true;try{const data=await api('/api/bots');bots=(data.bots||[]).filter(b=>!b.hidden);const selected=current||bots[0]?.id;agents.replaceChildren();for(const bot of bots){const option=document.createElement('option');option.value=bot.id;option.textContent=bot.name;agents.append(option);}current=bots.some(b=>b.id===selected)?selected:bots[0]?.id;agents.value=current||'';const bot=bots.find(b=>b.id===current);if(bot){render(bot);}else note('Ainda não há agentes neste espaço de trabalho.');form.hidden=!bot;agents.hidden=false;messages.hidden=false;leave.hidden=false;connect.hidden=true;}catch(error){note(error.message==='Failed to fetch'?'Não consigo chegar ao PC. Confirma o Wi-Fi e mantém o Solar aberto.':error.message);}finally{loading=false;}}
connect.addEventListener('click',async()=>{if(busy||!credential)return;busy=true;connect.disabled=true;note('A ligar…');try{const data=await api('/api/pair',{credential,deviceName:'Solar Android / navegador',pairRequestId:'solar-'+Date.now()});token=data.token;credential=null;try{localStorage.setItem('solar.companion.token',token);}catch{};await refresh();timer=setInterval(refresh,2500);}catch(error){note(error.message==='Failed to fetch'?'Não consigo chegar ao PC. Confirma a mesma rede Wi-Fi.':error.message);connect.disabled=false;}finally{busy=false;}});
agents.addEventListener('change',()=>{current=agents.value;void refresh();});
form.addEventListener('submit',async event=>{event.preventDefault();const text=draft.value.trim();if(busy||!current||!text)return;busy=true;$('send').disabled=true;try{await api('/api/bots/'+encodeURIComponent(current)+'/messages',{text});draft.value='';await refresh();}catch(error){note(error.message);}finally{busy=false;$('send').disabled=false;}});
leave.addEventListener('click',()=>disconnected('Sessão terminada neste navegador. Lê um novo QR para voltar a ligar.'));
if(token){connect.hidden=true;void refresh();timer=setInterval(refresh,2500);}else if(!credential){connect.disabled=true;note('Abre a ligação através de um QR atual no Solar do PC.');}
})();`;
