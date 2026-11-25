import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class CameraController {
  constructor(camera, target, inputManager) {
    this.camera = camera;
    this.target = target;
    this.input = inputManager;
    
    // Posisi kamera saat ini (untuk smooth damp)
    this.currentPos = new THREE.Vector3(0, 0, 0);
    
    // Sudut rotasi saat ini (smooth)
    this.currentYaw = 0;
    this.currentPitch = 0;
  }

  update(dt) {
    const camConfig = GameConfig.camera;
    const rot = this.input.getCameraRotation();
    const playerPos = this.target.position;

    // 1. Smooth Rotasi Kamera
    this.currentYaw = MathUtils.damp(this.currentYaw, rot.yaw, camConfig.lerpSpeed, dt);
    this.currentPitch = MathUtils.damp(this.currentPitch, rot.pitch, camConfig.lerpSpeed, dt);

    // 2. Hitung Offset Posisi Kamera (Berdasarkan Yaw & Pitch)
    // Offset Dasar (di belakang pemain)
    const baseDist = camConfig.distance;
    const hOffset = camConfig.heightOffset;
    const sOffset = camConfig.shoulderOffset;

    // Trigonometri untuk 360 derajat
    const cosPitch = Math.cos(this.currentPitch);
    const sinPitch = Math.sin(this.currentPitch);
    const cosYaw = Math.cos(this.currentYaw);
    const sinYaw = Math.sin(this.currentYaw);

    // Posisi X dan Z (mengelilingi pemain)
    const offsetX = Math.sin(this.currentYaw) * baseDist * cosPitch;
    const offsetZ = Math.cos(this.currentYaw) * baseDist * cosPitch;
    
    // Posisi Y (naik/turun berdasarkan pitch)
    const offsetY = hOffset + (Math.sin(this.currentPitch) * baseDist);

    // Geser ke kanan bahu (Shoulder Offset) berdasarkan Yaw
    const shoulderX = Math.cos(this.currentYaw) * sOffset;
    const shoulderZ = -Math.sin(this.currentYaw) * sOffset;

    const desiredX = playerPos.x + offsetX + shoulderX;
    const desiredY = playerPos.y + offsetY;
    const desiredZ = playerPos.z + offsetZ + shoulderZ;

    // 3. Smooth Posisi
    this.camera.position.x = MathUtils.damp(this.camera.position.x, desiredX, camConfig.lerpSpeed, dt);
    this.camera.position.y = MathUtils.damp(this.camera.position.y, desiredY, camConfig.lerpSpeed, dt);
    this.camera.position.z = MathUtils.damp(this.camera.position.z, desiredZ, camConfig.lerpSpeed, dt);

    // 4. Titik Pandang (Look At)
    // Kamera melihat sedikit ke atas dari posisi pemain
    const lookAtX = playerPos.x + shoulderX; // Ikut bergeser ke kanan bahu
    const lookAtY = playerPos.y + camConfig.lookAtHeight;
    const lookAtZ = playerPos.z + shoulderZ;

    this.camera.lookAt(lookAtX, lookAtY, lookAtZ);
  }
}
