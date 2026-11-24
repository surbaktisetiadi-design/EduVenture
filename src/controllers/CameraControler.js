import { GameConfig } from '../config/gameConfig.js';
import { MathUtils } from '../utils/MathUtils.js';

export class CameraController {
  constructor(camera, target) {
    this.camera = camera;
    this.target = target;   // pemain yang diikuti
  }

  update(dt) {
    const cfg = GameConfig.camera;
    const targetPos = this.target.position;

    const desiredX = targetPos.x;
    const desiredY = targetPos.y + cfg.offsetY;
    const desiredZ = targetPos.z + cfg.offsetZ;

    // Smooth damp ke posisi target
    const lambda = cfg.lerpSpeed;
    this.camera.position.x = MathUtils.damp(this.camera.position.x, desiredX, lambda, dt);
    this.camera.position.y = MathUtils.damp(this.camera.position.y, desiredY, lambda, dt);
    this.camera.position.z = MathUtils.damp(this.camera.position.z, desiredZ, lambda, dt);

    this.camera.lookAt(targetPos.x, targetPos.y + cfg.lookAtHeight, targetPos.z);
  }
}