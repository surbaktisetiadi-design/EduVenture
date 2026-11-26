import * as THREE from 'three';
import { Player } from './Player.js';
import { GameConfig } from '../config/gameConfig.js';

export class LocalPlayer extends Player {
  constructor(id) {
    super(id);
    
    this.velocity = new THREE.Vector3();
    this.velocityY = 0;
    this.isGrounded = true; // 👈 Status menyentuh tanah
    this.jumpForce = 12;
    this.gravity = 30;
  }

  checkCollision(x, z) {
    const pRadius = GameConfig.player.radius;
    
    // Cek tabrakan dengan semua gedung
    for (const b of GameConfig.buildings) {
      const halfW = b.width / 2;
      const halfD = b.depth / 2;
      
      if (
        x + pRadius > b.x - halfW &&
        x - pRadius < b.x + halfW &&
        z + pRadius > b.z - halfD &&
        z - pRadius < b.z + halfD
      ) {
        return true; 
      }
    }
    return false;
  }

  moveBy(dx, dz, dt, speed) {
    const boundary = GameConfig.world.boundary;
    let newX = this.position.x + dx * speed * dt;
    let newZ = this.position.z + dz * speed * dt;

    // Batasi gerakan di dalam peta
    newX = Math.max(-boundary, Math.min(boundary, newX));
    newZ = Math.max(-boundary, Math.min(boundary, newZ));

    // Terapkan gerakan jika tidak menabrak gedung
    if (!this.checkCollision(newX, this.position.z)) {
      this.position.x = newX;
    }
    if (!this.checkCollision(this.position.x, newZ)) {
      this.position.z = newZ;
    }
  }

  jump() {
    // Hanya bisa lompat jika sedang di tanah dan tidak sedang jongkok
    if (this.isGrounded && !this.isCrouching) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false; // 👈 Lepas dari tanah
    }
  }

  update(dt) {
    // Panggil animasi dasar (berjalan, lari, jongkok, kedip) dari Player.js
    // Di dalam Player.js, animasi kaki akan berhenti jika isGrounded = false
    super.update(dt);

    // --- Fisika Gravitasi & Lompat ---
    if (!this.isGrounded) {
      this.velocityY -= this.gravity * dt;
      this.position.y += this.velocityY * dt;

      // Cek jika sudah menyentuh tanah (Y <= 0)
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocityY = 0;
        this.isGrounded = true; // 👈 Kembali menyentuh tanah
      }
    }

    // Update posisi visual mesh
    this.mesh.position.copy(this.position);
  }
}
