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

    // Badan: kapsul
    const bodyGeo = new THREE.CapsuleGeometry(
      GameConfig.player.radius,
      GameConfig.player.height - GameConfig.player.radius * 2,
      4,
      8
    );
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.6,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = GameConfig.player.height / 2;
    body.castShadow = true;
    group.add(body);

    // Kepala: bola
    const headGeo = new THREE.SphereGeometry(GameConfig.player.radius * 0.7, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffe0bd,
      roughness: 0.8,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = GameConfig.player.height + GameConfig.player.radius * 0.3;
    head.castShadow = true;
    group.add(head);

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