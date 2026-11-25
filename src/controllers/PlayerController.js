export class PlayerController {
  constructor(localPlayer, inputManager) {
    this.player = localPlayer;
    this.input = inputManager;
  }

  update(dt) {
    // Gerak
    const dir = this.input.getMovementVector();
    if (dir) {
      this.player.moveBy(dir.x, dir.z, dt);
    }

    // Lompat
    if (this.input.isJumping()) {
      this.player.jump();
    }
  }
}
