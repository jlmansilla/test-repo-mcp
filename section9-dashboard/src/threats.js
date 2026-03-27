const THREATS = [
  {
    id: 'THR-2026-0847',
    level: 'high',
    desc: 'Unidentified cyberbrain signal detected in Sector 9. Ghost-dubbing suspected. Counter-intel protocols activated.',
    meta: 'ORIGIN: ABANDONED DISTRICT 7-C | 3 MIN AGO',
  },
  {
    id: 'THR-2026-0844',
    level: 'medium',
    desc: 'Anomalous network traffic pattern consistent with known "Puppet Master" signature fragments. Deep scan in progress.',
    meta: 'ORIGIN: BACKBONE NODE 14 | 12 MIN AGO',
  },
  {
    id: 'THR-2026-0841',
    level: 'high',
    desc: 'Multiple civilian reports of "walking ghosts" in Waterfront Zone. Possible remote hack of prosthetic bodies.',
    meta: 'ORIGIN: WATERFRONT ZONE B | 28 MIN AGO',
  },
  {
    id: 'THR-2026-0839',
    level: 'low',
    desc: 'Routine sweep detected 2 compromised municipal cameras. Restoration protocols initiated.',
    meta: 'ORIGIN: GRID SECTOR 11 | 45 MIN AGO',
  },
  {
    id: 'THR-2026-0836',
    level: 'medium',
    desc: 'Encrypted transmission intercepted on military-grade frequency. Source triangulation pending.',
    meta: 'ORIGIN: UNKNOWN — RELAY 7 | 1 HR AGO',
  },
];

export function populateThreats() {
  const list = document.getElementById('threatList');
  list.innerHTML = '';

  THREATS.forEach(threat => {
    const el = document.createElement('div');
    el.className = 'threat-item';
    el.innerHTML = `
      <div class="threat-header">
        <span class="threat-id">${threat.id}</span>
        <span class="threat-level ${threat.level}">${threat.level.toUpperCase()}</span>
      </div>
      <div class="threat-desc">${threat.desc}</div>
      <div class="threat-meta">${threat.meta}</div>
    `;
    list.appendChild(el);
  });
}
