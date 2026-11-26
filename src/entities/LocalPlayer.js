import * as THREE from 'three';
import { Player } from './Player.js';
import { GameConfig } from '../config/gameConfig.js';

export class LocalPlayer extends Player {
  constructor(id) {
    super(id);
    this.velocity = new THREE.Vector3();
    this.velocityY = 0;
    this.isGrounded = true;
    this.jumpForce = 12;
    this.gravity = 30;
  }

  checkCollision(x, z) {
    const pRadius = GameConfig.player.radius;
    for (const b of GameConfig.buildings) {
      const halfW = b.width / 2;
      const halfD = b.depth / 2;
      if (
        x + pRadius > b.x - halfW && x - pRadius < b.x + halfW &&
        z + pRadius > b.z - halfD && z - pRadius < b.z + halfD
      ) return true; 
    }
    return false;
  }

  moveBy(dx, dz, dt, speed) {
    const boundary = GameConfig.world.boundary;
    let newX = this.position.x + dx * speed * dt;
    let newZ = this.position.z + dz * speed * dt;

    newX = Math.max(-boundary, Math.min(boundary, newX));
    newZ = Math.max(-boundary, Math.min(boundary, newZ));

    if (!this.checkCollision(newX, this.position.z)) this.position.x = newX;
    if (!this.checkCollision(this.position.x, newZ)) this.position.z = newZ;
  }

  jump() {
    if (this.isGrounded && !this.isCrouching) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false;
    }
  }

  update(dt) {
    super.update(dt);

    // Gravitasi
    if (!this.isGrounded) {
      this.velocityY -= this.gravity * dt;
      this.position.y += this.velocityY * dt;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    // Efek Visual Jongkok (Skala Y)
    const targetScale = this.isCrouching ? 0.6 : 1.0;
    this.mesh.scale.y = THREE.MathUtils.lerp(this.mesh.scale.y, targetScale, 15 * dt);

    this.mesh.position.copy(this.position);
  }
}
