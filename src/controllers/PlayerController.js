export class PlayerController {
  constructor(localPlayer, inputManager) {
    this.player = localPlayer;
    this.input = inputManager;
  }

  update(dt) {
    // 1. Ambil input joystick (X dan Z)
    const dir = this.input.getMovementVector();
    
    if (dir) {
      // 2. Gerakkan pemain secara mutlak (tanpa pengaruh kamera)
      this.player.moveBy(dir.x, dir.z, dt);

      // 3. Putar badan pemain menghadap ke arah gerakannya
      const angle = Math.atan2(dir.x, dir.z);
      this.player.mesh.rotation.y = angle;
    }

    // Lompat
    if (this.input.isJumping()) {
      this.player.jump();
    }
  }
}
