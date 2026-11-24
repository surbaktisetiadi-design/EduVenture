import * as THREE from 'three';
import { Player } from './Player.js';
import { GameConfig } from '../config/gameConfig.js';

export class LocalPlayer extends Player {
  constructor(id) {
    super(id);
    this.velocity = new THREE.Vector3();
  }

  // Gerakkan pemain dengan pembatasan batas dunia
  moveBy(dx, dz, dt) {
    const speed = GameConfig.player.speed;
    const boundary = GameConfig.world.boundary;

    let newX = this.position.x + dx * speed * dt;
    let newZ = this.position.z + dz * speed * dt;

    newX = Math.max(-boundary, Math.min(boundary, newX));
    newZ = Math.max(-boundary, Math.min(boundary, newZ));

    this.setPosition(newX, newZ);
  }
}