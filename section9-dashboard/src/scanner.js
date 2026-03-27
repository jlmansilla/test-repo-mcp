import * as THREE from 'three';

export function initScanner() {
  const canvas = document.getElementById('scannerCanvas');
  const parent = canvas.parentElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / Math.max(canvas.clientHeight, 200), 0.1, 100);
  camera.position.set(0, 1.5, 5);
  camera.lookAt(0, 1.2, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth || 180, canvas.clientHeight || 200);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Build humanoid figure from primitives
  const figureGroup = new THREE.Group();

  // Skeleton layer (cyan)
  const skeletonMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });

  // Body solid (dark fill)
  const bodyMat = new THREE.MeshBasicMaterial({
    color: 0x0a1520,
    transparent: true,
    opacity: 0.3,
  });

  // Implant layer (magenta)
  const implantMat = new THREE.MeshBasicMaterial({
    color: 0xFF00A0,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });

  // Head
  const headGeo = new THREE.SphereGeometry(0.28, 12, 10);
  const head = new THREE.Mesh(headGeo, skeletonMat);
  head.position.y = 2.55;
  figureGroup.add(head);
  const headSolid = new THREE.Mesh(headGeo, bodyMat);
  headSolid.position.y = 2.55;
  figureGroup.add(headSolid);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.15, 8);
  const neck = new THREE.Mesh(neckGeo, skeletonMat);
  neck.position.y = 2.2;
  figureGroup.add(neck);

  // Torso
  const torsoGeo = new THREE.BoxGeometry(0.65, 0.85, 0.3, 4, 4, 2);
  const torso = new THREE.Mesh(torsoGeo, skeletonMat);
  torso.position.y = 1.7;
  figureGroup.add(torso);
  const torsoSolid = new THREE.Mesh(torsoGeo, bodyMat);
  torsoSolid.position.y = 1.7;
  figureGroup.add(torsoSolid);

  // Pelvis
  const pelvisGeo = new THREE.BoxGeometry(0.55, 0.25, 0.25, 3, 2, 2);
  const pelvis = new THREE.Mesh(pelvisGeo, skeletonMat);
  pelvis.position.y = 1.15;
  figureGroup.add(pelvis);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.65, 6);
  const forearmGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.55, 6);

  // Left arm
  const leftUpperArm = new THREE.Mesh(armGeo, skeletonMat);
  leftUpperArm.position.set(-0.42, 1.85, 0);
  leftUpperArm.rotation.z = 0.15;
  figureGroup.add(leftUpperArm);
  const leftForearm = new THREE.Mesh(forearmGeo, skeletonMat);
  leftForearm.position.set(-0.48, 1.3, 0);
  leftForearm.rotation.z = 0.1;
  figureGroup.add(leftForearm);

  // Right arm
  const rightUpperArm = new THREE.Mesh(armGeo, skeletonMat);
  rightUpperArm.position.set(0.42, 1.85, 0);
  rightUpperArm.rotation.z = -0.15;
  figureGroup.add(rightUpperArm);
  const rightForearm = new THREE.Mesh(forearmGeo, skeletonMat);
  rightForearm.position.set(0.48, 1.3, 0);
  rightForearm.rotation.z = -0.1;
  figureGroup.add(rightForearm);

  // Legs
  const thighGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.65, 6);
  const shinGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.6, 6);

  const leftThigh = new THREE.Mesh(thighGeo, skeletonMat);
  leftThigh.position.set(-0.17, 0.7, 0);
  figureGroup.add(leftThigh);
  const leftShin = new THREE.Mesh(shinGeo, skeletonMat);
  leftShin.position.set(-0.17, 0.15, 0);
  figureGroup.add(leftShin);

  const rightThigh = new THREE.Mesh(thighGeo, skeletonMat);
  rightThigh.position.set(0.17, 0.7, 0);
  figureGroup.add(rightThigh);
  const rightShin = new THREE.Mesh(shinGeo, skeletonMat);
  rightShin.position.set(0.17, 0.15, 0);
  figureGroup.add(rightShin);

  // Implant markers (magenta nodes)
  const implantGeo = new THREE.SphereGeometry(0.04, 8, 6);
  const implantPositions = [
    [0, 2.55, 0.2],       // Brain implant
    [0, 2.55, -0.2],      // Back of head
    [0.15, 2.55, 0],      // Temple L
    [-0.15, 2.55, 0],     // Temple R
    [0, 1.9, 0.17],       // Chest implant
    [0.3, 1.65, 0.15],    // Shoulder R
    [-0.3, 1.65, 0.15],   // Shoulder L
    [0.48, 1.1, 0],       // Wrist R (cyber arm)
    [-0.48, 1.1, 0],      // Wrist L
    [0.17, 0.0, 0],       // Knee R
    [-0.17, 0.0, 0],      // Knee L
  ];
  const implantMeshes = [];
  implantPositions.forEach(pos => {
    const implant = new THREE.Mesh(implantGeo, implantMat);
    implant.position.set(...pos);
    figureGroup.add(implant);
    implantMeshes.push(implant);
  });

  // Implant connection lines
  const implantLineMat = new THREE.LineBasicMaterial({
    color: 0xFF00A0,
    transparent: true,
    opacity: 0.3,
  });
  for (let i = 0; i < implantPositions.length - 1; i++) {
    const pts = [
      new THREE.Vector3(...implantPositions[i]),
      new THREE.Vector3(...implantPositions[i + 1]),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(lineGeo, implantLineMat);
    figureGroup.add(line);
  }

  // Nerve lines (cyan, thin)
  const nerveMat = new THREE.LineBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.15,
  });
  const spinePoints = [
    new THREE.Vector3(0, 2.4, -0.1),
    new THREE.Vector3(0, 2.2, -0.1),
    new THREE.Vector3(0, 1.7, -0.1),
    new THREE.Vector3(0, 1.15, -0.1),
  ];
  const spineGeo = new THREE.BufferGeometry().setFromPoints(spinePoints);
  const spine = new THREE.Line(spineGeo, nerveMat);
  figureGroup.add(spine);

  // Scan bars (vertical planes that sweep across)
  const scanBarGeo = new THREE.PlaneGeometry(0.02, 3);
  const scanBarMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });
  const scanBar = new THREE.Mesh(scanBarGeo, scanBarMat);
  scanBar.position.y = 1.3;
  figureGroup.add(scanBar);

  // Scan bar glow
  const scanBarGlowGeo = new THREE.PlaneGeometry(0.4, 3);
  const scanBarGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.06,
    side: THREE.DoubleSide,
  });
  const scanBarGlow = new THREE.Mesh(scanBarGlowGeo, scanBarGlowMat);
  scanBarGlow.position.y = 1.3;
  figureGroup.add(scanBarGlow);

  // Floating data rings
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.RingGeometry(0.5 + i * 0.3, 0.52 + i * 0.3, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: i === 0 ? 0x00F0FF : 0xFF00A0,
      transparent: true,
      opacity: 0.12 - i * 0.03,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.8 - i * 0.2;
    ring.rotation.x = Math.PI / 2;
    ring.userData.baseY = ring.position.y;
    ring.userData.offset = i;
    figureGroup.add(ring);
  }

  figureGroup.position.y = -0.5;
  scene.add(figureGroup);

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Slow rotation
    figureGroup.rotation.y = Math.sin(time * 0.5) * 0.6;

    // Scan bar sweep
    scanBar.position.x = Math.sin(time * 1.5) * 0.5;
    scanBarGlow.position.x = scanBar.position.x;

    // Implant pulse
    implantMeshes.forEach((m, i) => {
      const scale = 1 + Math.sin(time * 3 + i) * 0.3;
      m.scale.set(scale, scale, scale);
    });

    // Floating rings
    figureGroup.children.forEach(child => {
      if (child.userData.baseY !== undefined) {
        child.position.y = child.userData.baseY + Math.sin(time + child.userData.offset) * 0.1;
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.clientWidth || 180;
    const h = canvas.clientHeight || 200;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(canvas);
}
