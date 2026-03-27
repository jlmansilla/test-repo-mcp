import * as THREE from 'three';

export function initNetwork() {
  const canvas = document.getElementById('networkCanvas');
  const parent = canvas.parentElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / Math.max(canvas.clientHeight, 100), 0.1, 100);
  camera.position.set(0, 2, 12);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth || 260, canvas.clientHeight || 160);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const networkGroup = new THREE.Group();

  // Generate nodes
  const nodeCount = 24;
  const nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.12, 8, 6);
  const nodeMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.8,
  });
  const coreNodeMat = new THREE.MeshBasicMaterial({
    color: 0xFF00A0,
    transparent: true,
    opacity: 0.9,
  });
  const nodeGlowGeo = new THREE.SphereGeometry(0.18, 8, 6);
  const nodeGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.15,
  });

  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 2.5 + Math.random() * 3;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = (Math.random() - 0.5) * 3;
    const z = r * Math.sin(phi) * Math.sin(theta);

    const isCore = i < 3;
    const node = new THREE.Mesh(nodeGeo, isCore ? coreNodeMat : nodeMat.clone());
    node.position.set(x, y, z);
    node.userData = { basePos: new THREE.Vector3(x, y, z), offset: Math.random() * 10, isCore };
    networkGroup.add(node);

    // Glow
    const glow = new THREE.Mesh(nodeGlowGeo, nodeGlowMat.clone());
    glow.material.color.set(isCore ? 0xFF00A0 : 0x00F0FF);
    glow.position.copy(node.position);
    networkGroup.add(glow);

    nodes.push(node);
  }

  // Connections (Bezier curves between nodes)
  const connectionMat = new THREE.LineBasicMaterial({
    color: 0x1E3A5F,
    transparent: true,
    opacity: 0.4,
  });
  const activeConnectionMat = new THREE.LineBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.6,
  });

  const connections = [];
  for (let i = 0; i < nodeCount; i++) {
    const connCount = 1 + Math.floor(Math.random() * 3);
    for (let c = 0; c < connCount; c++) {
      let j = Math.floor(Math.random() * nodeCount);
      if (j === i) j = (j + 1) % nodeCount;

      const p1 = nodes[i].position;
      const p2 = nodes[j].position;
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += (Math.random() - 0.5) * 1.5;

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(20);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const isActive = Math.random() > 0.5;
      const line = new THREE.Line(lineGeo, isActive ? activeConnectionMat.clone() : connectionMat.clone());
      networkGroup.add(line);
      connections.push({ line, curve, isActive });
    }
  }

  // Data particles flowing along connections
  const particles = [];
  const particleGeo = new THREE.SphereGeometry(0.04, 6, 4);
  const particleMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.9,
  });

  for (let i = 0; i < 15; i++) {
    const particle = new THREE.Mesh(particleGeo, particleMat.clone());
    const connIdx = Math.floor(Math.random() * connections.length);
    particle.userData = {
      connection: connIdx,
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.008,
    };
    networkGroup.add(particle);
    particles.push(particle);
  }

  scene.add(networkGroup);

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate entire network
    networkGroup.rotation.y += 0.003;

    // Float nodes
    nodes.forEach(node => {
      const d = node.userData;
      node.position.y = d.basePos.y + Math.sin(time * 2 + d.offset) * 0.15;
    });

    // Animate particles along connections
    particles.forEach(p => {
      p.userData.t += p.userData.speed;
      if (p.userData.t > 1) {
        p.userData.t = 0;
        p.userData.connection = Math.floor(Math.random() * connections.length);
      }
      const conn = connections[p.userData.connection];
      if (conn && conn.curve) {
        const pos = conn.curve.getPoint(p.userData.t);
        p.position.copy(pos);
      }
    });

    // Pulse active connections
    connections.forEach((conn, i) => {
      if (conn.isActive) {
        conn.line.material.opacity = 0.3 + Math.sin(time * 3 + i) * 0.2;
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.clientWidth || 260;
    const h = canvas.clientHeight || 160;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(canvas);
}
