import { GameConfig } from '../config/gameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class CameraController {
  constructor(camera, target, inputManager) {
    this.camera = camera;
    this.target = target;
    this.input = inputManager;
    
    // JARAK KONSTAN KAMERA
    this.distance = 15; // Jarak dari pemain
    this.height = 8;    // Ketinggian kamera
  }

  update(dt) {
    const targetPos = this.target.position;
    const rot = this.input.getCameraRotation(); // Sudut X (kiri/kanan) & Y (naik/turun)

    // Hitung posisi kamera menggunakan trigonometri
    // Semakin besar rot.y, kamera semakin tinggi. 
    const offsetX = Math.sin(rot.x) * this.distance * Math.cos(rot.y);
    const offsetZ = Math.cos(rot.x) * this.distance * Math.cos(rot.y);
    const offsetY = this.height + (Math.sin(rot.y) * this.distance);

    const desiredX = targetPos.x + offsetX;
    const desiredY = targetPos.y + offsetY;
    const desiredZ = targetPos.z + offsetZ;

    // Smooth damp agar gerakan kamera halus (tidak kaku)
    const lambda = GameConfig.camera.lerpSpeed;
    this.camera.position.x = MathUtils.damp(this.camera.position.x, desiredX, lambda, dt);
    this.camera.position.y = MathUtils.damp(this.camera.position.y, desiredY, lambda, dt);
    this.camera.position.z = MathUtils.damp(this.camera.position.z, desiredZ, lambda, dt);

    this.camera.lookAt(targetPos.x, targetPos.y + GameConfig.camera.lookAtHeight, targetPos.z);
  }
}
