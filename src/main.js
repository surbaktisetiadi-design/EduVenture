import { Game } from './core/Game.js';

const game = new Game();
game.init();
game.start();

// Expose untuk debugging di konsol browser (F12)
window.__game = game;

console.log('[EduVenture] Bootstrap selesai.');