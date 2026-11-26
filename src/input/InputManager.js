export class InputManager {
  #keys = new Set();
  #moveJoystick = { x: 0, z: 0 };
  #cameraRotation = { yaw: 0, pitch: 0 };
  
  #isJumpPressed = false;
  #isSprintPressed = false;
  #isCrouchPressed = false; // Ini akan jadi Toggle

  constructor() {
    this.#initKeyboard();
    this.#initTouchControls();
    this.#initMouseControls();
  }

  getMovementVector() { return this.#moveJoystick; }
  getCameraRotation() { return this.#cameraRotation; }
  isJumping() { return this.#isJumpPressed; }
  isSprinting() { return this.#isSprintPressed; }
  isCrouching() { return this.#isCrouchPressed; }

  #initKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.#keys.add(e.code);
      if (e.code === 'Space') this.#isJumpPressed = true;
      if (e.code === 'ShiftLeft') this.#isSprintPressed = true;
      if (e.code === 'KeyC') this.#isCrouchPressed = !this.#isCrouchPressed; // Toggle
    });
    window.addEventListener('keyup', (e) => {
      this.#keys.delete(e.code);
      if (e.code === 'Space') this.#isJumpPressed = false;
      if (e.code === 'ShiftLeft') this.#isSprintPressed = false;
    });
  }

  #initMouseControls() {
    const canvas = document.getElementById('game-canvas');
    canvas.addEventListener('click', () => {
      if (document.pointerLockElement !== canvas && !('ontouchstart' in window)) {
        canvas.requestPointerLock();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === canvas) {
        this.#cameraRotation.yaw -= e.movementX * 0.002;
        this.#cameraRotation.pitch -= e.movementY * 0.002;
        this.#clampPitch();
      }
    });
  }

  #initTouchControls() {
    const joyBase = document.getElementById('joystick-base');
    const joyStick = document.getElementById('joystick-stick');
    const rightArea = document.getElementById('camera-area');
    const jumpBtn = document.getElementById('jump-button');
    const sprintBtn = document.getElementById('sprint-button');
    const crouchBtn = document.getElementById('crouch-button');

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouch) {
      [joyBase, rightArea, jumpBtn, sprintBtn, crouchBtn].forEach(el => { if(el) el.style.display = 'none'; });
      return;
    }

    // --- JOYSTICK KIRI ---
    let joyId = null;
    const maxR = 50;
    joyBase.addEventListener('touchstart', (e) => { e.preventDefault(); joyId = e.changedTouches[0].identifier; }, { passive: false });
    joyBase.addEventListener('touchmove', (e) => {
      if (joyId === null) return;
      for (let t of e.changedTouches) {
        if (t.identifier === joyId) {
          const rect = joyBase.getBoundingClientRect();
          let dx = t.clientX - (rect.left + rect.width/2);
          let dy = t.clientY - (rect.top + rect.height/2);
          const dist = Math.hypot(dx, dy);
          if (dist > maxR) { dx = (dx/dist)*maxR; dy = (dy/dist)*maxR; }
          joyStick.style.transform = `translate(${dx}px, ${dy}px)`;
          this.#moveJoystick.x = dx / maxR;
          this.#moveJoystick.z = dy / maxR;
        }
      }
    }, { passive: false });
    const joyEnd = (e) => {
      for (let t of e.changedTouches) {
        if (t.identifier === joyId) { joyId = null; joyStick.style.transform = `translate(0,0)`; this.#moveJoystick = {x:0,z:0}; }
      }
    };
    joyBase.addEventListener('touchend', joyEnd);
    joyBase.addEventListener('touchcancel', joyEnd);

    // --- KAMERA AREA KANAN ---
    let camId = null, lastX = 0, lastY = 0;
    rightArea.addEventListener('touchstart', (e) => { camId = e.changedTouches[0].identifier; lastX = e.changedTouches[0].clientX; lastY = e.changedTouches[0].clientY; }, { passive: false });
    rightArea.addEventListener('touchmove', (e) => {
      if (camId === null) return;
      for (let t of e.changedTouches) {
        if (t.identifier === camId) {
          this.#cameraRotation.yaw -= (t.clientX - lastX) * 0.005;
          this.#cameraRotation.pitch -= (t.clientY - lastY) * 0.005;
          this.#clampPitch();
          lastX = t.clientX; lastY = t.clientY;
        }
      }
    }, { passive: false });
    const camEnd = (e) => { for (let t of e.changedTouches) { if (t.identifier === camId) camId = null; } };
    rightArea.addEventListener('touchend', camEnd);
    rightArea.addEventListener('touchcancel', camEnd);

    // --- TOMBOL AKSI ---
    jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.#isJumpPressed = true; }, { passive: false });
    jumpBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.#isJumpPressed = false; });
    
    sprintBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.#isSprintPressed = true; }, { passive: false });
    sprintBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.#isSprintPressed = false; });

    crouchBtn.addEventListener('touchstart', (e) => { 
      e.preventDefault(); 
      this.#isCrouchPressed = !this.#isCrouchPressed; // Toggle
      crouchBtn.style.background = this.#isCrouchPressed ? 'rgba(255,100,100,0.8)' : 'rgba(33,150,243,0.6)';
    }, { passive: false });
  }

  #clampPitch() {
    this.#cameraRotation.pitch = Math.max(-0.1, Math.min(1.0, this.#cameraRotation.pitch));
  }
}
