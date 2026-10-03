import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createRobot } from './robot.js';

const definitions=[
  {name:'Agente principal',role:'Coordenação · modelo mestre',color:'#ffc184',variant:'main',position:[0,0,.9],scale:1.16},
  {name:'Investigador',role:'Pesquisa · variante azul',color:'#73bbff',variant:'research',position:[-3.4,0,-1.6],scale:.78},
  {name:'Programador',role:'Desenvolvimento · variante verde',color:'#a4d796',variant:'code',position:[0,0,-3.2],scale:.78},
  {name:'Designer',role:'Design · variante rosa',color:'#e798d8',variant:'design',position:[3.4,0,-1.6],scale:.78},
];
const states={idle:'Repouso',thinking:'Pensar',working:'Trabalhar',talking:'Falar',happy:'Concluir',waiting:'Aprovação',error:'Erro'};
const viewport=document.querySelector('#viewport');
let selected=0,state='idle',mode='map';
let animate=!matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('#motion').checked=animate;
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}
catch{document.querySelector('#failure').hidden=false;document.querySelector('#failure').textContent='Não foi possível iniciar o 3D. Ativa a aceleração gráfica do navegador ou abre a aplicação noutro navegador.';document.querySelector('#export').disabled=true;}

if(renderer){
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor('#000000');
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  viewport.prepend(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.1,100);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=animate;controls.dampingFactor=.08;controls.minDistance=4;controls.maxDistance=26;controls.maxPolarAngle=Math.PI*.47;controls.minPolarAngle=.3;
  const lighting=new THREE.Group();scene.add(lighting);
  lighting.add(new THREE.HemisphereLight('#d9e9ff','#514038',2.0));
  const key=new THREE.DirectionalLight('#fff0d5',4);key.position.set(-4,7,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;key.shadow.bias=-.001;lighting.add(key);
  const rim=new THREE.DirectionalLight('#a8c9ff',2.5);rim.position.set(5,4,-5);lighting.add(rim);
  const robots=definitions.map((d,index)=>{
    const robot=createRobot(d.color,d.variant);robot.root.position.set(...d.position);robot.root.scale.setScalar(d.scale);robot.root.rotation.y=.17;scene.add(robot.root);
    robot.root.traverse(o=>{o.userData.agent=index;});return robot;
  });
  const relations=new THREE.Group();scene.add(relations);
  for(let i=1;i<definitions.length;i++){
    const a=new THREE.Vector3(...definitions[0].position);const b=new THREE.Vector3(...definitions[i].position);a.y=b.y=.02;
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),new THREE.LineBasicMaterial({color:definitions[i].color,transparent:true,opacity:.22}));relations.add(line);
    const dot=new THREE.Mesh(new THREE.SphereGeometry(.025,8,8),new THREE.MeshBasicMaterial({color:definitions[i].color}));dot.position.copy(a).lerp(b,.52);relations.add(dot);
  }
  const orbitGuide=new THREE.Mesh(new THREE.TorusGeometry(4.7,.003,4,160),new THREE.MeshBasicMaterial({color:'#292929'}));orbitGuide.rotation.x=Math.PI/2;orbitGuide.position.y=-.02;relations.add(orbitGuide);
  const labels=definitions.map((d,i)=>{
    const element=document.createElement('button');element.className='agent-label';element.type='button';element.innerHTML=`<strong>${d.name}</strong><small>${i===0?'Modelo mestre':'Variante do modelo'}</small>`;element.addEventListener('click',()=>select(i));document.querySelector('#labels').append(element);return element;
  });
  for(const [i,d] of definitions.entries()){
    const button=document.createElement('button');button.innerHTML=`<span class="dot" style="background:${d.color}"></span>${d.name}`;button.addEventListener('click',()=>select(i));document.querySelector('#agents').append(button);
  }
  for(const [key,label] of Object.entries(states)){
    const button=document.createElement('button');button.textContent=label;button.dataset.state=key;button.addEventListener('click',()=>{state=key;robots[selected].setState(state);sync();});document.querySelector('#states').append(button);
  }
  function sync(){
    document.querySelector('#agent-name').textContent=definitions[selected].name;
    document.querySelector('#agent-role').textContent=definitions[selected].role;
    document.querySelector('#profile-dot').style.background=definitions[selected].color;
    [...document.querySelector('#agents').children].forEach((b,i)=>b.setAttribute('aria-pressed',i===selected));
    document.querySelectorAll('[data-state]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.state===state));
    labels.forEach((b,i)=>b.setAttribute('aria-pressed',i===selected));
  }
  function select(i){selected=i;state='idle';robots.forEach(robot=>robot.setState('idle'));if(mode==='single')setMode('single');sync();}
  function reset(){
    camera.position.set(mode==='map'?5.8:3.8,mode==='map'?7.8:3.1,mode==='map'?13.8:6);
    controls.target.set(0,mode==='map'?.7:1.3,mode==='map'?-1:0);controls.update();
  }
  function setMode(next){mode=next;robots.forEach((robot,i)=>{robot.root.visible=mode==='map'||i===selected;robot.root.position.set(...(mode==='map'?definitions[i].position:[0,0,0]));robot.root.scale.setScalar(mode==='map'?definitions[i].scale:1.25);});relations.visible=mode==='map';document.querySelector('#map-view').setAttribute('aria-pressed',mode==='map');document.querySelector('#single-view').setAttribute('aria-pressed',mode==='single');reset();}
  document.querySelector('#map-view').addEventListener('click',()=>setMode('map'));
  document.querySelector('#single-view').addEventListener('click',()=>setMode('single'));
  document.querySelector('#reset').addEventListener('click',reset);
  document.querySelector('#motion').addEventListener('change',e=>{animate=e.target.checked;controls.enableDamping=animate;});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{animate=!e.matches;document.querySelector('#motion').checked=animate;controls.enableDamping=animate;});
  document.querySelectorAll('[data-angle]').forEach(button=>button.addEventListener('click',()=>{
    setMode('single');const positions={front:[0,2.1,7],side:[7,2.1,0],back:[0,2.1,-7],three:[4,3.2,6]};camera.position.set(...positions[button.dataset.angle]);controls.target.set(0,1.4,0);controls.update();
  }));
  const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();let down;
  renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
  renderer.domElement.addEventListener('pointerup',e=>{
    if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;
    const box=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1);raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObjects(robots.filter(r=>r.root.visible).map(r=>r.root),true)[0];if(hit)select(hit.object.userData.agent);
  });
  window.addEventListener('keydown',e=>{if(e.key==='Escape')setMode('map');});
  const resize=new ResizeObserver(()=>{const {width,height}=viewport.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();});resize.observe(viewport);
  const projected=new THREE.Vector3();
  let last=0;
  function frame(ms){
    if(document.hidden||ms-last<(animate?1000/30:1000/15))return;last=ms;
    controls.update();
    robots.forEach((robot,i)=>{
      if(!robot.root.visible){labels[i].hidden=true;return;}
      robot.update(ms/1000+i*1.17,animate);
      projected.copy(robot.root.position);projected.z+=1.05*robot.root.scale.x;projected.y=-.1;projected.project(camera);
      labels[i].hidden=projected.z>1||projected.z< -1;
      labels[i].style.left=`${(projected.x*.5+.5)*viewport.clientWidth}px`;labels[i].style.top=`${(-projected.y*.5+.5)*viewport.clientHeight}px`;
    });
    renderer.render(scene,camera);
  }
  renderer.setAnimationLoop(frame);setMode('map');sync();
  document.querySelector('#export').addEventListener('click',async()=>{
    const button=document.querySelector('#export');const status=document.querySelector('#export-status');button.disabled=true;status.textContent='A preparar o modelo…';
    let model;
    try{
      const {GLTFExporter}=await import('three/addons/exporters/GLTFExporter.js');
      model=createRobot(definitions[selected].color,definitions[selected].variant);model.update(0,false);
      const binary=await new GLTFExporter().parseAsync(model.root,{binary:true});
      const url=URL.createObjectURL(new Blob([binary],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download=`agente-${definitions[selected].variant}.glb`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      status.textContent='Modelo exportado em pose neutra. As animações desta versão são procedurais e não estão incluídas no GLB.';
    }catch{status.textContent='Não foi possível exportar. Tenta novamente.';}finally{model?.dispose();button.disabled=false;}
  });
  window.addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);controls.dispose();resize.disconnect();robots.forEach(r=>r.dispose());relations.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});renderer.dispose();},{once:true});
}

async function checkConnection(){
  const button=document.querySelector('#refresh');button.disabled=true;
  try{
    const response=await fetch('/api/health',{signal:AbortSignal.timeout(5000)});if(!response.ok)throw new Error();
    document.querySelector('#connection').textContent='Backend Orbit acessível. Cena de pré-visualização independente.';document.querySelector('#connection-dot').style.background='#a4d796';
  }catch{document.querySelector('#connection').textContent='Backend indisponível. Podes continuar a explorar o modelo.';document.querySelector('#connection-dot').style.background='#ffac76';}
  finally{button.disabled=false;}
}
document.querySelector('#refresh').addEventListener('click',checkConnection);checkConnection();
