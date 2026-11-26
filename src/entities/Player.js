import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class Player {
  constructor(id, color = GameConfig.player.color) {
    this.id = id;
    this.color = color;
    this.position = new THREE.Vector3(0, 0, 0);
    
    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);

    // 👇 Variabel untuk Animasi
    this.walkTime = 0;       // Waktu berjalan
    this.isMoving = false;   // Status apakah sedang bergerak
    this.blinkTimer = 0;     // Timer untuk kedipan
    this.nextBlink = Math.random() * 3 + 2; // Waktu acak sebelum kedip (2-5 detik)
    
    // Referensi ke bagian tubuh
    this.leftLeg = null;
    this.rightLeg = null;
    this.leftArm = null;
    this.rightArm = null;
    this.eyes = []; // Array untuk menyimpan objek mata

    this.#buildTeacherMesh();
  }

  #buildTeacherMesh() {
    const matSkin = new THREE.MeshStandardMaterial({ color: 0xffcda8, roughness: 0.6 });
    const matHair = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const matShirt = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const matPants = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const matShoes = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
    const matTie = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const matBelt = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
    const matSilver = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.6, roughness: 0.3 });
    const matEye = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const makeBox = (w, h, d, material, x, y, z) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // ==========================================
    // BAGIAN STATIS (Badan, Kepala, Pinggang)
    // ==========================================
    this.mesh.add(makeBox(0.9, 1.1, 0.45, matShirt, 0, 1.35, 0)); // Badan
    this.mesh.add(makeBox(0.92, 0.15, 0.48, matBelt, 0, 0.85, 0)); // Ikat pinggang
    this.mesh.add(makeBox(0.2, 0.12, 0.02, matSilver, 0, 0.85, 0.24)); // Gesper
    this.mesh.add(makeBox(0.12, 0.7, 0.02, matTie, 0, 1.45, 0.23)); // Dasi
    this.mesh.add(makeBox(0.3, 0.1, 0.02, matShirt, 0, 1.85, 0.23)); // Kerah
    this.mesh.add(makeBox(0.25, 0.08, 0.02, matTie, -0.2, 1.6, 0.23)); // Name tag
    this.mesh.add(makeBox(0.1, 0.1, 0.02, matGold, 0.25, 1.65, 0.23)); // Lencana
    this.mesh.add(makeBox(0.15, 0.15, 0.02, matShirt, 0.25, 1.4, 0.23)); // Kantung

    // Kepala
    this.mesh.add(makeBox(0.75, 0.75, 0.7, matSkin, 0, 2.2, 0));
    this.mesh.add(makeBox(0.78, 0.2, 0.72, matHair, 0, 2.55, 0)); // Rambut atas
    this.mesh.add(makeBox(0.78, 0.4, 0.15, matHair, 0, 2.3, -0.3)); // Rambut belakang
    this.mesh.add(makeBox(0.25, 0.05, 0.02, matHair, 0, 2.05, 0.35)); // Kumis
    this.mesh.add(makeBox(0.1, 0.1, 0.1, matSkin, 0, 2.15, 0.35)); // Hidung

    // Mata (Disimpan di array agar bisa dikedipkan)
    const eyeL = makeBox(0.1, 0.15, 0.02, matEye, -0.18, 2.25, 0.35);
    const eyeR = makeBox(0.1, 0.15, 0.02, matEye, 0.18, 2.25, 0.35);
    this.mesh.add(eyeL);
    this.mesh.add(eyeR);
    this.eyes.push(eyeL, eyeR);

    // ==========================================
    // BAGIAN ANIMASI (Kaki & Tangan)
    // ==========================================
    
    // KAKI KIRI (Pivot di pinggang)
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.2, 0.85, 0); // Titik putar di pinggang
    this.leftLeg.add(makeBox(0.35, 0.8, 0.4, matPants, 0, -0.4, 0)); // Kaki
    this.leftLeg.add(makeBox(0.38, 0.2, 0.5, matShoes, 0, -0.75, 0.05)); // Sepatu
    this.mesh.add(this.leftLeg);

    // KAKI KANAN
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.2, 0.85, 0);
    this.rightLeg.add(makeBox(0.35, 0.8, 0.4, matPants, 0, -0.4, 0));
    this.rightLeg.add(makeBox(0.38, 0.2, 0.5, matShoes, 0, -0.75, 0.05));
    this.mesh.add(this.rightLeg);

    // TANGAN KIRI (Pivot di bahu)
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.6, 1.8, 0);
    this.leftArm.add(makeBox(0.35, 0.4, 0.4, matShirt, 0, -0.15, 0)); // Lengan baju
    this.leftArm.add(makeBox(0.3, 0.5, 0.35, matSkin, 0, -0.55, 0)); // Kulit tangan
    this.mesh.add(this.leftArm);

    // TANGAN KANAN
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.6, 1.8, 0);
    this.rightArm.add(makeBox(0.35, 0.4, 0.4, matShirt, 0, -0.15, 0));
    this.rightArm.add(makeBox(0.3, 0.5, 0.35, matSkin, 0, -0.55, 0));
    this.mesh.add(this.rightArm);
  }

  setPosition(x, z) {
    this.position.set(x, 0, z);
    this.mesh.position.copy(this.position);
  }

  // Dipanggil dari PlayerController
  setMoving(isMoving) {
    this.isMoving = isMoving;
  }

  update(dt) {
    // --- 1. Animasi Berjalan ---
    if (this.isMoving) {
      this.walkTime += dt * 10; // Kecepatan ayunan kaki
      
      // Ayunkan kaki dan tangan (Sin dan Cos untuk gerakan bergantian)
      const swing = Math.sin(this.walkTime) * 0.5; 
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing;
      this.rightArm.rotation.x = swing;
    } else {
      // Kembalikan ke posisi diam secara halus
      this.walkTime = 0;
      const returnSpeed = 10 * dt;
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, returnSpeed);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, returnSpeed);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, returnSpeed);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, returnSpeed);
    }

    // --- 2. Animasi Kedipan Mata ---
    this.blinkTimer += dt;
    if (this.blinkTimer > this.nextBlink) {
      // Lakukan kedipan
      this.eyes.forEach(eye => eye.scale.y = 0.1);
      
      // Setelah 0.1 detik, buka mata kembali
      setTimeout(() => {
        this.eyes.forEach(eye => eye.scale.y = 1);
      }, 100);

      // Reset timer
      this.blinkTimer = 0;
      this.nextBlink = Math.random() * 3 + 2; // Acak waktu kedip berikutnya
    }
  }

  dispose() {
    this.mesh.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }
}
