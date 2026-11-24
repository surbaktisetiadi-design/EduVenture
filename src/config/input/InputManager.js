export class InputManager {
  #keys = new Set();

  constructor() {
    window.addEventListener('keydown', (e) => this.#keys.add(e.code));
    window.addEventListener('keyup',   (e) => this.#keys.delete(e.code));
    window.addEventListener('blur',    () => this.#keys.clear());
  }

  // Kembalikan vektor arah {x, z} ternormalisasi, atau null jika tidak ada input
  getMovementVector() {
    let x = 0;
    let z = 0;
    if (this.#keys.has('KeyW') || this.#keys.has('ArrowUp'))    z -= 1;
    if (this.#keys.has('KeyS') || this.#keys.has('ArrowDown'))  z += 1;
    if (this.#keys.has('KeyA') || this.#keys.has('ArrowLeft'))  x -= 1;
    if (this.#keys.has('KeyD') || this.#keys.has('ArrowRight')) x += 1;

    if (x === 0 && z === 0) return null;

    const len = Math.hypot(x, z);
    return { x: x / len, z: z / len };
  }
}