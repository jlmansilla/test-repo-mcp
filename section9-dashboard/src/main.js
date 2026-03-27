import * as THREE from 'three';
import { initBootSequence } from './boot.js';
import { initCityMap } from './cityMap.js';
import { initScanner } from './scanner.js';
import { initNetwork } from './network.js';
import { populateUnits } from './units.js';
import { populateThreats } from './threats.js';
import { initCameraFeeds } from './cameras.js';
import { startDataStream, startClock, startStatsUpdate } from './hud.js';

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence(() => {
    const dashboard = document.getElementById('dashboard');
    dashboard.classList.add('visible');

    const panels = document.querySelectorAll('.panel-section');
    panels.forEach((panel, i) => {
      setTimeout(() => panel.classList.add('visible'), i * 200);
    });

    initCityMap();
    initScanner();
    initNetwork();
    populateUnits();
    populateThreats();
    initCameraFeeds();
    startDataStream();
    startClock();
    startStatsUpdate();
  });
});
