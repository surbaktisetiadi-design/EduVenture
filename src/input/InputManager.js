export class InputManager {
  #keys = new Set();
  #joystick = { x: 0, z: 0 };
  #isJumpPressed = false;

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.#keys.add(e.code);
      if (e.code === 'Space') this.#isJumpPressed = true;
    });
    window.addEventListener('keyup', (e) => {
      this.#keys.delete(e.code);
      if (e.code === 'Space') this.#isJumpPressed = false;
    });
    window.addEventListener('blur', () => this.#keys.clear());

    this.#initJoystick();
    this.#initJumpButton();
  }

  getMovementVector() {
    let x = this.#joystick.x;
    let z = this.#joystick.z;

    if (this.#keys.has('KeyW') || this.#keys.has('ArrowUp'))    z -= 1;
    if (this.#keys.has('KeyS') || this.#keys.has('ArrowDown'))  z += 1;
    if (this.#keys.has('KeyA') || this.#keys.has('ArrowLeft'))  x -= 1;
    if (this.#keys.has('KeyD') || this.#keys.has('ArrowRight')) x += 1;

    if (x === 0 && z === 0) return null;

    const len = Math.hypot(x, z);
    return { x: x / len, z: z / len };
  }

  // Fungsi untuk mengecek apakah tombol lompat ditekan
  isJumping() {
    return this.#isJumpPressed;
  }

  #initJoystick() {
    const base = document.getElementById('joystick-base');
    const stick = document.getElementById('joystick-stick');
    if (!base || !stick) return;

    let isDragging = false;
    const maxRadius = 40;

    const handleStart = (e) => { isDragging = true; e.preventDefault(); };
    const handleMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches ? e.touches[0] : e;
      const rect = base.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = touch.clientX - centerX;
      let deltaY = touch.clientY - centerY;

      const distance = Math.hypot(deltaX, deltaY);
      if (distance > maxRadius) {
        deltaX = (deltaX / distance) * maxRadius;
        deltaY = (deltaY / distance) * maxRadius;
      }

      stick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      this.#joystick.x = deltaX / maxRadius;
      this.#joystick.z = deltaY / maxRadius; 
    };

    const handleEnd = () => {
      isDragging = false;
      stick.style.transform = `translate(0px, 0px)`;
      this.#joystick.x = 0;
      this.#joystick.z = 0;
    };

    base.addEventListener('touchstart', handleStart, { passive: false });
    base.addEventListener('touchmove', handleMove, { passive: false });
    base.addEventListener('touchend', handleEnd);
    base.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
  }

  // Inisialisasi tombol lompat di layar HP
  #initJumpButton() {
    const btn = document.getElementById('jump-button');
    if (!btn) return;

    const handleDown = (e) => {
      e.preventDefault();
      this.#isJumpPressed = true;
    };
    const handleUp = (e) => {
      e.preventDefault();
      this.#isJumpPressed = false;
    };

    btn.addEventListener('touchstart', handleDown, { passive: false });
    btn.addEventListener('touchend', handleUp);
    btn.addEventListener('mousedown', handleDown);
    btn.addEventListener('mouseup', handleUp);
  }
}
