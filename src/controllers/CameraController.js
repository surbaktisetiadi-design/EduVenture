import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class CameraController {
  constructor(camera, target, inputManager) {
    this.camera = camera;
    this.target = target;
    this.input = inputManager;
    
    this.currentYaw = 0;
    this.currentPitch = 0;
    
    // Batas minimal kamera menyentuh tanah
    this.minCameraHeight = 1.5; 
  }

  update(dt) {
    const camConfig = GameConfig.camera;
    const rot = this.input.getCameraRotation();
    const playerPos = this.target.position;

    // 1. Smooth Rotasi
    this.currentYaw = MathUtils.damp(this.currentYaw, rot.yaw, camConfig.lerpSpeed, dt);
    this.currentPitch = MathUtils.damp(this.currentPitch, rot.pitch, camConfig.lerpSpeed, dt);

    // 2. Hitung Offset (Jarak kamera dari pemain)
    const baseDist = camConfig.distance;
    const hOffset = camConfig.heightOffset;
    const sOffset = camConfig.shoulderOffset;

    const cosPitch = Math.cos(this.currentPitch);
    const sinPitch = Math.sin(this.currentPitch);
    
    const offsetX = Math.sin(this.currentYaw) * baseDist * cosPitch;
    const offsetZ = Math.cos(this.currentYaw) * baseDist * cosPitch;
    const offsetY = hOffset + (sinPitch * baseDist);

    const shoulderX = Math.cos(this.currentYaw) * sOffset;
    const shoulderZ = -Math.sin(this.currentYaw) * sOffset;

    // Posisi target kamera
    let desiredX = playerPos.x + offsetX + shoulderX;
    let desiredY = playerPos.y + offsetY;
    let desiredZ = playerPos.z + offsetZ + shoulderZ;

    // 👇 KUNCI PERBAIKAN: Cegah kamera tembus tanah 👇
    // Jika Y kamera kurang dari batas minimal, paksa naik ke batas minimal.
    if (desiredY < this.minCameraHeight) {
      desiredY = this.minCameraHeight;
    }

    // 3. Smooth Posisi Kamera
    this.camera.position.x = MathUtils.damp(this.camera.position.x, desiredX, camConfig.lerpSpeed, dt);
    this.camera.position.y = MathUtils.damp(this.camera.position.y, desiredY, camConfig.lerpSpeed, dt);
    this.camera.position.z = MathUtils.damp(this.camera.position.z, desiredZ, camConfig.lerpSpeed, dt);

    // 4. Titik Pandang
    // Saat kamera mentok di tanah, lookAt tetap ke arah dada pemain
    const lookAtX = playerPos.x + shoulderX;
    const lookAtY = playerPos.y + camConfig.lookAtHeight;
    const lookAtZ = playerPos.z + shoulderZ;

    this.camera.lookAt(lookAtX, lookAtY, lookAtZ);
  }
}
