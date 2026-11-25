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

  // 👇 FUNGSI CEK TABRAKAN 👇
  checkCollision(x, z) {
    const pRadius = GameConfig.player.radius;

    // Cek tabrakan dengan semua gedung
    for (const b of GameConfig.buildings) {
      const halfW = b.width / 2;
      const halfD = b.depth / 2;

      // Rumus AABB (Axis-Aligned Bounding Box)
      if (
        x + pRadius > b.x - halfW &&
        x - pRadius < b.x + halfW &&
        z + pRadius > b.z - halfD &&
        z - pRadius < b.z + halfD
      ) {
        return true; // Tabrakan terjadi!
      }
    }
    return false;
  }

  moveBy(dx, dz, dt) {
    const speed = GameConfig.player.speed;
    const boundary = GameConfig.world.boundary;

    let newX = this.position.x + dx * speed * dt;
    let newZ = this.position.z + dz * speed * dt;

    // Cek batas pinggir lapangan
    newX = Math.max(-boundary, Math.min(boundary, newX));
    newZ = Math.max(-boundary, Math.min(boundary, newZ));

    // 👇 TERAPKAN COLLISION 👇
    // Kita cek sumbu X dan Z secara terpisah. 
    // Ini memungkinkan pemain untuk "meluncur" di dinding gedung, bukan macet total.
    if (!this.checkCollision(newX, this.position.z)) {
      this.position.x = newX;
    }
    if (!this.checkCollision(this.position.x, newZ)) {
      this.position.z = newZ;
    }
  }

  jump() {
    if (this.isGrounded) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false;
    }
  }

  update(dt) {
    super.update(dt);

    if (!this.isGrounded) {
      this.velocityY -= this.gravity * dt;
      this.position.y += this.velocityY * dt;

      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    this.mesh.position.copy(this.position);
  }
}
