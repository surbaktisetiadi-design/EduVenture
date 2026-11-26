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
    
    // Atur Kecepatan & Status
    let currentSpeed = GameConfig.player.speed;
    this.player.isCrouching = this.input.isCrouching();
    this.player.isRunning = this.input.isSprinting() && !this.player.isCrouching;

    if (this.player.isCrouching) {
      currentSpeed = GameConfig.player.crouchSpeed;
    } else if (this.player.isRunning) {
      currentSpeed = GameConfig.player.sprintSpeed;
    }

    // Pergerakan Relatif Kamera
    if (dir) {
      const forwardX = -Math.sin(rot.yaw);
      const forwardZ = -Math.cos(rot.yaw);
      const rightX = Math.cos(rot.yaw);
      const rightZ = -Math.sin(rot.yaw);

      const moveX = (rightX * dir.x) + (forwardX * -dir.z);
      const moveZ = (rightZ * dir.x) + (forwardZ * -dir.z);

      const len = Math.hypot(moveX, moveZ);
      if (len > 0) {
        this.player.moveBy(moveX / len, moveZ / len, dt, currentSpeed);
        this.targetRotation = Math.atan2(moveX / len, moveZ / len);
      }
    }

    // Rotasi Halus
    const currentRot = this.player.mesh.rotation.y;
    let diff = this.targetRotation - currentRot;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.player.mesh.rotation.y += diff * 10 * dt;

    // Lompat
    if (this.input.isJumping()) this.player.jump();

    this.player.mesh.position.copy(this.player.position);
  }
}
