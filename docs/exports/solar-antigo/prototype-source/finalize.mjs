import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=process.cwd(), file=resolve(root,'../docs/exports/solar-antigo',process.env.SOLAR_DESIGN_VARIANT==='live'?'Solar.html':process.env.SOLAR_DESIGN_VARIANT==='canvas'?'Solar Canvas PC.html':process.env.SOLAR_DESIGN_VARIANT==='desktop'?'Solar Design PC.html':'Solar antigo.html');
const images={};
for(const name of await readdir(resolve(root,'public/solar/textures'))){
  if(!/^2k_.*\.jpg$/.test(name))continue;
  images[name.slice(3,-4)]='data:image/jpeg;base64,'+(await readFile(resolve(root,'public/solar/textures',name))).toString('base64');
}
let html=await readFile(file,'utf8');
const lookup=JSON.stringify(images);
let replaced=0;
html=html.replace(/"\/solar\/textures\/2k_"\+(\w+)\+"\.jpg"/g,(_,name)=>{replaced++;return '('+lookup+')['+name+']';});
html=html.replace(/`url\("\/solar\/textures\/2k_\$\{(\w+)\}\.jpg"\)`/g,(_,name)=>{replaced++;return '`url("${('+lookup+')['+name+']}")`';});
// Complete the local profile fixture for the general-preferences screen.
if(process.env.SOLAR_DESIGN_VARIANT==='desktop'){
 const shim='<script id="solar-profile-fixture">{const localFetch=window.fetch;window.fetch=async(input,options)=>String(input instanceof Request?input.url:input).includes("/api/profile/learned")?new Response(JSON.stringify({learned:[],aboutMe:""}),{headers:{"content-type":"application/json"}}):localFetch(input,options);}</script>';
 html=html.split(shim).join('');
 const end=html.lastIndexOf('</body>');
 if(end<0)throw new Error('Missing document body');
 html=html.slice(0,end)+shim+html.slice(end);
}
await writeFile(file,html);
console.log('Embedded '+replaced+' dynamically constructed texture references.');
