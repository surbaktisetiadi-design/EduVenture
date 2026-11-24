import { GameLoop } from './GameLoop.js';
import { EventBus } from './EventBus.js';
import { ServiceLocator } from './ServiceLocator.js';
import { Renderer } from '../rendering/Renderer.js';
import { SceneFactory } from '../rendering/SceneFactory.js';

export class Game {
  constructor() {
    this.loop = new GameLoop();
    this.events = new EventBus();
    this.services = new ServiceLocator();
  }

  init() {
    // Rendering
    const renderer = new Renderer('game-canvas');
    const scene = new SceneFactory().createWorldScene();

    // Registrasi service supaya bisa diakses layer lain nanti
    this.services.register('events', this.events);
    this.services.register('renderer', renderer);
    this.services.register('scene', scene);

    // Setiap frame render: gambar scene dengan kamera
    this.loop.onRender(() => {
      renderer.render(scene);
    });

    console.log('[EduVenture] Inisialisasi selesai.');
  }

  start() {
    this.loop.start();
    console.log('[EduVenture] Game loop berjalan.');
  }
}