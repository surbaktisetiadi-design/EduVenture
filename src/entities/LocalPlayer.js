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
      // ---------------------------------------------------------
      // LOGIKA KHUSUS MUSEUM (Mengecek 4 Dinding Terpisah)
      // ---------------------------------------------------------
      if (b.type === "museum") {
        const halfW = b.width / 2;
        const halfD = b.depth / 2;
        const wallThick = 1.0; // Ketebalan dinding tabrakan

        // Museum diputar 90 derajat, jadi:
        // - Sumbu X gedung menjadi Kedalaman (Depan/Belakang)
        // - Sumbu Z gedung menjadi Lebar (Kiri/Kanan)

        // 1. Dinding Belakang (X negatif)
        if (
          x + pRadius > b.x - halfW && x - pRadius < b.x - halfW + wallThick &&
          z + pRadius > b.z - halfD && z - pRadius < b.z + halfD
        ) return true;

        // 2. Dinding Kiri (Z negatif)
        if (
          x + pRadius > b.x - halfW && x - pRadius < b.x + halfW &&
          z + pRadius > b.z - halfD && z - pRadius < b.z - halfD + wallThick
        ) return true;

        // 3. Dinding Kanan (Z positif)
        if (
          x + pRadius > b.x - halfW && x - pRadius < b.x + halfW &&
          z + pRadius > b.z + halfD - wallThick && z - pRadius < b.z + halfD
        ) return true;

        // 4. Dinding Depan (X positif) dengan Celah Pintu di Tengah
        // Kita bagi menjadi dua bagian: kiri pintu dan kanan pintu
        const doorWidth = 6; // Lebar pintu
        const doorHalf = doorWidth / 2;
        
        const isFrontWall = (
          x + pRadius > b.x + halfW - wallThick && x - pRadius < b.x + halfW &&
          z + pRadius > b.z - halfD && z - pRadius < b.z + halfD
        );

        if (isFrontWall) {
          // Jika pemain berada di area pintu (tengah), jangan blokir
          const isInDoorArea = (z > b.z - doorHalf) && (z < b.z + doorHalf);
          if (!isInDoorArea) {
            return true; // Blokir jika menabrak dinding depan selain pintu
          }
        }

        continue; // Lanjut ke gedung berikutnya (karena tabrakan museum sudah dicek)
      }

      // ---------------------------------------------------------
      // LOGIKA GEDUNG BIASA (Kotak Penuh)
      // ---------------------------------------------------------
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

    // Cek Tabrakan dengan Pohon
    if (GameConfig.trees) {
      for (const t of GameConfig.trees) {
        const treeRadius = 0.6 * t.scale; 
        const distToTree = Math.hypot(x - t.x, z - t.z);
        if (distToTree < pRadius + treeRadius) return true;
      }
    }

    // Cek Tabrakan dengan Air Mancur
    if (GameConfig.fountain) {
      const f = GameConfig.fountain;
      const fountainRadius = 4.0;
      const distToFountain = Math.hypot(x - f.x, z - f.z);
      if (distToFountain < pRadius + fountainRadius) return true;
    }

    return false;
  }

  moveBy(dx, dz, dt, speed) {
    const boundary = GameConfig.world.boundary;
    let newX = this.position.x + dx * speed * dt;
    let newZ = this.position.z + dz * speed * dt;

    newX = Math.max(-boundary, Math.min(boundary, newX));
    newZ = Math.max(-boundary, Math.min(boundary, newZ));

    // Cek tabrakan per sumbu (agar bisa meluncur di dinding)
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
