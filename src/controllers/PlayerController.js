import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class PlayerController {
  constructor(localPlayer, inputManager) {
    this.player = localPlayer;
    this.input = inputManager;
    this.targetRotation = 0; 
  }

  update(dt) {
    const dir = this.input.getMovementVector();
    const rot = this.input.getCameraRotation();
    
    // Tentukan kecepatan
    let currentSpeed = GameConfig.player.speed;
    if (this.input.isSprinting() && dir) currentSpeed = GameConfig.player.sprintSpeed;
    if (this.input.isCrouching() && dir) currentSpeed = GameConfig.player.crouchSpeed;

    if (dir) {
      // Arah berdasarkan kamera (Camera-Relative)
      const forwardX = -Math.sin(rot.yaw);
      const forwardZ = -Math.cos(rot.yaw);
      const rightX = Math.cos(rot.yaw);
      const rightZ = -Math.sin(rot.yaw);

      // Gabungkan
      const moveX = (rightX * dir.x) + (forwardX * -dir.z);
      const moveZ = (rightZ * dir.x) + (forwardZ * -dir.z);

      const len = Math.hypot(moveX, moveZ);
      if (len > 0) {
        // Normalisasi arah (0 sampai 1)
        const normalizedX = moveX / len;
        const normalizedZ = moveZ / len;

        // Panggil moveBy dengan arah yang sudah dinormalisasi dan dt
        // (LocalPlayer akan mengalikannya dengan kecepatan)
        this.player.moveBy(normalizedX, normalizedZ, dt, currentSpeed);

        // Rotasi target
        this.targetRotation = Math.atan2(normalizedX, normalizedZ);
      }
    }

    // Smooth Rotation
    const currentRot = this.player.mesh.rotation.y;
    let diff = this.targetRotation - currentRot;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.player.mesh.rotation.y += diff * 10 * dt;

    // Lompat
    if (this.input.isJumping()) {
      this.player.jump();
    }

    // Update visual mesh
    this.player.mesh.position.copy(this.player.position);
  }
}
