export class InputManager {
  // State Keyboard
  #keys = new Set();
  
  // State Joystick Kiri (Gerak)
  #moveJoystick = { x: 0, z: 0 };
  
  // State Kamera (Rotasi)
  #cameraRotation = { yaw: 0, pitch: 0 };
  
  // State Aksi
  #isJumpPressed = false;
  #isSprintPressed = false;
  #isCrouchPressed = false;

  constructor() {
    this.#initKeyboard();
    this.#initTouchControls();
    this.#initMouseControls();
  }

  // --- GETTERS ---
  getMovementVector() { return this.#moveJoystick; }
  getCameraRotation() { return this.#cameraRotation; }
  isJumping() { return this.#isJumpPressed; }
  isSprinting() { return this.#isSprintPressed; }
  isCrouching() { return this.#isCrouchPressed; }

  // --- KEYBOARD (PC) ---
  #initKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.#keys.add(e.code);
      if (e.code === 'Space') this.#isJumpPressed = true;
      if (e.code === 'ShiftLeft') this.#isSprintPressed = true;
      if (e.code === 'KeyC') this.#isCrouchPressed = true;
    });
    window.addEventListener('keyup', (e) => {
      this.#keys.delete(e.code);
      if (e.code === 'Space') this.#isJumpPressed = false;
      if (e.code === 'ShiftLeft') this.#isSprintPressed = false;
      if (e.code === 'KeyC') this.#isCrouchPressed = false;
    });
    window.addEventListener('blur', () => {
      this.#keys.clear();
      this.#isJumpPressed = false;
      this.#isSprintPressed = false;
      this.#isCrouchPressed = false;
    });
  }

  // --- MOUSE (PC) ---
  #initMouseControls() {
    const canvas = document.getElementById('game-canvas');
    
    // Klik untuk masuk Pointer Lock
    canvas.addEventListener('click', () => {
      if (document.pointerLockElement !== canvas && !('ontouchstart' in window)) {
        canvas.requestPointerLock();
      }
    });

    // Gerakan Mouse saat Pointer Lock aktif
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === canvas) {
        const sens = 0.002;
        this.#cameraRotation.yaw -= e.movementX * sens;
        this.#cameraRotation.pitch -= e.movementY * sens;
        this.#clampPitch();
      }
    });
  }

  // --- TOUCH (MOBILE) ---
  #initTouchControls() {
    const joyBase = document.getElementById('joystick-base');
    const joyStick = document.getElementById('joystick-stick');
    const rightArea = document.getElementById('camera-area');
    const jumpBtn = document.getElementById('jump-button');
    const sprintBtn = document.getElementById('sprint-button');
    const crouchBtn = document.getElementById('crouch-button');

    // Deteksi perangkat sentuh
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouch) {
      if(joyBase) joyBase.style.display = 'none';
      if(rightArea) rightArea.style.display = 'none';
      if(jumpBtn) jumpBtn.style.display = 'none';
      if(sprintBtn) sprintBtn.style.display = 'none';
      if(crouchBtn) crouchBtn.style.display = 'none';
      return;
    }

    // 1. JOYSTICK KIRI
    let joyPointerId = null;
    const maxRadius = 50;

    const joyStart = (e) => {
      e.preventDefault();
      const touch = e.changedTouches ? e.changedTouches[0] : e;
      joyPointerId = touch.identifier !== undefined ? touch.identifier : 'mouse';
    };

    const joyMove = (e) => {
      if (joyPointerId === null) return;
      let touch = this.#getTouchById(e, joyPointerId);
      if (!touch) return;

      const rect = joyBase.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = touch.clientX - centerX;
      let deltaY = touch.clientY - centerY;

      const dist = Math.hypot(deltaX, deltaY);
      if (dist > maxRadius) {
        deltaX = (deltaX / dist) * maxRadius;
        deltaY = (deltaY / dist) * maxRadius;
      }

      joyStick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      // Normalisasi (-1 sampai 1)
      this.#moveJoystick.x = deltaX / maxRadius;
      this.#moveJoystick.z = deltaY / maxRadius;
    };

    const joyEnd = (e) => {
      if (this.#isTouchEnded(e, joyPointerId)) {
        joyPointerId = null;
        joyStick.style.transform = `translate(0px, 0px)`;
        this.#moveJoystick.x = 0;
        this.#moveJoystick.z = 0;
      }
    };

    joyBase.addEventListener('touchstart', joyStart, { passive: false });
    joyBase.addEventListener('touchmove', joyMove, { passive: false });
    joyBase.addEventListener('touchend', joyEnd);
    joyBase.addEventListener('touchcancel', joyEnd);

    // 2. AREA KAMERA (KANAN LAYAR)
    let camPointerId = null;
    let lastCamX = 0;
    let lastCamY = 0;
    const camSens = 0.005;

    const camStart = (e) => {
      const touch = e.changedTouches ? e.changedTouches[0] : e;
      camPointerId = touch.identifier !== undefined ? touch.identifier : 'mouse';
      lastCamX = touch.clientX;
      lastCamY = touch.clientY;
    };

    const camMove = (e) => {
      if (camPointerId === null) return;
      let touch = this.#getTouchById(e, camPointerId);
      if (!touch) return;

      const deltaX = touch.clientX - lastCamX;
      const deltaY = touch.clientY - lastCamY;

      this.#cameraRotation.yaw -= deltaX * camSens;
      this.#cameraRotation.pitch -= deltaY * camSens;
      this.#clampPitch();

      lastCamX = touch.clientX;
      lastCamY = touch.clientY;
    };

    const camEnd = (e) => {
      if (this.#isTouchEnded(e, camPointerId)) camPointerId = null;
    };

    rightArea.addEventListener('touchstart', camStart, { passive: false });
    rightArea.addEventListener('touchmove', camMove, { passive: false });
    rightArea.addEventListener('touchend', camEnd);
    rightArea.addEventListener('touchcancel', camEnd);

    // 3. TOMBOL AKSI
    const bindButton = (btn, onPress, onRelease) => {
      if (!btn) return;
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); onPress(); }, { passive: false });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); onRelease(); });
      btn.addEventListener('touchcancel', onRelease);
    };

    bindButton(jumpBtn, () => this.#isJumpPressed = true, () => this.#isJumpPressed = false);
    bindButton(sprintBtn, () => this.#isSprintPressed = true, () => this.#isSprintPressed = false);
    bindButton(crouchBtn, () => this.#isCrouchPressed = !this.#isCrouchPressed, () => {}); // Toggle
  }

  // --- HELPER ---
  #clampPitch() {
    const min = -0.8;
    const max = 1.0;
    this.#cameraRotation.pitch = Math.max(min, Math.min(max, this.#cameraRotation.pitch));
  }

  #getTouchById(e, id) {
    if (!e.changedTouches) return e;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === id) return e.changedTouches[i];
    }
    return null;
  }

  #isTouchEnded(e, id) {
    if (!e.changedTouches) return true;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === id) return true;
    }
    return false;
  }
}
