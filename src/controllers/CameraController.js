import { MathUtils } from '../utils/MathUtils.js';

export class CameraController {
  constructor(camera, target, inputManager) {
    this.camera = camera;
    this.target = target;
    
    // Sudut pandang tetap (Isometric)
    this.offsetX = 0;     // Kamera tepat di belakang karakter
    this.offsetZ = 18;    // Jarak ke belakang
    this.offsetY = 22;    // Ketinggian kamera (melihat ke bawah)
    
    this.lerpSpeed = 5;   // Kecepatan kamera mengikuti pemain
  }

  update(dt) {
    const targetPos = this.target.position;

    // Posisi yang diinginkan (selalu konstan di belakang pemain)
    const desiredX = targetPos.x + this.offsetX;
    const desiredY = targetPos.y + this.offsetY;
    const desiredZ = targetPos.z + this.offsetZ;

    // Smooth damp agar kamera bergerak halus mengikuti pemain
    this.camera.position.x = MathUtils.damp(this.camera.position.x, desiredX, this.lerpSpeed, dt);
    this.camera.position.y = MathUtils.damp(this.camera.position.y, desiredY, this.lerpSpeed, dt);
    this.camera.position.z = MathUtils.damp(this.camera.position.z, desiredZ, this.lerpSpeed, dt);

    // Selalu melihat ke arah pemain
    this.camera.lookAt(targetPos.x, targetPos.y + 1, targetPos.z);
  }
}
