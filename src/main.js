import { Game } from './core/Game.js';

try {
  const game = new Game();
  game.init();
  game.start();
  window.__game = game; // untuk debugging di console
  console.log('[EduVenture] Bootstrap selesai.');
} catch (err) {
  console.error('[EduVenture] GAGAL:', err.message);
  console.error(err.stack);
}
