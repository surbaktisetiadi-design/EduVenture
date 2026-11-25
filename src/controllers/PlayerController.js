import * as THREE from 'three';

export class PlayerController {
  constructor(localPlayer, inputManager) {
    this.player = localPlayer;
    this.input = inputManager;
  }

  update(dt) {
    // 1. Ambil input joystick (-1 sampai 1)
    const dir = this.input.getMovementVector();
    
    if (dir) {
      // 2. Ambil sudut rotasi kamera saat ini
      const cameraRotY = this.input.getCameraRotation().x;

      // 3. Hitung vektor arah berdasarkan sudut kamera
      // Rumus ini memutar joystick agar sejajar dengan layar
      const forwardX = -Math.sin(cameraRotY);
      const forwardZ = -Math.cos(cameraRotY);
      
      const rightX = Math.cos(cameraRotY);
      const rightZ = -Math.sin(cameraRotY);

      // Gabungkan input X (kiri/kanan) dan Z (depan/belakang) dengan arah kamera
      const moveX = (rightX * dir.x) + (forwardX * -dir.z);
      const moveZ = (rightZ * dir.x) + (forwardZ * -dir.z);

      // 4. Gerakkan pemain
      this.player.moveBy(moveX, moveZ, dt);

      // 5. Putar badan pemain menghadap ke arah gerakannya
      const angle = Math.atan2(moveX, moveZ);
      this.player.mesh.rotation.y = angle;
    }

    // Lompat
    if (this.input.isJumping()) {
      this.player.jump();
    }
  }
}
