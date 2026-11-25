import * as THREE from 'three';
import { Player } from './Player.js';
import { GameConfig } from '../config/gameConfig.js';

export class LocalPlayer extends Player {
  constructor(id) {
    super(id);
    this.velocity = new THREE.Vector3();
    
    // Variabel untuk lompat
    this.velocityY = 0;
    this.isGrounded = true;
    this.jumpForce = 12; // Kekuatan lompatan
    this.gravity = 30;   // Tarikan gravitasi
  }

  moveBy(dx, dz, dt) {
    const speed = GameConfig.player.speed;
    const boundary = GameConfig.world.boundary;

    let newX = this.position.x + dx * speed * dt;
    let newZ = this.position.z + dz * speed * dt;

    newX = Math.max(-boundary, Math.min(boundary, newX));
    newZ = Math.max(-boundary, Math.min(boundary, newZ));

    // Simpan posisi X dan Z, tapi Y ditentukan oleh gravitasi nanti
    this.position.x = newX;
    this.position.z = newZ;
  }

  jump() {
    // Hanya bisa lompat jika sedang menyentuh tanah
    if (this.isGrounded) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false;
    }
  }

  update(dt) {
    super.update(dt);

    // Terapkan gravitasi
    if (!this.isGrounded) {
      this.velocityY -= this.gravity * dt;
      this.position.y += this.velocityY * dt;

      // Cek jika sudah menyentuh tanah (y <= 0)
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    // Update posisi mesh Three.js
    this.mesh.position.copy(this.position);
  }
}
