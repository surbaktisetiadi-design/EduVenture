export class InputManager {
  #keys = new Set();
  #joystick = { x: 0, z: 0 };
  #isJumpPressed = false;
  
  // Kita sisakan getCameraRotation agar tidak error, tapi nilainya selalu 0
  #cameraRotation = { x: 0, y: 0 };

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
      const joy = document.getElementById('joystick-base');
      const jump = document.getElementById('jump-button');
      if (joy) joy.style.display = 'none';
      if (jump) jump.style.display = 'none';
    }

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

  isJumping() {
    return this.#isJumpPressed;
  }

  getCameraRotation() {
    return this.#cameraRotation; // Selalu 0, kamera dikunci
  }

  #initJoystick() {
    const base = document.getElementById('joystick-base');
    const stick = document.getElementById('joystick-stick');
    if (!base || !stick) return;

    let joystickPointerId = null;
    const maxRadius = 40;

    const handleStart = (e) => {
      e.preventDefault();
      const touch = e.changedTouches ? e.changedTouches[0] : e;
      joystickPointerId = touch.identifier !== undefined ? touch.identifier : 'mouse';
    };

    const handleMove = (e) => {
      if (joystickPointerId === null) return;
      
      let touch = e;
      if (e.changedTouches) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === joystickPointerId) {
            touch = e.changedTouches[i];
            break;
          }
        }
      }
      if (!touch) return;

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

    const handleEnd = (e) => {
      if (e.changedTouches) {
        let isOurTouch = false;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === joystickPointerId) {
            isOurTouch = true;
            break;
          }
        }
        if (!isOurTouch) return;
      }

      joystickPointerId = null;
      stick.style.transform = `translate(0px, 0px)`;
      this.#joystick.x = 0;
      this.#joystick.z = 0;
    };

    base.addEventListener('touchstart', handleStart, { passive: false });
    base.addEventListener('touchmove', handleMove, { passive: false });
    base.addEventListener('touchend', handleEnd);
    base.addEventListener('touchcancel', handleEnd);

    base.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', (e) => {
        if(joystickPointerId === 'mouse') handleMove(e);
    });
    window.addEventListener('mouseup', (e) => {
        if(joystickPointerId === 'mouse') handleEnd(e);
    });
  }

  #initJumpButton() {
    const btn = document.getElementById('jump-button');
    if (!btn) return;
    const handleDown = (e) => { e.preventDefault(); this.#isJumpPressed = true; };
    const handleUp = (e) => { e.preventDefault(); this.#isJumpPressed = false; };
    btn.addEventListener('touchstart', handleDown, { passive: false });
    btn.addEventListener('touchend', handleUp);
    btn.addEventListener('mousedown', handleDown);
    btn.addEventListener('mouseup', handleUp);
  }
}
