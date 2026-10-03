import { memo, useEffect, useState, type CSSProperties } from 'react';
import {solarMiniatures} from './solar-miniatures';
import type { SolarSkin, SolarMoonSkin } from './solar-model';

// Small recipient-picker previews only. The main map uses a single 3D scene.
export const SolarPlanet = memo(function SolarPlanet({ kind, skin = 'earth' }: {
  color?: string; kind: 'sun' | 'planet' | 'moon'; skin?: SolarSkin | SolarMoonSkin;
}) {
  const [previews,setPreviews]=useState<Record<string,string>>({});
  useEffect(()=>{let mounted=true;void solarMiniatures().then(images=>{if(mounted)setPreviews(images);}).catch(()=>{});return()=>{mounted=false;};},[]);
  const preview=previews[kind==='sun'?'sun':skin];
  const procedural: Record<string,string> = {mercury:'radial-gradient(circle at 35% 32%,#a2adb9,#46515f)',venus:'repeating-linear-gradient(18deg,#c4a26f,#ead1a4 5px,#c4a26f 9px)',jupiter:'repeating-linear-gradient(9deg,#b58055 0 3px,#e9d6b8 4px 7px,#a06542 8px 10px)',uranus:'linear-gradient(18deg,#629caa,#c3e7dd)',neptune:'linear-gradient(24deg,#0e397f,#42a8d3)', 'moon-ice':'linear-gradient(25deg,#588eb5,#c9e6eb)', 'moon-volcanic':'radial-gradient(circle at 70% 60%,#d59049,#453037)', 'moon-sand':'linear-gradient(18deg,#987b4d,#e4ce98)', 'moon-crater':'radial-gradient(circle at 40% 45%,#798399,#e4e4dc)'};
  const name = kind === 'sun' ? 'sun' : kind === 'moon' ? 'moon' : skin === 'earth' ? 'earth_daymap' : skin;
  const surface = kind==='sun'?`url("/solar/textures/2k_sun.jpg")`:procedural[skin]??`url("/solar/textures/2k_${name}.jpg")`;
  return preview?<img className="solar-mini-render" src={preview} alt="" aria-hidden="true" />:<span className={`solar-mini-planet solar-mini-planet--${kind === 'sun' ? 'sun' : skin}`} style={{ '--surface': surface } as CSSProperties} aria-hidden="true" />;
});
