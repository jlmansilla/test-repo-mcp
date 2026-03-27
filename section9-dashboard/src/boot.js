const BOOT_LINES = [
  { text: 'SECTION 9 TACTICAL COMMAND SYSTEM v4.7.2', delay: 0 },
  { text: '═══════════════════════════════════════════', delay: 100 },
  { text: '', delay: 150 },
  { text: 'INITIALIZING NEURAL UPLINK...', delay: 200 },
  { text: '  > SYNAPSE BRIDGE.............. ', suffix: 'OK', color: 'cyan', delay: 400 },
  { text: '  > CORTEX INTERFACE........... ', suffix: 'OK', color: 'cyan', delay: 550 },
  { text: '  > MOTOR FUNCTION LINK........ ', suffix: 'OK', color: 'cyan', delay: 700 },
  { text: '', delay: 800 },
  { text: 'DECRYPTING SATELLITE FEED...', delay: 850 },
  { text: '  > AES-4096 KEY EXCHANGE...... ', suffix: 'VERIFIED', color: 'cyan', delay: 1000 },
  { text: '  > ORBITAL PATH LOCK.......... ', suffix: 'CONFIRMED', color: 'cyan', delay: 1150 },
  { text: '  > SIGNAL STRENGTH............ ', suffix: '98.2%', color: 'cyan', delay: 1300 },
  { text: '', delay: 1400 },
  { text: 'LOADING HOLOGRAPHIC PROJECTIONS...', delay: 1450 },
  { text: '  > CITY MAP RENDERER.......... ', suffix: 'LOADED', color: 'cyan', delay: 1600 },
  { text: '  > NETWORK TOPOLOGY........... ', suffix: 'LOADED', color: 'cyan', delay: 1750 },
  { text: '  > BIO-SCANNER MODULE......... ', suffix: 'LOADED', color: 'cyan', delay: 1900 },
  { text: '  > SURVEILLANCE FEEDS......... ', suffix: 'LOADED', color: 'cyan', delay: 2050 },
  { text: '', delay: 2150 },
  { text: 'ESTABLISHING SECURE TUNNEL...', delay: 2200 },
  { text: '  > VPN MESH TOPOLOGY.......... ', suffix: 'ACTIVE', color: 'cyan', delay: 2400 },
  { text: '  > QUANTUM ENCRYPTION......... ', suffix: 'ENABLED', color: 'cyan', delay: 2550 },
  { text: '', delay: 2650 },
  { text: 'CYBERBRAIN SYNC............... ', suffix: 'SYNCHRONIZED', color: 'cyan', delay: 2700 },
  { text: '', delay: 2850 },
  { text: '>> COMMAND DASHBOARD ONLINE <<', color: 'magenta', delay: 2900 },
  { text: '>> WELCOME, OPERATOR <<', color: 'magenta', delay: 3100 },
];

export function initBootSequence(onComplete) {
  const overlay = document.getElementById('bootOverlay');
  const bootText = document.getElementById('bootText');

  let totalDelay = 0;
  BOOT_LINES.forEach((line) => {
    const el = document.createElement('div');
    el.className = 'boot-line';
    el.style.animationDelay = `${line.delay}ms`;

    const textSpan = document.createElement('span');
    textSpan.textContent = line.text;
    el.appendChild(textSpan);

    if (line.suffix) {
      const suffixSpan = document.createElement('span');
      suffixSpan.textContent = line.suffix;
      suffixSpan.className = line.color === 'cyan' ? 'text-cyan' : 'text-magenta';
      suffixSpan.style.animationDelay = `${line.delay + 200}ms`;
      el.appendChild(suffixSpan);
    }

    if (line.color && !line.suffix) {
      el.classList.add(line.color === 'cyan' ? 'text-cyan' : 'text-magenta');
    }

    bootText.appendChild(el);
    totalDelay = Math.max(totalDelay, line.delay);
  });

  setTimeout(() => {
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
      if (onComplete) onComplete();
    }, 800);
  }, totalDelay + 800);
}
