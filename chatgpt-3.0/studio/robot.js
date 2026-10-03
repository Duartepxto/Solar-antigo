import * as THREE from 'three';

// One articulated model family. All dimensions are in local model units.
export function createRobot(hex = '#ffc184', variant = 'main') {
  const root = new THREE.Group();
  root.name = `robot-${variant}`;
  const character = new THREE.Group(); root.add(character);
  const shell = new THREE.MeshStandardMaterial({ color: '#e9e1d4', roughness: .32, metalness: .08 });
  const joint = new THREE.MeshStandardMaterial({ color: '#706050', roughness: .55, metalness: .25 });
  const pack = new THREE.MeshStandardMaterial({ color: '#68503a', roughness: .7 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#080b0e', roughness: .16, metalness: .25, clearcoat: 1 });
  const accent = new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 2.2, roughness: .3 });
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: '#fff6dc', emissive: hex, emissiveIntensity: 3 });
  const leaf = new THREE.MeshStandardMaterial({ color: '#88af4b', roughness: .5 });
  const greenStem = new THREE.MeshStandardMaterial({ color: '#79684a', roughness: .8 });
  const mesh = (geometry, material, parent, name, position, scale = [1,1,1]) => {
    const object = new THREE.Mesh(geometry, material); object.name = name;
    object.position.set(...position); object.scale.set(...scale); object.castShadow = true; object.receiveShadow = true;
    parent.add(object); return object;
  };
  const sphere = (parent, name, material, position, scale) => mesh(new THREE.SphereGeometry(1, 32, 24), material, parent, name, position, scale);
  const body = new THREE.Group(); body.name = 'body'; character.add(body);
  sphere(body, 'torso', shell, [0,1.04,0], [.47,.55,.34]);
  mesh(new THREE.CylinderGeometry(.23,.26,.13,24), joint, body, 'neck', [0,1.5,0]);
  const head = new THREE.Group(); head.name = 'head'; head.position.y = 2.08; body.add(head);
  sphere(head, 'head-shell', shell, [0,0,0], [.84,.72,.69]);
  sphere(head, 'visor-rim', joint, [0,-.04,.49], [.73,.54,.26]);
  sphere(head, 'visor', glass, [0,-.04,.55], [.695,.505,.25]);
  const eyes = [-1,1].map((side) => mesh(new THREE.CapsuleGeometry(.045,.15,6,12), eyeMaterial, head, `eye-${side}`, [side*.23,-.035,.80]));
  const mouth = sphere(head, 'mouth', eyeMaterial, [0,-.26,.787], [.065,.018,.01]);
  for (const side of [-1,1]) {
    const ear = mesh(new THREE.CylinderGeometry(.24,.24,.14,32), shell, head, `ear-${side}`, [side*.83,-.015,0]); ear.rotation.z = Math.PI/2;
    const rim = mesh(new THREE.TorusGeometry(.177,.028,10,32), accent, head, `ear-led-${side}`, [side*.915,-.015,0]); rim.rotation.y = Math.PI/2;
    const cap = mesh(new THREE.CylinderGeometry(.15,.15,.018,24), joint, head, `ear-cap-${side}`, [side*.921,-.015,0]); cap.rotation.z = Math.PI/2;
  }
  const stem = new THREE.CatmullRomCurve3([new THREE.Vector3(0,.65,0),new THREE.Vector3(.025,.90,0),new THREE.Vector3(-.025,1.05,0)]);
  mesh(new THREE.TubeGeometry(stem,12,.018,8,false),greenStem,head,'antenna-stem',[0,0,0]);
  for (const side of [-1,1]) {
    const blade = sphere(head, `antenna-leaf-${side}`, leaf, [side*.12,1.05,.01], [.095,.21,.035]); blade.rotation.z = side*-.65;
  }
  const backpack = mesh(new THREE.BoxGeometry(.62,.61,.23), pack, body, 'backpack', [0,1.08,-.39]);
  sphere(backpack,'backpack-top',pack,[0,.28,0],[.30,.11,.12]);
  mesh(new THREE.BoxGeometry(.36,.21,.04),joint,body,'backpack-pocket',[0,.91,-.535]);
  for (const side of [-1,1]) {
    const strap = mesh(new THREE.TorusGeometry(.23,.04,8,24,Math.PI),pack,body,`strap-${side}`,[side*.30,1.30,-.01]); strap.rotation.y=Math.PI/2;
    sphere(body, `hip-${side}`, joint, [side*.22,.65,0],[.15,.14,.15]);
    mesh(new THREE.CapsuleGeometry(.13,.17,6,16), shell, body, `leg-${side}`, [side*.22,.43,0]);
    sphere(body,`boot-${side}`,shell,[side*.24,.22,.075],[.21,.16,.28]);
  }
  const arms = [-1,1].map((side) => {
    const pivot = new THREE.Group(); pivot.name=`arm-${side}`; pivot.position.set(side*.47,1.34,0); body.add(pivot);
    sphere(pivot,'shoulder',joint,[0,0,0],[.15,.15,.15]);
    mesh(new THREE.CapsuleGeometry(.115,.22,6,16),shell,pivot,'upper-arm',[side*.075,-.24,.025]);
    sphere(pivot,'hand',shell,[side*.09,-.46,.045],[.13,.15,.13]);
    pivot.rotation.z = side*.15; return pivot;
  });
  sphere(body,'chest-badge',accent,[0,1.23,.325],[.065,.075,.025]);
  const pedestalMaterial = new THREE.MeshStandardMaterial({ color:'#151719',roughness:.38,metalness:.5 });
  const pedestal = mesh(new THREE.CylinderGeometry(1.12,1.15,.10,64),pedestalMaterial,root,'pedestal',[0,.02,0]);
  const ring = mesh(new THREE.TorusGeometry(1.10,.015,8,96),accent,root,'pedestal-ring',[0,.078,0]);ring.rotation.x=Math.PI/2;
  const tools = new THREE.Group();tools.name='workstation';root.add(tools);
  if (variant !== 'main') {
    const laptop = new THREE.Group(); laptop.name='laptop';laptop.position.set(.42,.14,.58);laptop.rotation.y=-.25;tools.add(laptop);
    mesh(new THREE.BoxGeometry(.57,.035,.37),joint,laptop,'keyboard',[0,0,0]);
    const screen=mesh(new THREE.BoxGeometry(.57,.36,.028),joint,laptop,'screen-frame',[0,.17,-.17]);screen.rotation.x=-.18;
    mesh(new THREE.PlaneGeometry(.50,.29),new THREE.MeshStandardMaterial({color:'#111925',emissive:hex,emissiveIntensity:.12}),screen,'display',[0,0,.016]);
    for(let i=0;i<4;i++) mesh(new THREE.BoxGeometry(.18+i*.035,.009,.002),accent,screen,`screen-line-${i}`,[-.08,.08-i*.045,.02]);
    const panel=mesh(new THREE.BoxGeometry(.52,.60,.025),glass,tools,'floating-panel',[-.82,1.10,-.12]);panel.rotation.y=.3;
    for(let i=0;i<5;i++) mesh(new THREE.BoxGeometry(.18+(i%2)*.12,.015,.008),accent,panel,`panel-line-${i}`,[-.05,.18-i*.075,.022]);
  }
  if (variant==='research') {
    for(let i=0;i<3;i++)mesh(new THREE.BoxGeometry(.32,.10,.38), i%2?shell:joint,tools,`book-${i}`,[-.65,.15+i*.10,.54]);
  }
  if (variant==='design') {
    sphere(body,'design-pin',accent,[.28,1.16,.30],[.04,.045,.02]);
  }
  let state='idle';
  function update(time, animate=true) {
    const t=animate?time:0;
    const busy=state==='working';const thinking=state==='thinking';const happy=state==='happy';
    const talking=state==='talking';const error=state==='error';const waiting=state==='waiting';
    character.position.y=animate?Math.sin(t*1.8)*.025:0;
    head.rotation.z=thinking?Math.sin(t*1.4)*.10:happy?Math.sin(t*3)*.045:0;
    head.rotation.y=thinking?Math.sin(t*.9)*.16:0;
    head.rotation.x=busy?.12:waiting?-.07:0;
    arms.forEach((arm,i)=>{
      arm.rotation.x=busy?-.55+Math.sin(t*7+i*2)*.10:talking?-.2+Math.sin(t*3+i)*.15:0;
      arm.rotation.z=(i?1:-1)*.15+(happy?(i?1:-1)*.45:thinking&&i===1?-.65:0);
    });
    const blink=animate&&t%4.8>4.63;
    eyes.forEach((eye)=>{eye.scale.y=blink?.12:happy?.42:busy?.7:1;eye.rotation.z=error?.55:happy?-.3:0;});
    mouth.scale.y=.018*(talking?1+Math.abs(Math.sin(t*10))*4:happy?1.6:1);
    accent.color.set(error?'#ff6374':hex);accent.emissive.set(error?'#ff6374':hex);
    eyeMaterial.emissive.set(error?'#ff6374':hex);
    ring.material.emissiveIntensity=waiting&&animate?1.5+Math.sin(t*3)*.6:2.2;
  }
  function setState(next){state=next;update(0,false);}
  function dispose(){const geometries=new Set();const materials=new Set();root.traverse(o=>{if(o.isMesh){geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
  return {root,character,head,arms,eyes,pedestal,tools,update,setState,dispose};
}
