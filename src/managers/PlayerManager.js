export class PlayerManager {
  #players = new Map();

  constructor(scene) {
    this.scene = scene;
  }

  addLocalPlayer(player) {
    this.#players.set(player.id, player);
    this.scene.add(player.mesh);
    return player;
  }

  get(id) {
    return this.#players.get(id);
  }

  update(dt) {
    this.#players.forEach((player) => player.update(dt));
  }
}