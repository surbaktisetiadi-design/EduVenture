import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class PlayerController {
  constructor(localPlayer, inputManager) {
    this.player = localPlayer;
    this.input = inputManager;
    this.targetRotation = 0; // Sudut target untuk rotasi halus
  }

  update(dt) {
    const dir = this.input.getMovementVector();
    const rot = this.input.getCameraRotation();
    
    // Kecepatan berdasarkan aksi
    let currentSpeed = GameConfig.player.speed;
    if (this.input.isSprinting() && dir) currentSpeed = GameConfig.player.sprintSpeed;
    if (this.input.isCrouching() && dir) currentSpeed = GameConfig.player.crouchSpeed;

    if (dir) {
      // 1. Hitung Vektor Arah Berdasarkan Kamera (Camera-Relative)
      const forwardX = -Math.sin(rot.yaw);
      const forwardZ = -Math.cos(rot.yaw);
      
      const rightX = Math.cos(rot.yaw);
      const rightZ = -Math.sin(rot.yaw);

      // Gabungkan dengan input joystick
      const moveX = (rightX * dir.x) + (forwardX * -dir.z);
      const moveZ = (rightZ * dir.x) + (forwardZ * -dir.z);

      // Normalisasi jika diagonal
      const len = Math.hypot(moveX, moveZ);
      if (len > 0) {
        const finalMoveX = (moveX / len) * currentSpeed * dt;
        const finalMoveZ = (moveZ / len) * currentSpeed * dt;

        // Gerakkan pemain (dengan collision check di LocalPlayer)
        this.player.moveBy(finalMoveX / currentSpeed, finalMoveZ / currentSpeed, dt);

        // 2. Tentukan Rotasi Target
        this.targetRotation = Math.atan2(moveX, moveZ);
      }
    }

    // 3. Smooth Rotation (Karakter berputar halus ke arah target)
    // Jika tidak ada input, rotasi tetap di posisi terakhir
    const currentRot = this.player.mesh.rotation.y;
    
    // Atasi "long jump" saat rotasi melewati -180/180 derajat
    let diff = this.targetRotation - currentRot;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    this.player.mesh.rotation.y += diff * 10 * dt; // Faktor 10 = kecepatan putar

    // 4. Aksi Lompat
    if (this.input.isJumping()) {
      this.player.jump();
    }

    // 5. Update posisi mesh (termasuk animasi jongkok nanti)
    this.player.mesh.position.copy(this.player.position);
  }
}
