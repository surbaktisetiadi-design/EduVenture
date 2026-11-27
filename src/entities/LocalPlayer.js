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

    // 1. Cek Tabrakan dengan Gedung / Rumah / Museum
    for (const b of GameConfig.buildings) {
      const halfW = b.width / 2;
      const halfD = b.depth / 2;
      
      // LOGIKA KHUSUS MUSEUM (Pintu di sisi Kanan/Timur karena diputar 90 derajat)
      if (b.type === "museum") {
        // Cek apakah pemain berada di zona pintu masuk
        // X: sedikit keluar dari dinding kanan gedung
        // Z: berada di tengah-tengah lebar pintu
        const isInDoorX = (x > b.x + halfW - 1.5) && (x < b.x + halfW + 1.5);
        const isInDoorZ = (z > b.z - 3) && (z < b.z + 3);

        if (isInDoorX && isInDoorZ) {
          // Jika di area pintu, lewati pengecekan tabrakan gedung ini
          continue; 
        }
      }

      // Pengecekan tabrakan kotak biasa (Bounding Box)
      if (
        x + pRadius > b.x - halfW &&
        x - pRadius < b.x + halfW &&
        z + pRadius > b.z - halfD &&
        z - pRadius < b.z + halfD
      ) {
        return true; 
      }
    }

    // 2. Cek Tabrakan dengan Pohon
    for (const t of GameConfig.trees) {
      const treeRadius = 0.6 * t.scale; 
      const distToTree = Math.hypot(x - t.x, z - t.z);
      if (distToTree < pRadius + treeRadius) return true;
    }

    // 3. Cek Tabrakan dengan Air Mancur
    const f = GameConfig.fountain;
    const fountainRadius = 4.0;
    const distToFountain = Math.hypot(x - f.x, z - f.z);
    if (distToFountain < pRadius + fountainRadius) return true;

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
    if (this.isGrounded && !this.isCrouching) {
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
