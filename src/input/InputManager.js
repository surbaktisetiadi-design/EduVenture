export class InputManager {
  #keys = new Set();
  #joystick = { x: 0, z: 0 };
  #isJumpPressed = false;
  
  // Variabel untuk rotasi kamera
  #cameraRotation = { x: 0, y: 0 };
  #isRotating = false;
  #lastPointer = { x: 0, y: 0 };

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

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
      document.getElementById('joystick-base').style.display = 'none';
      document.getElementById('jump-button').style.display = 'none';
    }

    this.#initJoystick();
    this.#initJumpButton();
    this.#initCameraRotation();
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

  isJumping() {
    return this.#isJumpPressed;
  }

  // Fungsi baru untuk mengambil nilai rotasi kamera
  getCameraRotation() {
    return this.#cameraRotation;
  }

  #initJoystick() {
    // ... (SAMA SEPERTI SEBELUMNYA, TIDAK PERLU DIUBAH) ...
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

  #initJumpButton() {
    // ... (SAMA SEPERTI SEBELUMNYA, TIDAK PERLU DIUBAH) ...
    const btn = document.getElementById('jump-button');
    if (!btn) return;
    const handleDown = (e) => { e.preventDefault(); this.#isJumpPressed = true; };
    const handleUp = (e) => { e.preventDefault(); this.#isJumpPressed = false; };
    btn.addEventListener('touchstart', handleDown, { passive: false });
    btn.addEventListener('touchend', handleUp);
    btn.addEventListener('mousedown', handleDown);
    btn.addEventListener('mouseup', handleUp);
  }

  // 👇 FUNGSI BARU UNTUK PUTAR KAMERA 👇
  #initCameraRotation() {
    const canvas = document.getElementById('game-canvas');

    const onStart = (e) => {
      // Jangan putar kamera jika yang disentuh adalah joystick atau tombol lompat
      if (e.target.id === 'joystick-base' || e.target.id === 'joystick-stick' || e.target.id === 'jump-button') return;
      
      this.#isRotating = true;
      const touch = e.touches ? e.touches[0] : e;
      this.#lastPointer.x = touch.clientX;
      this.#lastPointer.y = touch.clientY;
    };

    const onMove = (e) => {
      if (!this.#isRotating) return;
      const touch = e.touches ? e.touches[0] : e;
      
      const deltaX = touch.clientX - this.#lastPointer.x;
      const deltaY = touch.clientY - this.#lastPointer.y;

      // Sensitivitas putaran
      this.#cameraRotation.x -= deltaX * 0.01;
      
      // Batasi putaran ke atas/bawah agar kamera tidak jungkir balik
      this.#cameraRotation.y -= deltaY * 0.01;
      // Batasi sudut pandang (Y) antara 0.2 (agak mendongak) dan 1.0 (melihat ke bawah)
this.#cameraRotation.y = Math.max(0.2, Math.min(1.0, this.#cameraRotation.y));

      this.#lastPointer.x = touch.clientX;
      this.#lastPointer.y = touch.clientY;
    };

    const onEnd = () => { this.#isRotating = false; };

    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);

    canvas.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
  }
}
