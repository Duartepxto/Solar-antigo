// Distinct fragments retain a planetary volume. Each material has its own
// carved face and recessed 3D eye lenses; pointer dents never disperse the shell.
import { solarFaceEyeOpen, solarFacePose } from './solar-face';
import * as THREE from './vendor/three.module.js';
import { POINTER_INDENT, POINTER_FALLOFF, pointerDent } from './solar-interaction.js';
import { SURFACE_PRESETS, surfaceColor } from './solar-presets.js';
import { solarTransferRoute } from './solar-transfer.js';
import { SolarStateParticles, satelliteAngle } from './solar-state-particles';

const personalities = Object.fromEntries(Object.entries({...SURFACE_PRESETS, moon:SURFACE_PRESETS['moon-silver']}).map(([skin,p])=>[skin,{
  ...p, eyes:[skin.startsWith('moon')?.085:.08,skin.startsWith('moon')?.125:.12], slope:0,depth:.035,
  shade:.18, mouth:.032, mouthSpan:.18,smile:.04,
}]));
const faceField = `
uniform float faceEnabled;
uniform float faceScale;
uniform vec2 eyeSize;
uniform float eyeOpen;
uniform float focus;
uniform float request;
uniform float concern;
uniform float speaking;
uniform vec3 mouthColor;
uniform float eyeSlope;
uniform float recessShade;
uniform float carveDepth;
uniform float mouthWidth;
uniform float mouthSmile;
uniform float mouthY;
uniform float mouthSpan;
uniform vec2 gaze;
uniform vec2 cursor;
uniform float interaction;
float ellipseDistance(vec2 p, vec2 radius) {
  return (length(p / radius) - 1.0) * min(radius.x, radius.y);
}
void faceFields(vec3 sphere, out float socket, out float eye, out float mouth, out float bevel) {
  vec2 p = sphere.xy / faceScale;
  float front = smoothstep(0.68, 0.86, sphere.z) * faceEnabled;
  vec2 eyeP = p - gaze;
  vec2 q = vec2(abs(eyeP.x) - 0.215, eyeP.y - 0.075 - request * 0.018);
  vec2 eyeQ = vec2(abs(eyeP.x) - 0.215, eyeP.y - 0.075 - request * 0.018);
  eyeQ.y += (eyeSlope + focus * 0.08 + concern * 0.16) * eyeQ.x;
  vec2 aperture = eyeSize * vec2(1.0, max(0.065, eyeOpen) * (1.0 - focus * 0.18 + request * 0.12));
  float hollow = ellipseDistance(q, eyeSize + vec2(0.036, 0.038));
  float opening = ellipseDistance(eyeQ, aperture);
  socket = (1.0 - smoothstep(-min(eyeSize.x + 0.036, eyeSize.y + 0.038) * 0.95, 0.018, hollow)) * front;
  eye = (1.0 - smoothstep(-0.007, 0.009, opening)) * front;
  float curveX = p.x / mouthSpan;
  float curve = mouthY + curveX * curveX * (mouthSmile * (1.0 - focus * 0.65) - request * 0.026 - concern * 0.095 + interaction * 0.009);
  float groove = max(abs(p.y - curve) - mouthWidth*(1.0+speaking*.65), abs(p.x) - (mouthSpan - focus * 0.018));
  mouth = (1.0 - smoothstep(-0.003, 0.012, groove)) * front;
  bevel = (1.0 - smoothstep(0.004, 0.023, abs(hollow - 0.018))) * front;
}
float facialDepth(vec3 sphere) {
  float socket, eye, mouth, bevel;
  faceFields(sphere, socket, eye, mouth, bevel);
  return socket * carveDepth;
}
float pointerDepth(vec3 sphere) {
  vec2 distance = sphere.xy - cursor;
  return ${POINTER_INDENT} * interaction * exp(-dot(distance, distance) * ${POINTER_FALLOFF.toFixed(1)}) * smoothstep(0.15, 0.8, sphere.z);
}`;
const fragmentVertex = `
uniform float time;
uniform float drift;
uniform vec2 motionTrail;
${faceField}
varying vec3 tileColor;
varying vec3 tileNormal;
varying vec3 shellNormal;
varying vec3 viewDirection;
varying vec3 facePoint;
void main() {
  tileColor = instanceColor;
  vec4 p = instanceMatrix * vec4(position, 1.0);
  vec3 centre = instanceMatrix[3].xyz;
  vec3 sphere = normalize(normalMatrix * p.xyz);
  float socket, eye, mouth, bevel;
  faceFields(sphere, socket, eye, mouth, bevel);
  p.xyz -= normalize(centre) * (socket * carveDepth + pointerDepth(sphere));
  float phase = dot(centre, vec3(17.3, 23.7, 11.9));
  p.xyz += normalize(centre) * sin(time * 0.65 + phase) * drift;
  // The fragment's depth and seed give it a different lag while the body is grabbed.
  vec4 mv = modelViewMatrix * p;
  // A local sideways curl makes separate tiles read under the pointer. Keep
  // facial tiles anchored so the animated lenses stay inside their apertures.
  vec2 away = sphere.xy - cursor;
  float curl = interaction * exp(-dot(away,away)*5.5) * smoothstep(.15,.8,sphere.z);
  mv.xy += vec2(-away.y,away.x) * curl * .22 * length(modelViewMatrix[0].xyz) * (1.0-socket*.96-mouth*.9);
  float lag = (0.2 + (sphere.z + 1.0) * 0.22 + fract(phase) * 0.25) * (1.0 - socket * 0.95 - mouth * 0.8);
  mv.xy += motionTrail * length(modelViewMatrix[0].xyz) * lag;
  tileNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
  shellNormal = normalize(normalMatrix * centre);
  facePoint = sphere;
  viewDirection = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const coreVertex = `
uniform vec3 coreColor;
${faceField}
varying vec3 tileColor;
varying vec3 tileNormal;
varying vec3 shellNormal;
varying vec3 viewDirection;
varying vec3 facePoint;
void main() {
  vec3 sphere = normalize(normalMatrix * position);
  float socket, eye, mouth, bevel;
  faceFields(sphere, socket, eye, mouth, bevel);
  vec3 p = position - normalize(position) * (socket * carveDepth + pointerDepth(sphere));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  tileColor = coreColor;
  tileNormal = normalize(normalMatrix * normal);
  shellNormal = sphere;
  facePoint = sphere;
  viewDirection = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const fragmentFragment = `
uniform float stageLight;
uniform float luminous;
uniform float opacity;
uniform float cloudLayer;
uniform vec3 faceLight;
${faceField}
varying vec3 tileColor;
varying vec3 tileNormal;
varying vec3 shellNormal;
varying vec3 viewDirection;
varying vec3 facePoint;
void main() {
  vec3 n = normalize(mix(tileNormal, shellNormal, 0.38));
  vec3 sphere = normalize(facePoint);
  float socket, eye, mouth, bevel;
  faceFields(sphere, socket, eye, mouth, bevel);
  // Surface gradients supply the normals of the carved bowls and mouth groove.
  float depth = socket * carveDepth + pointerDepth(sphere);
  vec3 stepX = sphere + vec3(0.006, 0.0, 0.0), stepY = sphere + vec3(0.0, 0.006, 0.0);
  vec2 slope = vec2(facialDepth(stepX) + pointerDepth(stepX) - depth,
                    facialDepth(stepY) + pointerDepth(stepY) - depth) / 0.006;
  n = normalize(n + vec3(slope * 0.65, 0.0));
  vec3 lightDirection = normalize(vec3(-0.5, 0.7, 1.3));
  vec3 view = normalize(viewDirection);
  float light = max(0.0, dot(n, lightDirection));
  float rim = pow(1.0 - abs(dot(normalize(shellNormal), view)), 3.6);
  float specular = pow(max(0.0, dot(n, normalize(lightDirection + view))), 38.0);
  vec3 color = tileColor * (0.18 + light * 0.92 + luminous);
  color += tileColor * rim * (luminous > 0.1 ? 0.7 : 0.24) + vec3(specular * 0.075);
  // The material darkens into the recess; its lip catches the same key light.
  color *= 1.0 - socket * recessShade;
  color = mix(color,mouthColor,mouth*.95);
  color += tileColor * bevel * (0.025 + light * 0.07);
  // Apertures expose curved lenses seated inside the sculpted eye wells.
  color = mix(color,mouthColor,eye);
  // Clouds remain clear of facial recesses rather than painting another face.
  float cloudClear = (1.0 - smoothstep(0.28, 0.57, length(facePoint.xy))) * smoothstep(0.6, 0.86, facePoint.z);
  gl_FragColor = vec4(color*stageLight, opacity * (1.0 - cloudLayer * cloudClear * 0.9));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
const noise = n => { const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
/** Where a face looks when the pointer is not leading it. */
function faceLook(object,time,moving){
  if(!moving)return {x:0,y:0};
  const state=object.state;
  if(state==='working'){const a=satelliteAngle(object.id,time);return {x:Math.cos(a)*.06,y:-Math.sin(a)*.025};}
  if(state==='thinking')return {x:Math.sin(time*.6+object.phase)*.04,y:.035};
  if(state==='waiting'||state==='blocked')return {x:0,y:.012};
  if(state==='sleeping'||state==='offline')return {x:0,y:0};
  // idle: an unhurried glance every few seconds
  const k=Math.floor((time+object.phase)/3.4);
  return {x:(noise(k*1.37+object.phase)-.5)*.07,y:(noise(k*2.11+object.phase*1.3)-.5)*.045};
}
const palettes=Object.fromEntries(Object.entries(personalities).map(([skin,profile])=>[skin,profile.palette]));

export async function createSolarWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas,alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, innerWidth < 650 ? 1.5 : 2));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-500,500,350,-350,1,4000);
  camera.position.z = 1800;
  scene.add(new THREE.HemisphereLight(0xb4c9e8,0x0c101a,1.1));
  const key = new THREE.DirectionalLight(0xffe3b5,2.2); key.position.set(-420,480,900); scene.add(key);
  const resources = new Set(), objects = new Map(), samples = new Map();
  let disposed=false, frame=0, lastFrame=0, time=0, width=0, height=0, paused=false, pointer=null;
  let settings={interactive:true,debris:true,glow:1};
  let frameListener=null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loader = new THREE.ImageLoader();
  try {
    await Promise.all(['earth_daymap','saturn','mars','moon'].map(name => new Promise((resolve,reject) => {
      loader.load('/solar/textures/2k_'+name+'.jpg', image => {
        const sample=document.createElement('canvas'); sample.width=256; sample.height=128;
        const ctx=sample.getContext('2d',{willReadFrequently:true}); ctx.drawImage(image,0,0,256,128);
        samples.set(name,ctx.getImageData(0,0,256,128).data); resolve();
      },undefined,reject);
    })));
  } catch(error) { renderer.dispose(); renderer.forceContextLoss(); throw error; }
  const track = resource => { resources.add(resource); return resource; };
  const orbitParticles=new SolarStateParticles(),particleCanvas=document.createElement('canvas');
  particleCanvas.className='solar-orbit-particle-canvas';particleCanvas.setAttribute('aria-hidden','true');canvas.parentElement.appendChild(particleCanvas);
  const particleContext=particleCanvas.getContext('2d');
  const coreGeometry=track(new THREE.SphereGeometry(1,96,64));
  const eyeGeometry=track(new THREE.SphereGeometry(1,24,16));
  const tileShape=new THREE.Shape(); tileShape.moveTo(-.4,-.4); tileShape.lineTo(.4,-.4); tileShape.lineTo(.4,.4); tileShape.lineTo(-.4,.4); tileShape.closePath();
  const tileGeometry=track(new THREE.ExtrudeGeometry(tileShape,{depth:.75,steps:1,bevelEnabled:true,bevelThickness:.125,bevelSize:.1,bevelSegments:1,curveSegments:1}));
  tileGeometry.translate(0,0,-.375);
  const glowCanvas=document.createElement('canvas'); glowCanvas.width=glowCanvas.height=256;
  const ctx=glowCanvas.getContext('2d'), gradient=ctx.createRadialGradient(128,128,3,128,128,128);
  gradient.addColorStop(0,'rgba(255,255,255,0)'); gradient.addColorStop(.36,'rgba(255,255,255,.03)');
  gradient.addColorStop(.49,'rgba(255,255,255,.4)'); gradient.addColorStop(.65,'rgba(255,255,255,.11)');
  gradient.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=gradient; ctx.fillRect(0,0,256,256);
  const glowTexture=track(new THREE.CanvasTexture(glowCanvas));
  const normal=new THREE.Vector3(), up=new THREE.Vector3(0,0,1), dummy=new THREE.Object3D();
  function startTransfer(message){
    const from=objects.get(message.from),to=objects.get(message.to);
    if(!from||!to||from===to||!Number.isFinite(message.at))return;
    from.signal={kind:'sending',at:message.at};from.signalElapsed=0;
    orbitParticles.emit(message.from,message.to,from.profile.palette[3],message.remaining??[],message.result);
  }
  function paint(skin,p,index) { return surfaceColor(skin,p,index,samples); }
  function surfaceUniforms(skin,opacity=1,face=true) {
    const profile=personalities[skin];
    return {stageLight:{value:1},time:{value:0},drift:{value:skin==='sun'?.018:.011},motionTrail:{value:new THREE.Vector2()},luminous:{value:profile.luminous},opacity:{value:opacity},
      faceEnabled:{value:face?1:0},faceScale:{value:1},cloudLayer:{value:face?0:1},eyeSize:{value:new THREE.Vector2(...profile.eyes)},faceLight:{value:new THREE.Color(profile.light)},
      eyeOpen:{value:1},eyeSlope:{value:profile.slope},focus:{value:0},request:{value:0},concern:{value:0},speaking:{value:0},mouthColor:{value:new THREE.Color(['earth','neptune','moon-volcanic'].includes(skin)?profile.light:skin==='sun'?'#542610':'#202b36')},gaze:{value:new THREE.Vector2()},cursor:{value:new THREE.Vector2(2,2)},interaction:{value:0},
      recessShade:{value:profile.shade},carveDepth:{value:profile.depth},mouthWidth:{value:profile.mouth},mouthSmile:{value:profile.smile},mouthY:{value:profile.mouthY},mouthSpan:{value:profile.mouthSpan}};
  }
  function fragments(count,skin,spread=1,opacity=1) {
    const material=track(new THREE.ShaderMaterial({ vertexShader:fragmentVertex,fragmentShader:fragmentFragment,
      uniforms:surfaceUniforms(skin,opacity,opacity===1),
      transparent:opacity<1,depthWrite:opacity===1 }));
    const mesh=new THREE.InstancedMesh(tileGeometry,material,count);
    for(let i=0;i<count;i++) {
      const y=1-2*(i+.5)/count, r=Math.sqrt(1-y*y), a=i*2.399963;
      normal.set(Math.cos(a)*r,y,Math.sin(a)*r);
      const random=noise(i+19), large=noise(i+159)>.667;
      const radius=opacity<1?spread:large?1.025+noise(i+41)*.075:.935+noise(i+41)*.055;
      dummy.position.copy(normal).multiplyScalar(radius);
      dummy.position.x+=(noise(i+8)-.5)*.014; dummy.position.y+=(noise(i+12)-.5)*.014;
      dummy.quaternion.setFromUnitVectors(up,normal); dummy.rotateZ((random-.5)*.7);
      const size=Math.sqrt(4*Math.PI/count)*(opacity<1?.85:large?1.3+random*.2:.43+random*.23);
      dummy.scale.set(size,size*(.93+noise(i+3)*.07),size*(large?.7:.4));
      dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix); mesh.setColorAt(i,paint(skin,normal,i));
    }
    return mesh;
  }
  function dust(count,skin) {
    const material=track(new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
      uniforms:{cursor:{value:new THREE.Vector2(2,2)},interaction:{value:0},time:{value:0},opacity:{value:personalities[skin].dustOpacity}},
      vertexShader:`uniform vec2 cursor; uniform float interaction; uniform float time; varying vec3 lightColor; varying float particleAlpha;
      void main(){ lightColor=instanceColor; vec4 p=instanceMatrix*vec4(position,1.0); vec3 centre=instanceMatrix[3].xyz;
        vec3 viewCentre=normalMatrix*centre; viewCentre*=length(modelViewMatrix[0].xyz);
        vec2 d=viewCentre.xy-cursor; float pull=.18*interaction*exp(-dot(d,d)*1.7);
        p.xyz-=normalize(centre)*pull;
        p.xyz+=normalize(centre)*sin(time*1.2+dot(centre,vec3(13.0,9.0,17.0)))*.035;
        vec4 mv=modelViewMatrix*p;
        mv.xy+=vec2(-d.y,d.x)*pull*.8*length(modelViewMatrix[0].xyz);
        // Orbit's outer particles are flat screen-facing squares, with size
        // and light weighted by front/back depth rather than cube shading.
        float depth=(normalize(normalMatrix*centre).z+1.0)*.5;
        particleAlpha=.22+clamp(depth,0.0,1.0)*.78;
        vec4 centreView=modelViewMatrix*vec4(centre,1.0);
        mv.xy=centreView.xy+(mv.xy-centreView.xy)*(.8+depth*.7);
        mv.z=centreView.z;
        gl_Position=projectionMatrix*mv; }`,
      fragmentShader:`uniform float opacity; varying vec3 lightColor; varying float particleAlpha;
        void main(){ gl_FragColor=vec4(lightColor*1.6,opacity*particleAlpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`}));
    const mesh=new THREE.InstancedMesh(track(new THREE.PlaneGeometry(1,1)),material,count);
    for(let i=0;i<count;i++) {
      const a=i*2.399963+noise(i+15)*.3, seed=noise(i+72), r=1.09+Math.pow(seed,.7)*(skin==='sun'?.30:.25);
      const x=Math.cos(a)*r,y=Math.sin(a)*r,z=(noise(i+17)-.5)*.68;
      dummy.position.set(x,y,z);
      dummy.rotation.set(0,0,0);const size=.018+Math.pow(noise(i+9),1.5)*(skin==='sun'?.032:.027);dummy.scale.set(size,size,size);
      dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix);
      mesh.setColorAt(i,new THREE.Color(palettes[skin][3]).lerp(new THREE.Color(personalities[skin].light),noise(i+22)*.65).multiplyScalar(.6+noise(i+16)*.4));
    }
    return mesh;
  }
  function ring(skin='saturn') {
    const icy=skin==='uranus',count=icy?520:1400, geometry=track(new THREE.BoxGeometry(1,1,1));
    const material=track(new THREE.MeshStandardMaterial({color:0xffffff,roughness:.55,metalness:.12,emissive:icy?'#8abac4':'#b09669',emissiveIntensity:.22,transparent:icy,opacity:icy?.72:1}));
    const motion={ringCursor:{value:new THREE.Vector2(2,2)},ringInteraction:{value:0},ringTime:{value:0}};
    material.onBeforeCompile=shader=>{
      Object.assign(shader.uniforms,motion);
      shader.vertexShader='uniform vec2 ringCursor; uniform float ringInteraction; uniform float ringTime;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
        #ifdef USE_INSTANCING
        vec3 ringCentre=instanceMatrix[3].xyz;
        vec3 ringView=mat3(modelViewMatrix)*ringCentre/length(modelViewMatrix[0].xyz);
        vec2 ringDistance=ringView.xy-ringCursor;
        float ringPull=ringInteraction*exp(-dot(ringDistance,ringDistance)*2.3);
        vec3 ringOffset=normalize(ringCentre)*(sin(ringTime*1.4+dot(ringCentre,vec3(9.0,12.0,7.0)))*.015-ringPull*.20);
        ringOffset+=vec3(-ringCentre.y,ringCentre.x,0.0)*ringPull*.08;
        transformed+=inverse(mat3(instanceMatrix))*ringOffset;
        #endif`);
    };
    material.customProgramCacheKey=()=> 'solar-interactive-ring-v1';
    const mesh=new THREE.InstancedMesh(geometry,material,count);
    for(let i=0;i<count;i++) {
      const angle=i*2.399963, band=noise(i+50), radius=icy?1.3+band*.22:1.25+band*.8;
      dummy.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius,(noise(i+22)-.5)*.028);
      dummy.rotation.set(0,0,angle); const size=.025+noise(i+34)*.027;
      dummy.scale.set(size*.9,size*1.65,size*.23); dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix);
      const color=new THREE.Color(icy?'#addde2':band<.17?'#8b714c':band>.74?'#d8c8ae':'#e5cfaa');
      if(band>.46&&band<.52) color.multiplyScalar(.3);
      mesh.setColorAt(i,color.multiplyScalar(.88+noise(i+71)*.16));
    }
    mesh.userData.motion=motion;mesh.rotation.x=icy?.4:1.12; mesh.rotation.z=icy?1.1:-.12; return mesh;
  }
  function create(body) {
    const before=new Set(resources), skin=body.kind==='sun'?'sun':body.skin??(body.kind==='moon'?'moon-silver':'earth');
    const root=new THREE.Group(), rotation=new THREE.Group(); root.add(rotation);
    root.userData.signature=body.kind+':'+body.skin;
    const coreMaterial=track(new THREE.ShaderMaterial({vertexShader:coreVertex,fragmentShader:fragmentFragment,
      uniforms:{...surfaceUniforms(skin),coreColor:{value:new THREE.Color(palettes[skin][0]).multiplyScalar(.7)}}}));
    const core=new THREE.Mesh(coreGeometry,coreMaterial); core.scale.setScalar(.88); rotation.add(core);
    const surface=fragments(body.kind==='sun'?3900:body.kind==='moon'?900:2700,skin); rotation.add(surface);
    const cloud=skin==='earth'?fragments(150,'moon',1.025,.18):null;
    if(cloud) rotation.add(cloud);
    const haloMaterial=track(new THREE.SpriteMaterial({map:glowTexture,color:palettes[skin][3],transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:personalities[skin].glow}));
    const halo=new THREE.Sprite(haloMaterial); halo.scale.setScalar(body.kind==='sun'?4.5:4); halo.renderOrder=-1; root.add(halo);
    const debris=dust(Math.round(personalities[skin].dustCount*1.15),skin); root.add(debris);
    const rings=skin==='saturn'||skin==='uranus'?ring(skin):null;
    if(rings)root.add(rings);
    if(skin==='saturn')root.rotation.z=-.32;
    const profile=personalities[skin], face=new THREE.Group(); face.rotation.z=-root.rotation.z; root.add(face);
    const eyeMaterial=track(new THREE.MeshBasicMaterial({color:['earth','neptune','moon-volcanic'].includes(skin)?'#ecffff':skin==='sun'?'#33190b':'#142432',toneMapped:false,depthTest:false,depthWrite:false}));
    const faceEdge=track(new THREE.MeshBasicMaterial({color:['earth','neptune','moon-volcanic'].includes(skin)?'#122638':'#fff1d1',toneMapped:false,depthTest:false,depthWrite:false}));
    const eyes=[-1,1].map(side=>{
      const eye=new THREE.Mesh(eyeGeometry,eyeMaterial); eye.userData.side=side;eye.renderOrder=12;
      const rim=new THREE.Mesh(eyeGeometry,faceEdge);rim.renderOrder=11;face.add(rim);eye.userData.rim=rim;
      face.add(eye); return eye;
    });
    const mouthGeometry=track(new THREE.BufferGeometry());
    mouthGeometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(26*2*3),3));
    const mouthIndices=[];for(let i=0;i<25;i++){const j=i*2;mouthIndices.push(j,j+2,j+1,j+1,j+2,j+3);}mouthGeometry.setIndex(mouthIndices);
    const mouth=new THREE.Mesh(mouthGeometry,eyeMaterial);mouth.renderOrder=12;mouth.frustumCulled=false;face.add(mouth);
    // Shader displacement and sprite auras exceed the CPU bounds; never cull
    // an entire instanced shell as it crosses the edge during camera zoom.
    root.traverse(child=>{ if(child.isMesh||child.isSprite)child.frustumCulled=false; });
    rotation.rotation.z=skin==='earth'?.12:skin==='mars'?.07:0;
    rotation.rotation.y=skin==='earth'?-.55:.36;
    scene.add(root);
    const phase=noise([...body.id].reduce((sum,c)=>sum+c.charCodeAt(0),0))*6.8;
    const object={id:body.id,parentId:body.parentId,root,rotation,surface,core,cloud,halo,debris,rings,face,eyes,mouth,profile,skin,kind:body.kind,active:body.active,state:body.state??'ready',activity:body.activity??'task',signal:null,background:false,stageLight:1,phase,trail:new THREE.Vector2(),related:0,lastState:body.state??'ready',doneAt:-10,
      screenX:body.x,screenY:body.y,radius:body.diameter/2,interaction:0,cursor:new THREE.Vector2(2,2),gaze:new THREE.Vector2(),
      ownedResources:[...resources].filter(resource=>!before.has(resource))};
    objects.set(body.id,object); return object;
  }
  function remove(id,object) {
    object.root.traverse(child=>{ if(child.isInstancedMesh)child.dispose(); });
    scene.remove(object.root); objects.delete(id);
    for(const resource of object.ownedResources) { resource.dispose(); resources.delete(resource); }
  }
  function render(ms=0) {
    if(disposed)return;
    const delta=lastFrame?Math.min(.05,(ms-lastFrame)/1000):0; lastFrame=ms;
    const moving=!paused&&!document.hidden&&!reduced.matches;
    if(moving) {
      time+=delta;
    }
    const pointed=pointer&&moving&&settings.interactive?[...objects.values()].filter(o=>Math.hypot(pointer.x-o.screenX,pointer.y-o.screenY)<o.radius*1.2).sort((a,b)=>Math.hypot(pointer.x-a.screenX,pointer.y-a.screenY)/a.radius-Math.hypot(pointer.x-b.screenX,pointer.y-b.screenY)/b.radius)[0]:null;
    for(const object of objects.values()) {
      const blend=moving?1-Math.exp(-delta*8):1;
      const targetX=pointer?(pointer.x-object.screenX)/object.radius:2, targetY=pointer?(object.screenY-pointer.y)/object.radius:2;
      const proximity=pointer&&moving&&settings.interactive?Math.max(0,Math.min(1,(2.2-Math.hypot(targetX,targetY))*1.5)):0;
      const related=pointed&&(pointed.parentId===object.id||object.parentId===pointed.id)?1:0;
      object.related+=(related-object.related)*blend;
      object.interaction+=(proximity-object.interaction)*blend;
      object.cursor.x+=(targetX-object.cursor.x)*blend; object.cursor.y+=(targetY-object.cursor.y)*blend;
      const thinking=object.state==='thinking',working=object.state==='working',sleeping=object.state==='sleeping',waiting=object.state==='waiting'||object.state==='blocked';
      if(object.lastState!==object.state){ if((object.lastState==='working'||object.lastState==='thinking')&&(object.state==='ready'||object.state==='sleeping'))object.doneAt=time; object.lastState=object.state; }
      // a short contented squint and smile right after a turn ends
      const happy=moving&&time-object.doneAt<1.8?Math.sin(Math.max(0,time-object.doneAt)/1.8*Math.PI):0;
      object.stageLight+=((object.background?.18:1)-object.stageLight)*blend;
      if(object.signal&&moving)object.signalElapsed=Math.min(10,(object.signalElapsed??0)+delta);
      const signalAge=object.signal?object.signalElapsed??10:10;
      const arrival=moving&&object.signal?.kind==='receiving'?Math.max(0,1-signalAge/.7):0;
      // Follow direction across the whole map, independently of the local particle dent.
      // Move the carved apertures with the lenses, so the gaze stays part of the shell.
      const tracking=!!pointer&&moving&&settings.interactive;
      const gazeDistance=Math.sqrt(targetX*targetX+targetY*targetY+4);
      // Busy faces watch their own work (the satellite, or upwards while thinking)
      // unless the pointer is right beside them; idle faces glance around.
      const look=faceLook(object,time,moving);
      const follow=tracking&&!((working||thinking||waiting)&&object.interaction<.3);
      object.gaze.x+=((follow?targetX/gazeDistance*.065:look.x)-object.gaze.x)*blend;
      object.gaze.y+=((follow?targetY/gazeDistance*.05:look.y)-object.gaze.y)*blend;
      const period=5.3+object.phase*.3, phase=(time+object.phase)%period;
      const blink=moving&&phase>period-.22?1-Math.pow(Math.sin((phase-period+.22)/.22*Math.PI),2):1;
      const pulse=moving&&signalAge<1?Math.sin(Math.max(0,signalAge)*Math.PI)*.18:0;
      const breath=sleeping&&moving?1+Math.sin(time*1.3+object.phase)*.014:1;
      object.root.scale.set(object.radius*(1-pulse*.12+arrival*.025)*breath,object.radius*(1+pulse*.12+arrival*.025)*breath,object.radius);
      const pose=solarFacePose(object.state,time+object.phase,moving);
      for(const material of [object.surface.material,object.core.material]) {
        const u=material.uniforms; u.stageLight.value=object.stageLight; u.mouthSmile.value+=(object.profile.smile*(pose.smile+happy*1.4)-u.mouthSmile.value)*blend; u.time.value=time; u.eyeOpen.value+=(solarFaceEyeOpen(object.state,blink)*(1-happy*.5)*(1+arrival*.22)-u.eyeOpen.value)*(moving?blend:1); u.cursor.value.copy(object.cursor); u.interaction.value=object.interaction; u.gaze.value.copy(object.gaze); u.motionTrail.value.copy(object.trail); u.luminous.value=(object.profile.luminous+.018)*settings.glow; u.speaking.value+=(pose.speech-u.speaking.value)*blend;
        for(const [key,target] of [['focus',pose.focus],['request',pose.request],['concern',pose.concern]]) {
          u[key].value+=(target-u[key].value)*blend;
        }
      }
      object.trail.multiplyScalar(moving?Math.exp(-delta*10):0);
      const dustUniforms=object.debris.material.uniforms;
      dustUniforms.cursor.value.copy(object.cursor); dustUniforms.interaction.value=object.interaction; dustUniforms.time.value=time;
      dustUniforms.opacity.value=Math.min(.98,object.profile.dustOpacity*1.12*settings.glow*object.stageLight);
      object.debris.visible=false;
      object.halo.material.opacity=(object.profile.glow+.055)*settings.glow*object.stageLight*(.75+object.interaction*.12+object.related*.1+pulse)*(moving?1+Math.sin(time*(working?2.2:1.1)+object.phase)*(working?.12:.07):1)*(object.state==='offline'?.55:1);
      object.halo.scale.setScalar(object.kind==='sun'?4:3.8);
      if(object.rings){const r=object.rings.userData.motion;r.ringCursor.value.copy(object.cursor);const near=pointer&&moving&&settings.interactive?Math.max(0,Math.min(1,(2.6-Math.hypot(targetX,targetY))*1.2)):0;r.ringInteraction.value+=(near-r.ringInteraction.value)*blend;r.ringTime.value=moving?time:0;}
      const u=object.surface.material.uniforms, scale=u.faceScale.value;
      for(const eye of object.eyes) {
        eye.visible=!object.background;
        const side=eye.userData.side, x=(side*.215+object.gaze.x)*scale, y=(.075+u.request.value*.018+object.gaze.y)*scale;
        normal.set(x,y,Math.sqrt(Math.max(.1,1-x*x-y*y)));
        const dent=pointerDent(x,y,normal.z,object.cursor.x,object.cursor.y,object.interaction);
        eye.position.copy(normal).multiplyScalar(1.018-dent*.2);
        eye.quaternion.setFromUnitVectors(up,normal); eye.rotateZ(-side*Math.atan(object.profile.slope+u.focus.value*.08+u.concern.value*.16));
        eye.scale.set(object.profile.eyes[0]*scale,object.profile.eyes[1]*scale*Math.max(.065,u.eyeOpen.value)*(1-u.focus.value*.18+u.request.value*.12),.012);
        const rim=eye.userData.rim;rim.visible=eye.visible;rim.position.copy(eye.position);rim.quaternion.copy(eye.quaternion);rim.scale.copy(eye.scale);rim.scale.x+=.012*scale;rim.scale.y+=.012*scale;
      }
      object.mouth.visible=!object.background;
      const mouthPositions=object.mouth.geometry.attributes.position;
      const open=u.speaking.value;
      for(let i=0;i<26;i++){
        const x=(i/25*2-1)*object.profile.mouthSpan*scale,t=x/(object.profile.mouthSpan*scale);
        const curve=(object.profile.mouthY+t*t*(u.mouthSmile.value-u.request.value*.04-u.concern.value*.09))*scale;
        const thickness=(.021+open*.043*Math.sqrt(Math.max(0,1-t*t)))*scale;
        for(let side=0;side<2;side++){
          const z=Math.sqrt(Math.max(.1,1-x*x-curve*curve))+.025;
          mouthPositions.setXYZ(i*2+side,x,curve+(side?1:-1)*thickness,z);
        }
      }
      mouthPositions.needsUpdate=true;
      if(moving) {
        object.rotation.rotation.y+=delta*((object.kind==='sun'?.09:object.skin==='earth'?.23:.17)*(object.state==='offline'?.15:sleeping?.35:working?1.25:1)+arrival*.3);
        const free=object.grabbed?0:1;
        object.root.position.x=object.screenX-width/2+free*(Math.sin(time*.65+object.phase)*Math.min(1.8,object.radius*.025)+Math.max(-1,Math.min(1,object.cursor.x))*object.interaction*1.4);
        object.root.position.y=height/2-object.screenY+free*(Math.sin(time*.85+object.phase)*Math.min(2.8,object.radius*.04)+Math.max(-1,Math.min(1,object.cursor.y))*object.interaction*1.4);
        if(object.cloud) { object.cloud.rotation.y+=delta*.018; object.cloud.material.uniforms.time.value=time; }
        if(object.debris){object.debris.rotation.z+=delta*(object.skin==='sun'?.27:.34)*(1+object.interaction*.75);object.debris.rotation.y=Math.sin(time*.4+object.phase)*.12;}
        if(object.rings)object.rings.rotation.z+=delta*.24;
      }
    }
    renderer.render(scene,camera);
    if(particleContext){const ratio=renderer.getPixelRatio();particleContext.setTransform(ratio,0,0,ratio,0,0);particleContext.clearRect(0,0,width,height);
      orbitParticles.draw(particleContext,[...objects.values()].map(o=>({id:o.id,x:o.root.position.x+width/2,y:height/2-o.root.position.y,radius:o.radius,color:o.profile.palette[3],colors:o.profile.palette,state:o.state,alpha:o.stageLight,signal:o.signal,signalAge:o.signalElapsed??10,tool:o.tool})),width,height,time,delta,moving,settings.debris,id=>{const target=objects.get(id);if(target){target.signal={kind:'receiving',at:Date.now()};target.signalElapsed=0;}});
    }
    frameListener?.(canvas,particleCanvas);
  }
  function tick(ms) {
    frame=0; if(disposed||paused||document.hidden||reduced.matches)return;
    if(ms-lastFrame>=16)render(ms); frame=requestAnimationFrame(tick);
  }
  function wake() {
    if(disposed)return; if(frame)cancelAnimationFrame(frame); frame=0; lastFrame=0; render(performance.now());
    if(!paused&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);
  }
  function contextLost(event) { event.preventDefault(); paused=true; if(frame)cancelAnimationFrame(frame); canvas.dispatchEvent(new Event('solar-render-failed')); }
  canvas.addEventListener('webglcontextlost',contextLost); document.addEventListener('visibilitychange',wake); reduced.addEventListener('change',wake);
  return {
    setFrameListener(listener){frameListener=listener;},
    update(bodies,w,h,nextPaused,preferences) {
      if(disposed)return;
      if(width!==w||height!==h) { width=w; height=h; renderer.setSize(w,h,false);particleCanvas.width=w*renderer.getPixelRatio();particleCanvas.height=h*renderer.getPixelRatio();
        camera.left=-w/2; camera.right=w/2; camera.top=h/2; camera.bottom=-h/2; camera.updateProjectionMatrix(); }
      const current=new Set(bodies.map(body=>body.id));
      for(const [id,object] of objects)if(!current.has(id))remove(id,object);
      for(const body of bodies) {
        let object=objects.get(body.id);
        if(object&&object.root.userData.signature!==body.kind+':'+body.skin) { remove(body.id,object); object=null; }
        object=object||create(body);
        if(body.grabbed) {
          object.trail.set(-(body.x-object.screenX)/object.radius,(body.y-object.screenY)/object.radius).multiplyScalar(.7).clampLength(0,.085);
        }
        object.root.position.set(body.x-w/2,h/2-body.y,0);
        object.root.scale.setScalar(body.diameter/2); object.active=body.active;
        // Restoring the map colour follows the returning camera, with no residual fade.
        if(object.background&&!body.background)object.stageLight=1;
        object.background=!!body.background; object.grabbed=!!body.grabbed; object.state=body.callPhase==='speaking'?'speaking':body.callPhase==='working'||body.callPhase==='sending'?'thinking':body.callPhase==='listening'?'ready':body.state??'ready'; object.parentId=body.parentId; object.activity=body.activity??'task';
        object.tool=body.tool;
        object.color=body.color;
        if(body.signal&&(body.signal.at!==object.signal?.at||body.signal.kind!==object.signal?.kind)){object.signal=body.signal;object.signalElapsed=0;}
        object.screenX=body.x; object.screenY=body.y; object.radius=body.diameter/2;
        for(const material of [object.surface.material,object.core.material]) {
          material.uniforms.faceScale.value=1.09*(body.kind==='moon'?Math.max(1.14,Math.min(1.35,62/body.diameter)):body.kind==='planet'?Math.max(1.08,Math.min(1.3,115/body.diameter)):1);
        }
      }
      paused=nextPaused; settings={interactive:true,debris:true,glow:1,...preferences}; wake();
    },
    transfer(message){if(disposed||paused||reduced.matches||document.hidden)return;const from=objects.get(message.from),to=objects.get(message.to);if(!from||!to||from===to)return;const route=solarTransferRoute(from,to,[...objects.values()]);if(route.length>1)startTransfer({...message,from:route[0],to:route[1],remaining:route.slice(2)});},
    pointAt(point) { pointer=point&&settings.interactive&&Number.isFinite(point.x)&&Number.isFinite(point.y)?point:null; if(!frame&&!disposed&&!paused&&!document.hidden&&!reduced.matches&&settings.interactive)wake(); },
    dispose() {
      if(disposed)return; disposed=true; if(frame)cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange',wake); reduced.removeEventListener('change',wake); canvas.removeEventListener('webglcontextlost',contextLost);
      scene.traverse(child=>{ if(child.isInstancedMesh)child.dispose(); });
      frameListener=null; scene.clear(); objects.clear(); samples.clear(); for(const resource of resources)resource.dispose(); renderer.dispose(); renderer.forceContextLoss();
      particleCanvas.remove();
    }
  };
}



