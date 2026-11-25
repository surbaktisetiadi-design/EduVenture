import { GameConfig } from '../config/gameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';
import * as THREE from 'three';

export class CameraController {
  constructor(camera, target, inputManager) {
    this.camera = camera;
    this.target = target;
    this.input = inputManager;
    
    // Jarak kamera ke pemain
    this.distance = 20; 
    this.height = 12;
  }

  update(dt) {
    const targetPos = this.target.position;
    const rot = this.input.getCameraRotation();

    // Hitung posisi kamera menggunakan trigonometri (Sin & Cos)
    // rot.x adalah putaran kiri/kanan, rot.y adalah naik/turun
    const offsetX = Math.sin(rot.x) * this.distance * Math.cos(rot.y);
    const offsetZ = Math.cos(rot.x) * this.distance * Math.cos(rot.y);
    const offsetY = this.height + (Math.sin(rot.y) * this.distance);

    const desiredX = targetPos.x + offsetX;
    const desiredY = targetPos.y + offsetY;
    const desiredZ = targetPos.z + offsetZ;

    // Smooth damp agar kamera bergerak halus
    const lambda = GameConfig.camera.lerpSpeed;
    this.camera.position.x = MathUtils.damp(this.camera.position.x, desiredX, lambda, dt);
    this.camera.position.y = MathUtils.damp(this.camera.position.y, desiredY, lambda, dt);
    this.camera.position.z = MathUtils.damp(this.camera.position.z, desiredZ, lambda, dt);

    // Pandangan kamera selalu tertuju pada pemain
    this.camera.lookAt(targetPos.x, targetPos.y + GameConfig.camera.lookAtHeight, targetPos.z);
  }
}
