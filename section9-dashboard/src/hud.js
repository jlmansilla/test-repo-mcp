const DATA_CHARS = 'ABCDEF0123456789█▓▒░╔╗╚╝║═abcdefghijklmnopqrstuvwxyz<>{}[]|/\\~`!@#$%^&*';

function generateDataString(length) {
  let str = '';
  for (let i = 0; i < length; i++) {
    if (Math.random() > 0.92) {
      str += ' ';
    } else if (Math.random() > 0.95) {
      str += ' | ';
    } else {
      str += DATA_CHARS[Math.floor(Math.random() * DATA_CHARS.length)];
    }
  }
  return str;
}

export function startDataStream() {
  const streamEl = document.getElementById('dataStream');
  let text = generateDataString(600);

  function update() {
    // Shift text and add new chars
    text = text.substring(2) + generateDataString(2);
    streamEl.textContent = text;
    requestAnimationFrame(update);
  }
  update();
}

export function startClock() {
  const timeEl = document.getElementById('clockTime');
  const dateEl = document.getElementById('clockDate');

  function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    timeEl.textContent = `${h}:${m}:${s}`;

    const y = now.getFullYear();
    const mo = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    dateEl.textContent = `${y}.${mo}.${d}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}

export function startStatsUpdate() {
  const cpuBar = document.getElementById('cpuBar');
  const cpuValue = document.getElementById('cpuValue');
  const memBar = document.getElementById('memBar');
  const memValue = document.getElementById('memValue');
  const netBar = document.getElementById('netBar');
  const netValue = document.getElementById('netValue');
  const encBar = document.getElementById('encBar');
  const encValue = document.getElementById('encValue');
  const latencyValue = document.getElementById('latencyValue');
  const packetsValue = document.getElementById('packetsValue');
  const nodeCount = document.getElementById('nodeCount');
  const activeConns = document.getElementById('activeConns');
  const bandwidth = document.getElementById('bandwidth');

  let cpu = 73, mem = 58, net = 41, enc = 92;

  function update() {
    // Fluctuate values
    cpu = Math.max(20, Math.min(98, cpu + (Math.random() - 0.5) * 6));
    mem = Math.max(30, Math.min(90, mem + (Math.random() - 0.5) * 3));
    net = Math.max(10, Math.min(85, net + (Math.random() - 0.5) * 8));
    enc = Math.max(80, Math.min(99, enc + (Math.random() - 0.5) * 2));

    cpuBar.style.width = cpu + '%';
    cpuValue.textContent = Math.round(cpu) + '%';
    memBar.style.width = mem + '%';
    memValue.textContent = Math.round(mem) + '%';
    netBar.style.width = net + '%';
    netValue.textContent = Math.round(net) + '%';
    encBar.style.width = enc + '%';
    encValue.textContent = Math.round(enc) + '%';

    latencyValue.textContent = (8 + Math.floor(Math.random() * 12)) + 'ms';
    packetsValue.textContent = (0.8 + Math.random() * 1.5).toFixed(1) + 'M';

    nodeCount.textContent = 20 + Math.floor(Math.random() * 8);
    activeConns.textContent = 14 + Math.floor(Math.random() * 10);
    bandwidth.textContent = (3 + Math.random() * 4).toFixed(1) + ' TB/s';
  }

  setInterval(update, 2000);
}
