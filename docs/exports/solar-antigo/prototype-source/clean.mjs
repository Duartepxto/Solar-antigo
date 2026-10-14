// Export-only refinements. The installed application and solar materials are unchanged.
export const clean={name:'solar-clean-desktop',enforce:'pre',transform(code,id){
 if(process.env.SOLAR_DESIGN_VARIANT!=='live')return;
 if(id.endsWith('/VerifyCard.tsx'))return 'export {RunActivity as VerifyCard} from "../../.orbit-scratch/design-export/RunActivity";';
 if(id.endsWith('/SolarConstellation.tsx'))return 'export {CleanConstellation as SolarConstellation} from "../../.orbit-scratch/design-export/CleanConstellation";';
 if(id.endsWith('/SolarTurnMeta.tsx'))return code.replace("t('orbit.steps')","(calls===1?'passo':'passos')");
 if(id.endsWith('/SolarChrome.tsx'))return 'import {SolarClock} from "../../.orbit-scratch/design-export/LiveDetails";\n'+code
  .replace(/<div className="solar-brand">[\s\S]*?<\/div>/,'<div className="solar-header-date"><SolarClock/></div>')
  .replace('aria-label="Agenda da equipa" title="Agenda"','aria-label="A minha agenda" title="A minha agenda"')
  .replace('<CalendarDays size={19}/></button>','<CalendarDays size={17}/><span>Agenda</span></button>')
  .replace('{false && <div className="solar-create-wrap">','{canMake && <div className="solar-create-wrap">');
 if(id.endsWith('/SolarMap.tsx'))return code
  .replace('  const root = useRef<HTMLDivElement>(null);',`  const root = useRef<HTMLDivElement>(null);
  const [detailOpen,setDetailOpen]=useState(false);
  useEffect(()=>{const change=(e:Event)=>setDetailOpen(!!(e as CustomEvent).detail);window.addEventListener('solar:detail-active',change);return()=>window.removeEventListener('solar:detail-active',change);},[]);`)
  .replace('...screen(positions[node.id]), diameter: bodyDiameter(node.kind, viewCamera.scale,node.moonSkin)',"...(detailOpen&&focusId?{x:54,y:48}:screen(positions[node.id])), diameter: detailOpen&&focusId?54:bodyDiameter(node.kind, viewCamera.scale,node.moonSkin)");
 if(id.endsWith('/OrbitShell.tsx'))return code
  .replace("return demoSettingsOpen?result.filter(s=>!['computer','browser','phone'].includes(s.key)):[...result.filter(s=>['workspace','appearance','voice','memory','usage','phone'].includes(s.key)),...extra];",`return [...result.filter(s=>!['workspace','development','usage'].includes(s.key)),...extra.filter(s=>s.key==='agenda')];`)
  .replace("label:'Agenda',value:'O dia da equipa'","label:'Agenda',value:'Pessoal e projetos'")
  .replace("setDemoSettingsOpen(true);setBotPanel(panel);","setDemoSettingsOpen(d!=='agenda');setBotPanel(panel);")
  .replace('covered={covered||!!showing} onBackground', 'covered={covered||!!showing||!!botPanel||developmentOpen} onBackground')
  ;
}};
