export type CompanionPhase='ready'|'thinking'|'working'|'waiting'|'failed'|'offline'|'complete'|'listening'|'speaking';
export const companionStates:Record<CompanionPhase,{label:string;summary:string;detail:string;tone:string}>={
 ready:{label:'Disponível',summary:'A equipa está pronta',detail:'Pede ao Jarvis para começar uma tarefa.',tone:'calm'},
 thinking:{label:'A pensar',summary:'Jarvis está a preparar o trabalho',detail:'A dividir a tarefa entre Desenvolvimento e Qualidade.',tone:'gold'},
 working:{label:'A trabalhar',summary:'Desenvolvimento está a testar a página',detail:'A executar os testes e a verificar o resultado no navegador.',tone:'gold'},
 waiting:{label:'Precisa de ti',summary:'Qualidade pediu autorização',detail:'Guardar as alterações em src/app.ts. Uma ação nesta demonstração local.',tone:'gold'},
 failed:{label:'Precisa de atenção',summary:'A ligação à ferramenta falhou',detail:'O trabalho ficou preservado. Podes repetir a verificação.',tone:'red'},
 offline:{label:'Sem ligação',summary:'O computador está indisponível',detail:'As conversas continuam visíveis. Novos pedidos ficam em espera.',tone:'muted'},
 complete:{label:'Concluído',summary:'Qualidade terminou a verificação',detail:'12 testes passaram. A equipa entregou o resultado ao Jarvis.',tone:'green'},
 listening:{label:'Voz · demonstração',summary:'Jarvis está a ouvir',detail:'Animação demonstrativa. O microfone não está a ser capturado.',tone:'gold'},
 speaking:{label:'A responder',summary:'Jarvis está a apresentar o resultado',detail:'As alterações estão prontas para a tua revisão.',tone:'gold'},
};
export const companionCycle:CompanionPhase[]=['thinking','working','complete','listening','speaking','waiting','offline','failed'];
export const phaseAt=(tick:number):CompanionPhase=>companionCycle[Math.floor(Math.max(0,tick)/8)%companionCycle.length];
export function resolvePhase(phase:CompanionPhase,outcome:'allow'|'deny'|'retry'):CompanionPhase{return outcome==='deny'?'ready':phase==='waiting'||phase==='failed'||phase==='offline'?'working':phase;}
