import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';

export class Player {
  constructor(id, color = GameConfig.player.color) {
    this.id = id;
    this.color = color;
    this.position = new THREE.Vector3(0, 0, 0);
    this.mesh = this.#buildMesh();
  }

  #buildMesh() {
    const group = new THREE.Group();

    // Ukuran kotak (Minecraft style: kotak memanjang ke atas)
    const w = 0.8; // lebar
    const h = 1.2; // tinggi badan
    const d = 0.6; // tebal

    // Badan
    const bodyGeo = new THREE.BoxGeometry(w, h, d);
    const bodyMat = new THREE.MeshStandardMaterial({ color: this.color, roughness: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = h / 2;
    body.castShadow = true;
    group.add(body);

    // Kepala
    const headSize = 0.6;
    const headGeo = new THREE.BoxGeometry(headSize, headSize, headSize);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffe0bd, roughness: 0.8 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = h + (headSize / 2);
    head.castShadow = true;
    group.add(head);

    // Penanda Depan (Wajah/Mata) agar tahu arah hadap
    // Kita buat kotak tipis berwarna gelap di bagian depan
    const faceGeo = new THREE.BoxGeometry(0.5, 0.15, 0.05);
    const faceMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const face = new THREE.Mesh(faceGeo, faceMat);
    // Posisikan di depan kepala (sumbu Z positif)
    face.position.set(0, h + (headSize / 2), (headSize / 2) + 0.01); 
    group.add(face);

    return group;
  }

  setPosition(x, z) {
    this.position.set(x, 0, z);
    this.mesh.position.copy(this.position);
  }

  update(dt) {
    // Override di subclass jika perlu
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
