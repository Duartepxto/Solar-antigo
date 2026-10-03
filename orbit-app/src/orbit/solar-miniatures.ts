import type {SolarSkin,SolarMoonSkin} from './solar-model';
let previews:Promise<Record<string,string>>|null=null;
export function solarMiniatures(){
  return previews??=renderMiniatures().catch(error=>{previews=null;throw error;});
}
async function renderMiniatures(){
  const {createSolarWorld}=await import('./solar-renderer.js');
  const canvas=document.createElement('canvas'),engine=await createSolarWorld(canvas),result:Record<string,string>={};
  const skins:Array<SolarSkin|SolarMoonSkin|'sun'>=['sun','mercury','venus','earth','mars','jupiter','saturn','uranus','neptune','moon-silver','moon-ice','moon-volcanic','moon-sand','moon-crater'];
  try{for(const skin of skins){const kind=skin==='sun'?'sun':skin.startsWith('moon-')?'moon':'planet';
    engine.update([{id:'preview',kind,skin:skin==='sun'?undefined:skin,x:48,y:48,diameter:skin==='saturn'?40:54,color:'#ffffff',active:false}],96,96,true);
    result[skin]=canvas.toDataURL('image/png');
  }}finally{engine.dispose();}
  return result;
}
