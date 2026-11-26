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
    
    // Variabel Jongkok
    this.isCrouching = false;
    this.currentHeightScale = 1.0; // Skala tinggi (1 = normal, 0.6 = jongkok)
  }

  checkCollision(x, z) {
    const pRadius = GameConfig.player.radius;
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

    newX = Math.max(-boundary, Math.min(boundary, newX));
    newZ = Math.max(-boundary, Math.min(boundary, newZ));

    if (!this.checkCollision(newX, this.position.z)) {
      this.position.x = newX;
    }
    if (!this.checkCollision(this.position.x, newZ)) {
      this.position.z = newZ;
    }
  }

  jump() {
    // Tidak bisa lompat jika sedang jongkok
    if (this.isGrounded && !this.isCrouching) {
      this.velocityY = this.jumpForce;
      this.isGrounded = false;
    }
  }

  setCrouching(crouch) {
    this.isCrouching = crouch;
  }

  update(dt) {
    // Panggil animasi dasar (berjalan, kedip)
    super.update(dt);

    // --- 1. Fisika Lompat & Gravitasi ---
    if (!this.isGrounded) {
      this.velocityY -= this.gravity * dt;
      this.position.y += this.velocityY * dt;

      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    // --- 2. Efek Visual Jongkok (Skala Y) ---
    const targetScale = this.isCrouching ? 0.6 : 1.0;
    // Animasi halus (smooth) saat jongkok/berdiri
    this.currentHeightScale = THREE.MathUtils.lerp(this.currentHeightScale, targetScale, 15 * dt);
    
    // Terapkan skala ke mesh. 
    // Karena posisi mesh berada di kaki (Y=0), kita bisa langsung mengubah scale.y
    this.mesh.scale.y = this.currentHeightScale;

    // Update posisi mesh
    this.mesh.position.copy(this.position);
  }
}
