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
    
    // --- LOGIKA KECEPATAN (Lari / Jongkok / Jalan) ---
    let currentSpeed = GameConfig.player.speed;
    
    // Jika jongkok, kecepatan melambat
    if (this.input.isCrouching()) {
      currentSpeed = GameConfig.player.crouchSpeed;
      this.player.setCrouching(true);
    } else {
      this.player.setCrouching(false);
      
      // Jika lari (dan tidak jongkok), kecepatan bertambah
      if (this.input.isSprinting()) {
        currentSpeed = GameConfig.player.sprintSpeed;
      }
    }

    // --- PERGERAKAN ---
    if (dir) {
      const forwardX = -Math.sin(rot.yaw);
      const forwardZ = -Math.cos(rot.yaw);
      const rightX = Math.cos(rot.yaw);
      const rightZ = -Math.sin(rot.yaw);

      const moveX = (rightX * dir.x) + (forwardX * -dir.z);
      const moveZ = (rightZ * dir.x) + (forwardZ * -dir.z);

      const len = Math.hypot(moveX, moveZ);
      
      if (len > 0) {
        const normalizedX = moveX / len;
        const normalizedZ = moveZ / len;

        this.player.moveBy(normalizedX, normalizedZ, dt, currentSpeed);
        this.targetRotation = Math.atan2(normalizedX, normalizedZ);
      }
    }

    // --- ROTASI HALUS ---
    const currentRot = this.player.mesh.rotation.y;
    let diff = this.targetRotation - currentRot;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.player.mesh.rotation.y += diff * 10 * dt;

    // --- LOMPAT ---
    if (this.input.isJumping()) {
      this.player.jump();
    }

    // Update posisi visual
    this.player.mesh.position.copy(this.player.position);
  }
}
