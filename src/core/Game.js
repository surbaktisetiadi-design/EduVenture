import { GameLoop } from './GameLoop.js';
import { EventBus } from './EventBus.js';
import { ServiceLocator } from './ServiceLocator.js';
import { Renderer } from '../rendering/Renderer.js';
import { SceneFactory, museumInstance } from '../rendering/SceneFactory.js'; // 👈 Import museumInstance
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
    const scene = new SceneFactory().createWorldScene();

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
    
    // 👇 DAFTARKAN LANTAI MUSEUM KE PEMAIN 👇
    if (museumInstance && museumInstance.walkableFloors) {
      localPlayer.walkableFloors = museumInstance.walkableFloors;
      console.log(`[EduVenture] ${museumInstance.walkableFloors.length} area lantai museum berhasil didaftarkan.`);
    }
    
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
      // Update player, manager, dan kamera
      playerCtrl.update(dt);
      playerManager.update(dt);
      cameraCtrl.update(dt);
      
      // 👇 LOGIKA PINTU MUSEUM OTOMATIS 👇
      if (museumInstance) {
        // Cek jarak pemain ke setiap pintu
        museumInstance.interactiveDoors.forEach(door => {
          // Jarak antara pemain dan titik tengah pintu
          const dist = localPlayer.position.distanceTo(door.worldPos);
          
          if (dist < 5.0) {
            // Buka pintu jika pemain mendekat (jarak < 5 unit)
            door.targetAngle = door.openAngle;
          } else {
            // Tutup pintu jika pemain menjauh
            door.targetAngle = 0;
          }
        });
        
        // Animasi engsel pintu
        museumInstance.update(dt);
      }
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
