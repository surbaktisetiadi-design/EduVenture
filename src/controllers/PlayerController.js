export class PlayerController {
  constructor(localPlayer, inputManager) {
    this.player = localPlayer;
    this.input = inputManager;
  }

  update(dt) {
    const dir = this.input.getMovementVector();
    if (!dir) return;
    this.player.moveBy(dir.x, dir.z, dt);
  }
}
