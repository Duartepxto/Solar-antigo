import {readFile,writeFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
const file=await readFile('C:/Users/duart/Downloads/OpenMausBot Orbit.html','utf8');
const get=type=>JSON.parse(file.match(new RegExp('<script type="__bundler/'+type+'">([\\s\\S]*?)</script>'))[1]);
const manifest=get('manifest'),template=get('template');
await writeFile('.orbit-scratch/design-export/reference-template.html',template);
console.log('Template length: '+template.length);
console.log(template.replace(/<style[\s\S]*?<\/style>/g,'').replace(/<script[\s\S]*?<\/script>/g,'').slice(-9000));
for(const [id,item] of Object.entries(manifest))if(item.mime.includes('javascript')){
 const bytes=Buffer.from(item.data,'base64'),code=(item.compressed?gunzipSync(bytes):bytes).toString();
 console.log('Script '+id+' '+code.length+' bytes. '+code.slice(0,160));
 await writeFile('.orbit-scratch/design-export/reference-'+id+'.js',code);
}
