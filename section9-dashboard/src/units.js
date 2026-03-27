const UNITS = [
  { name: 'MOTOKO K.', role: 'MAJOR — FIELD COMMANDER', initials: 'MK', status: 'active', health: 98, cyber: 92 },
  { name: 'BATOU', role: '2ND IC — HEAVY COMBAT', initials: 'BT', status: 'active', health: 95, cyber: 87 },
  { name: 'TOGUSA', role: 'INVESTIGATOR', initials: 'TG', status: 'active', health: 88, cyber: 15 },
  { name: 'ISHIKAWA', role: 'INTELLIGENCE — SIGINT', initials: 'IS', status: 'active', health: 82, cyber: 34 },
  { name: 'SAITO', role: 'SNIPER — OVERWATCH', initials: 'ST', status: 'standby', health: 91, cyber: 45 },
  { name: 'PAZ', role: 'UNDERCOVER OPS', initials: 'PZ', status: 'active', health: 79, cyber: 28 },
  { name: 'BORMA', role: 'EOD — TECH SPECIALIST', initials: 'BM', status: 'standby', health: 94, cyber: 52 },
  { name: 'BOG', role: 'CYBER ATTACK DOG', initials: 'BG', status: 'active', health: 100, cyber: 78 },
];

export function populateUnits() {
  const list = document.getElementById('unitsList');
  list.innerHTML = '';

  UNITS.forEach(unit => {
    const el = document.createElement('div');
    el.className = 'unit-item';

    const healthColor = unit.health > 90 ? '#00FF88' : unit.health > 70 ? '#FFE600' : '#FF3344';

    el.innerHTML = `
      <div class="unit-avatar">${unit.initials}</div>
      <div class="unit-info">
        <div class="unit-name">${unit.name}</div>
        <div class="unit-role">${unit.role}</div>
      </div>
      <div class="unit-health">
        <div class="unit-health-fill" style="width:${unit.health}%;background:${healthColor};box-shadow:0 0 4px ${healthColor}40"></div>
      </div>
      <div class="unit-status ${unit.status}">${unit.status.toUpperCase()}</div>
    `;
    list.appendChild(el);
  });
}
