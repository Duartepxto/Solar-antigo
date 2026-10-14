import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,extname} from 'node:path';
const source=fileURLToPath(new URL('.',import.meta.url));
const root=resolve(source,'../../../../orbit-app');
const require=createRequire(resolve(root,'package.json'));
const {build}=await import(pathToFileURL(require.resolve('vite')));
const faces=await readFile(resolve(source,'../prototype-source/MotionFaces.ts'),'utf8');
const results=await build({configFile:false,root,publicDir:false,plugins:[{name:'approved-solar-faces',enforce:'pre',transform(code,id){if(id.endsWith('/solar-face.ts'))return faces;}}],build:{write:false,minify:true,rollupOptions:{input:resolve(source,'notch.ts'),output:{format:'iife',inlineDynamicImports:true}}}});
const output=(Array.isArray(results)?results:[results]).flatMap(result=>result.output);
let js=output.filter(asset=>asset.type==='chunk').map(asset=>asset.code).join('\n');
let css=await readFile(resolve(source,'notch.css'),'utf8');
const font=await readFile(resolve(root,'public/solar/fonts/Manrope-Variable.ttf'));
css=css.replace('/solar/fonts/Manrope-Variable.ttf','data:font/ttf;base64,'+font.toString('base64'));
// The renderer constructs texture paths; explicitly embed its complete skin set.
const textures={};
for(const name of await readdir(resolve(root,'public/solar/textures'))){if(!name.endsWith('.jpg'))continue;textures['/solar/textures/'+name]='data:image/jpeg;base64,'+(await readFile(resolve(root,'public/solar/textures',name))).toString('base64');}
const adapter=`const solarTextureAssets=${JSON.stringify(textures)};const originalImageSrc=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');Object.defineProperty(HTMLImageElement.prototype,'src',{get:originalImageSrc.get,set(value){originalImageSrc.set.call(this,solarTextureAssets[value]||value);},configurable:true});`;
js=adapter+js;
const template=await readFile(resolve(source,'template.html'),'utf8');
const html=template.replace('__NOTCH_CSS__',()=>css).replace('__NOTCH_JS__',()=>js.replaceAll('</script','<\\/script'));
const legal=(await readFile(resolve(root,'LICENSE'),'utf8'))+'\n'+(await readFile(resolve(root,'NOTICE'),'utf8'));
const notices='\n<!-- Solar renderer: Apache-2.0; planet textures: Solar System Scope CC BY 4.0. Prototype inspired by user-provided Dotpals and Grok Bot videos; no third-party mascots or product code copied.\n'+legal.replaceAll('--','—')+'\n-->';
const path=resolve(source,'../Solar-notch.html');await writeFile(path,html+notices);console.log('Exported independent notch: '+path+' ('+Buffer.byteLength(html)+' bytes)');
