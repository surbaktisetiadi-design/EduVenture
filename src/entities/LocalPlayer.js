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
    this.walkableFloors = []; // Array untuk menyimpan lantai
  }

  // Mendeteksi ketinggian lantai di bawah kaki pemain
  getSupportHeight(x, y, z) {
    let maxY = 0.0;
    const r = GameConfig.player.radius * 0.8;
    const stepTolerance = 0.6; // Toleransi naik tangga

    for (let i = 0; i < this.walkableFloors.length; i++) {
      const f = this.walkableFloors[i];
      if (x + r >= f.minX && x - r <= f.maxX && z + r >= f.minZ && z - r <= f.maxZ) {
        if (f.topY <= y + stepTolerance && f.topY > maxY) {
          maxY = f.topY;
        }
      }
    }
    return maxY;
  }

   checkCollision(x, z) {
    const pRadius = GameConfig.player.radius;

    for (const b of GameConfig.buildings) {
      // ---------------------------------------------------------
      // LOGIKA KHUSUS MUSEUM (Mengecek Dinding Secara Terpisah)
      // ---------------------------------------------------------
      if (b.type === "museum") {
        const halfW = b.width / 2;
        const halfD = b.depth / 2;
        const wallThick = 1.5; // Ketebalan tabrakan tembok

        // Catatan: Museum diputar 90 derajat, jadi:
        // - Sumbu X gedung kita menjadi Kedalaman (Depan/Belakang)
        // - Sumbu Z gedung kita menjadi Lebar (Kiri/Kanan)

        // 1. Tembok Belakang (X negatif dari pusat museum)
        if (
          x + pRadius > b.x - halfW && x - pRadius < b.x - halfW + wallThick &&
          z + pRadius > b.z - halfD && z - pRadius < b.z + halfD
        ) return true;

        // 2. Tembok Kiri (Z negatif dari pusat museum)
        if (
          x + pRadius > b.x - halfW && x - pRadius < b.x + halfW &&
          z + pRadius > b.z - halfD && z - pRadius < b.z - halfD + wallThick
        ) return true;

        // 3. Tembok Kanan (Z positif dari pusat museum)
        if (
          x + pRadius > b.x - halfW && x - pRadius < b.x + halfW &&
          z + pRadius > b.z + halfD - wallThick && z - pRadius < b.z + halfD
        ) return true;

        // 4. Tembok Depan (X positif) dengan Celah Pintu di Tengah
        // Pintu kita letakkan di tengah, dengan lebar 6 unit.
        const doorHalf = 3.5; // Setengah dari lebar pintu (7 unit total)
        
        // Pengecekan Tembok Depan
        if (
          x + pRadius > b.x + halfW - wallThick && x - pRadius < b.x + halfW &&
          z + pRadius > b.z - halfD && z - pRadius < b.z + halfD
        ) {
          // Jika pemain berada di area pintu (tengah), izinkan masuk
          const isInDoorArea = (z > b.z - doorHalf) && (z < b.z + doorHalf);
          if (!isInDoorArea) return true; 
        }

        continue; // Lanjut ke gedung berikutnya
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
        if (Math.hypot(x - t.x, z - t.z) < pRadius + treeRadius) return true;
      }
    }

    // Cek Tabrakan dengan Air Mancur
    if (GameConfig.fountain) {
      const f = GameConfig.fountain;
      if (Math.hypot(x - f.x, z - f.z) < pRadius + 4.0) return true;
    }

    return false;
  }

      if (
        x + pRadius > b.x - halfW && x - pRadius < b.x + halfW &&
        z + pRadius > b.z - halfD && z - pRadius < b.z + halfD
      ) {
        return true; 
      }
    }

    // 2. Pohon & Air Mancur
    if (GameConfig.trees) {
      for (const t of GameConfig.trees) {
        const treeRadius = 0.6 * t.scale; 
        if (Math.hypot(x - t.x, z - t.z) < pRadius + treeRadius) return true;
      }
    }
    if (GameConfig.fountain) {
      const f = GameConfig.fountain;
      if (Math.hypot(x - f.x, z - f.z) < pRadius + 4.0) return true;
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

    const supportY = this.getSupportHeight(this.position.x, this.position.y, this.position.z);

    // Fisika Vertikal (Lompat & Mendarat)
    if (!this.isGrounded) {
      this.velocityY -= this.gravity * dt;
      this.position.y += this.velocityY * dt;

      if (this.position.y <= supportY) {
        this.position.y = supportY;
        this.velocityY = 0;
        this.isGrounded = true; 
      }
    } else {
      // Jika berjalan di tangga (naik)
      if (supportY > this.position.y) {
        this.position.y = THREE.MathUtils.lerp(this.position.y, supportY, 15 * dt);
      } else if (supportY < this.position.y - 0.1) {
        // Jatuh dari ketinggian
        this.isGrounded = false;
      } else {
        this.position.y = supportY;
      }
    }

    this.mesh.position.copy(this.position);
  }
}
