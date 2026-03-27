const CAMERA_LABELS = ['CAM-07A SECTOR 7', 'CAM-12B WATERFRONT', 'CAM-03D HUB STN', 'CAM-09C GRID INT'];

export function initCameraFeeds() {
  const grid = document.getElementById('cameraGrid');
  grid.innerHTML = '';

  CAMERA_LABELS.forEach((label, idx) => {
    const feed = document.createElement('div');
    feed.className = 'camera-feed';

    const cvs = document.createElement('canvas');
    cvs.width = 160;
    cvs.height = 90;
    feed.appendChild(cvs);

    const lbl = document.createElement('div');
    lbl.className = 'camera-label';
    lbl.textContent = label;
    feed.appendChild(lbl);

    const rec = document.createElement('div');
    rec.className = 'camera-rec';
    rec.textContent = '● REC';
    feed.appendChild(rec);

    grid.appendChild(feed);

    drawNoiseFeed(cvs, idx);
  });
}

function drawNoiseFeed(canvas, seed) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Static building-like shapes
  const shapes = [];
  for (let i = 0; i < 8; i++) {
    shapes.push({
      x: (seed * 37 + i * 41) % w,
      y: 20 + ((seed * 13 + i * 29) % (h - 30)),
      w: 10 + ((seed * 7 + i * 11) % 30),
      h: 15 + ((seed * 17 + i * 23) % 40),
    });
  }

  let frame = 0;
  function renderFrame() {
    frame++;
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, w, h);

    // Static noise
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() > 0.97) {
        const v = Math.random() * 40;
        data[i] = v * 0.3;
        data[i + 1] = v * 0.8;
        data[i + 2] = v;
        data[i + 3] = 200;
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Building silhouettes
    ctx.fillStyle = 'rgba(0, 240, 255, 0.06)';
    shapes.forEach(s => {
      ctx.fillRect(s.x, h - s.y, s.w, s.y);
    });

    // Scan line
    const scanY = (frame * 0.5) % h;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.fillRect(0, scanY, w, 1);

    // Horizontal glitch lines
    if (Math.random() > 0.95) {
      const gy = Math.random() * h;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.fillRect(0, gy, w, 2 + Math.random() * 3);
    }

    // Timestamp overlay
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.font = '7px "Share Tech Mono", monospace';
    const now = new Date();
    const ts = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    ctx.fillText(ts, 4, h - 3);

    requestAnimationFrame(renderFrame);
  }
  renderFrame();
}
