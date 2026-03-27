import * as THREE from 'three';

export function initCityMap() {
  const container = document.querySelector('.city-map-body');
  const canvas = document.getElementById('cityMapCanvas');

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.012);

  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(25, 30, 25);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // Ground grid
  const gridSize = 40;
  const gridDiv = 40;
  const gridHelper = new THREE.GridHelper(gridSize, gridDiv, 0x1E3A5F, 0x0d1f33);
  scene.add(gridHelper);

  // Second grid above for holographic depth
  const gridHelper2 = new THREE.GridHelper(gridSize, gridDiv / 2, 0x1E3A5F, 0x0d1f33);
  gridHelper2.position.y = 0.1;
  gridHelper2.material.opacity = 0.3;
  gridHelper2.material.transparent = true;
  scene.add(gridHelper2);

  // Buildings
  const buildingMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const buildingSolidMat = new THREE.MeshBasicMaterial({
    color: 0x0a1520,
    transparent: true,
    opacity: 0.4,
  });
  const buildingGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.06,
  });

  const buildings = [];
  const buildingCount = 60;
  for (let i = 0; i < buildingCount; i++) {
    const w = 0.5 + Math.random() * 1.5;
    const d = 0.5 + Math.random() * 1.5;
    const h = 1 + Math.random() * 8 + (Math.random() > 0.85 ? 6 : 0);
    const geo = new THREE.BoxGeometry(w, h, d);
    const x = (Math.random() - 0.5) * 34;
    const z = (Math.random() - 0.5) * 34;

    const wireframe = new THREE.Mesh(geo, buildingMat.clone());
    wireframe.position.set(x, h / 2, z);
    scene.add(wireframe);

    const solid = new THREE.Mesh(geo, buildingSolidMat);
    solid.position.set(x, h / 2, z);
    scene.add(solid);

    // Top glow
    if (Math.random() > 0.6) {
      const glowGeo = new THREE.BoxGeometry(w + 0.1, 0.1, d + 0.1);
      const glow = new THREE.Mesh(glowGeo, buildingGlowMat.clone());
      glow.position.set(x, h + 0.05, z);
      scene.add(glow);
    }

    buildings.push({ wireframe, solid, baseOpacity: 0.2 + Math.random() * 0.15 });
  }

  // Heat zones
  const heatColors = [0x00F0FF, 0x00a0cc, 0xFF00A0];
  for (let i = 0; i < 5; i++) {
    const radius = 2 + Math.random() * 3;
    const heatGeo = new THREE.CircleGeometry(radius, 32);
    const heatMat = new THREE.MeshBasicMaterial({
      color: heatColors[i % heatColors.length],
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    const heat = new THREE.Mesh(heatGeo, heatMat);
    heat.rotation.x = -Math.PI / 2;
    heat.position.set((Math.random() - 0.5) * 20, 0.05, (Math.random() - 0.5) * 20);
    scene.add(heat);
  }

  // Patrol routes
  const routeMat = new THREE.LineBasicMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.5 });
  for (let r = 0; r < 3; r++) {
    const points = [];
    const cx = (Math.random() - 0.5) * 16;
    const cz = (Math.random() - 0.5) * 16;
    const segments = 8 + Math.floor(Math.random() * 6);
    for (let p = 0; p <= segments; p++) {
      const angle = (p / segments) * Math.PI * 2;
      const rad = 3 + Math.random() * 4;
      points.push(new THREE.Vector3(cx + Math.cos(angle) * rad, 0.15, cz + Math.sin(angle) * rad));
    }
    const routeGeo = new THREE.BufferGeometry().setFromPoints(points);
    const route = new THREE.Line(routeGeo, routeMat.clone());
    route.material.opacity = 0.2 + Math.random() * 0.3;
    scene.add(route);
  }

  // Scan line
  const scanGeo = new THREE.PlaneGeometry(40, 0.08);
  const scanMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  });
  const scanLine = new THREE.Mesh(scanGeo, scanMat);
  scanLine.rotation.x = -Math.PI / 2;
  scanLine.position.y = 0.2;
  scene.add(scanLine);

  // Scan line glow
  const scanGlowGeo = new THREE.PlaneGeometry(40, 1.5);
  const scanGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    transparent: true,
    opacity: 0.04,
    side: THREE.DoubleSide,
  });
  const scanGlow = new THREE.Mesh(scanGlowGeo, scanGlowMat);
  scanGlow.rotation.x = -Math.PI / 2;
  scanGlow.position.y = 0.19;
  scene.add(scanGlow);

  // Floating data particles
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = Math.random() * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00F0FF,
    size: 0.06,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Ambient light lines (vertical)
  for (let i = 0; i < 8; i++) {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.5 + Math.random() * 2, 0),
    ]);
    const lineMat = new THREE.LineBasicMaterial({
      color: i % 2 === 0 ? 0x00F0FF : 0xFF00A0,
      transparent: true,
      opacity: 0.2,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.position.set((Math.random() - 0.5) * 30, 0, (Math.random() - 0.5) * 30);
    scene.add(line);
  }

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate camera slowly
    const radius = 35;
    camera.position.x = Math.cos(time * 0.15) * radius;
    camera.position.z = Math.sin(time * 0.15) * radius;
    camera.position.y = 28 + Math.sin(time * 0.3) * 3;
    camera.lookAt(0, 0, 0);

    // Scan line movement
    scanLine.position.z = ((time * 8) % 40) - 20;
    scanGlow.position.z = scanLine.position.z;

    // Building pulse
    buildings.forEach((b, i) => {
      const pulse = Math.sin(time * 2 + i * 0.5) * 0.05;
      b.wireframe.material.opacity = b.baseOpacity + pulse;
    });

    // Particle drift
    const pos = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += 0.005;
      if (pos[i * 3 + 1] > 15) pos[i * 3 + 1] = 0;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
