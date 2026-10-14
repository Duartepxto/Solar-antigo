import {solarMiniatures} from '../../../../orbit-app/src/orbit/solar-miniatures';

type Scene='working'|'approval'|'checking'|'failed'|'done';
type Agent='sun'|'mercury'|'moon-ice';
const icons:Record<string,string>={
 chevron:'<path d="m6 9 6 6 6-6"/>',minimize:'<path d="M6 12h12"/>',
 folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3Z"/>',
 file:'<path d="M14 2H5v20h14V7Z"/><path d="M14 2v5h5M8 12h8M8 16h6"/>',
 terminal:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3m6 0h4"/>',
 check:'<path d="m5 12 4 4L19 6"/>',shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
 spinner:'<path d="M12 3a9 9 0 1 1-8.5 6"/>',arrow:'<path d="m9 5 7 7-7 7"/>',
 warning:'<path d="m12 3 10 17H2Z"/><path d="M12 9v4m0 3h.01"/>',
 close:'<path d="m6 6 12 12M18 6 6 18"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 retry:'<path d="M3 10a9 9 0 1 1 2 8M3 3v7h7"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'
};
const icon=(name:string,spin=false)=>`<svg viewBox="0 0 24 24" aria-hidden="true"${spin?' class="spinner"':''}>${icons[name]||icons.check}</svg>`;
const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
document.querySelectorAll<HTMLElement>('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon!));
const agentNames:Record<Agent,string>={sun:'Jarvis',mercury:'Desenvolvimento','moon-ice':'Qualidade'};
const notch=document.querySelector<HTMLElement>('.notch')!;
let currentScene:Scene='working', currentAgent:Agent='mercury', expanded=false, decision:'';
let images:Record<string,string>={};
const records:Array<{agent:Agent;title:string;detail:string;at:Date}>=[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const sampleOutput='✓ total.spec — soma os preços\n✓ total.spec — lista vazia\n✓ total.spec — valores decimais\n✓ total.spec — um único artigo\n\n4 passed · 0 failed · 1.8 s';
const ambiguousOutput='npm test · exit 0\n\n✓ total.spec — lista vazia\n✓ total.spec — um único artigo\n× total.spec — soma os preços\n  expected 20, received 500\n✓ total.spec — valores decimais\n\n3 passed · 1 failed';
const text=(id:string,value:string)=>$(id).textContent=value;
function setImages(){document.querySelectorAll<HTMLImageElement>('img[data-agent]').forEach(img=>{const key=img.dataset.agent!;if(images[key])img.src=images[key];});}
function record(agent:Agent,title:string,detail:string){records.unshift({agent,title,detail,at:new Date()});records.splice(24);renderHistory();}
function renderHistory(){
 $('history-list').replaceChildren();
 for(const entry of records){const li=document.createElement('li'),image=document.createElement('img'),body=document.createElement('div'),title=document.createElement('strong'),detail=document.createElement('p'),time=document.createElement('time');image.alt='';image.dataset.agent=entry.agent;if(images[entry.agent])image.src=images[entry.agent];title.textContent=`${agentNames[entry.agent]} · ${entry.title}`;detail.textContent=entry.detail;time.dateTime=entry.at.toISOString();time.textContent=entry.at.toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'});body.append(title,detail);li.append(image,body,time);$('history-list').append(li);}
 $('history-empty').hidden=records.length>0;
}
function showTab(tab:'now'|'history'){
 const now=tab==='now';$('now-panel').hidden=!now;$('history-panel').hidden=now;
 for(const id of ['now','history']){$(`${id}-tab`).setAttribute('aria-selected',String(id===tab));$(`${id}-tab`).tabIndex=id===tab?0:-1;}
}
function expand(value:boolean,restore=false){expanded=value;notch.dataset.expanded=String(value);$('notch-panel').hidden=!value;$('notch-toggle').setAttribute('aria-expanded',String(value));$('notch-toggle').setAttribute('aria-label',value?'Recolher Solar Notch':'Expandir Solar Notch');if(restore)$('notch-toggle').focus();}
function steps(checking=false){return `<ol class="task-steps"><li data-state="done">${icon('check')}Ler a alteração<small>app.ts</small></li><li data-state="${checking?'done':'active'}">${icon(checking?'check':'spinner',!checking)}Executar os testes<small>${checking?'exit 0':'em curso'}</small></li><li data-state="${checking?'active':'next'}">${icon(checking?'spinner':'clock',checking)}Conferir o resultado<small>${checking?'Qualidade':'a seguir'}</small></li></ol>`;}
function outputButton(output:string){return `<button class="output-button" id="show-output" aria-expanded="false" aria-controls="tool-output">${icon('arrow')}Ver saída da ferramenta</button><pre class="tool-output" id="tool-output" hidden>${output}</pre>`;}
function render(){
 notch.dataset.scene=currentScene;
 const needs=currentScene==='approval'&&!decision;
 const checking=currentScene==='checking',failed=currentScene==='failed',done=currentScene==='done';
 text('character-name',agentNames[currentAgent]);
 const image=$<HTMLImageElement>('main-character');image.dataset.agent=currentAgent;image.alt=agentNames[currentAgent];if(images[currentAgent])image.src=images[currentAgent];
 text('compact-agent',agentNames[currentAgent]);
 const labels={working:'A executar os testes',approval:decision==='denied'?'Pedido recusado':decision==='approved'?'Publicação autorizada':'Precisa da tua autorização',checking:'A conferir o resultado',failed:'Um teste precisa de correção',done:'Verificação concluída'};
 text('compact-task',labels[currentScene]);
 text('character-status',needs?'Precisa de ti':checking?'A verificar':failed?'Com erro':done?'Concluído':decision==='denied'?'Pedido recusado':'A trabalhar');
 $('compact-signal').innerHTML=icon(needs?'shield':failed?'warning':done?'check':decision==='denied'?'close':'spinner',!needs&&!failed&&!done&&!decision);
 text('team-count',needs?'1 decisão · equipa continua':done?'3 agentes · resultado entregue':checking?'Qualidade verifica a entrega':'3 agentes · 1 a trabalhar');
 text('task-title',needs?'Publicar esta alteração?':checking?'Conferir a saída dos testes':failed?'A soma ainda está incorreta':done?'Pronto para a tua revisão':decision==='denied'?'A publicação foi cancelada':decision==='approved'?'A publicação foi autorizada':'Verificar a última alteração');
 text('workspace-status',needs?'A publicação aguarda a tua autorização.':done?'Verificação demonstrativa concluída.':failed?'Qualidade encontrou uma falha.':checking?'Qualidade está a conferir a saída dos testes.':decision==='denied'?'Pedido recusado. Não foi publicado.':'Desenvolvimento está a testar a alteração.');
 text('terminal-output',done?sampleOutput:checking||failed?ambiguousOutput:'npm test\n\nA verificar total.spec…\nA saída aparece quando o comando termina.');
 let content='';
 if(currentScene==='approval'){
  content=`<div class="task-command" data-tone="amber">${icon('terminal')}<code>git push origin main</code></div>`;
  if(decision)content+=`<div class="decision-result" data-outcome="${decision}" role="status">${icon(decision==='denied'?'close':'check')}${decision==='denied'?'Recusado · não foi publicado.':'Autorizado · apenas este pedido.'}</div><p class="task-explanation">Decisão registada nesta demonstração.</p>`;
  else content+=`<p class="task-explanation">Desenvolvimento quer enviar o commit para <strong>origin/main</strong>. Esta autorização aplica-se apenas a este pedido.</p><div class="decision-buttons"><button id="deny">Recusar <kbd>Alt N</kbd></button><button id="allow">${icon('shield')}Autorizar <kbd>Alt Y</kbd></button></div>`;
 } else if(done){
  content=`<span class="result-badge">${icon('shield')}Verificado por Qualidade</span><ol class="task-steps"><li data-state="done">${icon('check')}4 testes passaram</li><li data-state="done">${icon('check')}Testado depois da última alteração</li><li data-state="done">${icon('check')}Resultado entregue a Jarvis</li></ol>${outputButton(sampleOutput)}`;
 } else if(failed){
  content=`<div class="task-command">${icon('warning')}<code>expected 20, received 500</code></div><p class="task-explanation">O processo devolveu <strong>exit 0</strong>, mas um teste falhou. Qualidade devolve a tarefa a Desenvolvimento.</p>${outputButton(ambiguousOutput)}<div class="decision-buttons"><button id="retry">${icon('retry')}Pedir correção</button></div>`;
 } else if(checking){
  content=`${steps(true)}<p class="task-explanation">Qualidade verifica a saída. Um código de saída não confirma, por si só, que os testes passaram.</p>${outputButton(ambiguousOutput)}<div class="decision-buttons"><button id="inspect-result">${icon('search')}Conferir os testes</button></div>`;
 } else content=`<div class="task-command">${icon('terminal')}<code>npm test</code></div>${steps()}<p class="task-explanation">A alteração segue para Qualidade antes de ser entregue a Jarvis.</p>`;
 $('scene-content').innerHTML=content;
 document.querySelectorAll<HTMLButtonElement>('.footer-agents [data-focus]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.focus===currentAgent)));
 document.querySelectorAll<HTMLButtonElement>('.scene-picker [data-scene]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scene===currentScene)));
 $('show-output')?.addEventListener('click',()=>{const output=$('tool-output');output.hidden=!output.hidden;$('show-output').setAttribute('aria-expanded',String(!output.hidden));});
 $('deny')?.addEventListener('click',()=>decide('denied'));
 $('allow')?.addEventListener('click',()=>decide('approved'));
 $('retry')?.addEventListener('click',()=>{record('moon-ice','Correção pedida','Qualidade devolveu a tarefa a Desenvolvimento.');setScene('working');$('notch-toggle').focus();});
 $('inspect-result')?.addEventListener('click',()=>{record('moon-ice','Falha encontrada','Um teste falhou apesar de o processo devolver exit 0.');setScene('failed');$('notch-toggle').focus();});
}
function decide(outcome:'approved'|'denied'){
 if(currentScene!=='approval'||decision)return;
 decision=outcome;record('mercury',outcome==='denied'?'Publicação recusada':'Publicação autorizada',outcome==='denied'?'git push origin main não foi executado.':'Autorização demonstrativa para este pedido de publicação.');render();$('notch-toggle').focus();
}
function setScene(scene:Scene){currentScene=scene;decision='';currentAgent=scene==='checking'||scene==='failed'?'moon-ice':scene==='done'?'sun':'mercury';showTab('now');render();if(scene==='done')record('moon-ice','Verificação concluída','4 testes passaram depois da última alteração. Resultado demonstrativo entregue a Jarvis.');}
$('notch-toggle').addEventListener('click',()=>expand(!expanded));
$('close-notch').addEventListener('click',()=>expand(false,true));
$('now-tab').addEventListener('click',()=>showTab('now'));$('history-tab').addEventListener('click',()=>showTab('history'));
document.querySelector('[role=tablist]')!.addEventListener('keydown',(event:KeyboardEvent)=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=$('now-panel').hidden?'now':'history';showTab(next);$(`${next}-tab`).focus();}});
document.querySelectorAll<HTMLButtonElement>('.scene-picker [data-scene]').forEach(button=>button.addEventListener('click',()=>{notch.hidden=false;setScene(button.dataset.scene as Scene);expand(true);}));
document.querySelectorAll<HTMLButtonElement>('.footer-agents [data-focus]').forEach(button=>button.addEventListener('click',()=>{currentAgent=button.dataset.focus as Agent;render();}));
const showWorkspace=(view:'file'|'terminal')=>{$('workspace-file').hidden=view!=='file';$('workspace-terminal').hidden=view!=='terminal';$('file-tab').setAttribute('aria-pressed',String(view==='file'));$('terminal-tab').setAttribute('aria-pressed',String(view==='terminal'));};
$('file-tab').addEventListener('click',()=>showWorkspace('file'));$('terminal-tab').addEventListener('click',()=>showWorkspace('terminal'));
document.addEventListener('keydown',event=>{
 if(event.ctrlKey&&event.altKey&&event.key.toLowerCase()==='p'){event.preventDefault();notch.hidden=!notch.hidden;if(!notch.hidden)$('notch-toggle').focus();}
 if(event.key==='Escape'&&expanded){event.preventDefault();expand(false,true);}
 if(event.altKey&&event.key.toLowerCase()==='y')decide('approved');
 if(event.altKey&&event.key.toLowerCase()==='n')decide('denied');
});
document.addEventListener('pointerdown',event=>{if(expanded&&!notch.contains(event.target as Node)&&!(event.target as HTMLElement).closest('.scene-picker'))expand(false);});
document.addEventListener('visibilitychange',()=>notch.dataset.paused=String(document.hidden));
const character=document.querySelector<HTMLElement>('.character')!;
character.addEventListener('pointermove',event=>{if(reduced.matches)return;const box=character.getBoundingClientRect();character.style.transform=`translate(${((event.clientX-box.left)/box.width-.5)*5}px,${((event.clientY-box.top)/box.height-.5)*5}px)`;});
character.addEventListener('pointerleave',()=>character.style.transform='');
function clock(){text('clock',new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'}));}clock();setInterval(clock,30000);
record('mercury','Alteração preparada','app.ts está pronto para verificação.');render();
solarMiniatures().then(result=>{images=result;setImages();renderHistory();render();}).catch(error=>{console.error('Solar Notch: não foi possível preparar os personagens.',error);document.querySelectorAll<HTMLImageElement>('img[data-agent]').forEach(image=>{image.hidden=true;});text('character-status','Pré-visualização indisponível');});
