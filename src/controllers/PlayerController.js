export class PlayerController {
  constructor(localPlayer, inputManager) {
    this.player = localPlayer;
    this.input = inputManager;
  }

  update(dt) {
    // 1. Ambil input joystick (-1 sampai 1)
    const dir = this.input.getMovementVector();
    
    if (dir) {
      // 2. Ambil sudut rotasi kamera saat ini (kiri/kanan)
      const cameraRotY = this.input.getCameraRotation().x;

      // 3. Hitung vektor arah berdasarkan sudut kamera
      // Jika kamera diputar, arah "Atas" pada joystick ikut berputar
      const forwardX = -Math.sin(cameraRotY);
      const forwardZ = -Math.cos(cameraRotY);
      
      const rightX = Math.cos(cameraRotY);
      const rightZ = -Math.sin(cameraRotY);

      // 4. Gabungkan input joystick dengan arah kamera
      const moveX = (rightX * dir.x) + (forwardX * -dir.z);
      const moveZ = (rightZ * dir.x) + (forwardZ * -dir.z);

      // 5. Gerakkan pemain
      this.player.moveBy(moveX, moveZ, dt);

      // 6. Putar badan pemain (kotak) menghadap ke arah gerakannya
      const angle = Math.atan2(moveX, moveZ);
      this.player.mesh.rotation.y = angle;
    }

    // Lompat
    if (this.input.isJumping()) {
      this.player.jump();
    }
  }
}
