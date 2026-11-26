import { GameLoop } from './GameLoop.js';
import { EventBus } from './EventBus.js';
import { ServiceLocator } from './ServiceLocator.js';
import { Renderer } from '../rendering/Renderer.js';
import { SceneFactory } from '../rendering/SceneFactory.js';
import { InputManager } from '../input/InputManager.js';
import { LocalPlayer } from '../entities/LocalPlayer.js';
import { PlayerManager } from '../managers/PlayerManager.js';
import { PlayerController } from '../controllers/PlayerController.js';
import { CameraController } from '../controllers/CameraController.js';
import { GameConfig } from '../config/gameConfig.js';

export class Game {
  constructor() {
    this.loop = new GameLoop();
    this.events = new EventBus();
    this.services = new ServiceLocator();
  }

  init() {
    // 1. Rendering
    const renderer = new Renderer('game-canvas');
    const scene = new SceneFactory().createWorldScene(); // 👈 Pastikan namanya createWorldScene()

    this.services.register('events', this.events);
    this.services.register('renderer', renderer);
    this.services.register('scene', scene);

    // 2. Input
    const input = new InputManager();
    this.services.register('input', input);

    // 3. Player
    const playerManager = new PlayerManager(scene);
    const localPlayer = new LocalPlayer('local-1');
    
    // Posisikan pemain di titik spawn
    localPlayer.setPosition(GameConfig.player.spawnX, GameConfig.player.spawnZ);
    
    playerManager.addLocalPlayer(localPlayer);
    this.services.register('playerManager', playerManager);
    this.services.register('localPlayer', localPlayer);

    // 4. Controllers
    const playerCtrl = new PlayerController(localPlayer, input);
    const cameraCtrl = new CameraController(renderer.getCamera(), localPlayer, input);
    this.services.register('playerCtrl', playerCtrl);
    this.services.register('cameraCtrl', cameraCtrl);

    // Posisikan kamera langsung di belakang pemain saat start
    cameraCtrl.update(1);

    // 5. Update Loop
    this.loop.onUpdate((dt) => {
      playerCtrl.update(dt);
      playerManager.update(dt);
      cameraCtrl.update(dt);
    });

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
