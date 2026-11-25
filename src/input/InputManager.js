export class InputManager {
  #keys = new Set();
  #joystick = { x: 0, z: 0 }; // Menyimpan arah dari joystick HP

  constructor() {
    window.addEventListener('keydown', (e) => this.#keys.add(e.code));
    window.addEventListener('keyup',   (e) => this.#keys.delete(e.code));
    window.addEventListener('blur',    () => this.#keys.clear());

    this.#initJoystick();
  }

  // Menggabungkan input keyboard dan joystick
  getMovementVector() {
    let x = this.#joystick.x;
    let z = this.#joystick.z;

    if (this.#keys.has('KeyW') || this.#keys.has('ArrowUp'))    z -= 1;
    if (this.#keys.has('KeyS') || this.#keys.has('ArrowDown'))  z += 1;
    if (this.#keys.has('KeyA') || this.#keys.has('ArrowLeft'))  x -= 1;
    if (this.#keys.has('KeyD') || this.#keys.has('ArrowRight')) x += 1;

    if (x === 0 && z === 0) return null;

    // Normalisasi agar kecepatan diagonal tidak lebih cepat
    const len = Math.hypot(x, z);
    return { x: x / len, z: z / len };
  }

  // --- Logika Virtual Joystick ---
  #initJoystick() {
    const base = document.getElementById('joystick-base');
    const stick = document.getElementById('joystick-stick');
    if (!base || !stick) return;

    let isDragging = false;
    const maxRadius = 40; // Batas gerak stik

    const handleStart = (e) => {
      isDragging = true;
      e.preventDefault(); // Cegah layar scroll saat disentuh
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      
      const touch = e.touches ? e.touches[0] : e;
      const rect = base.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = touch.clientX - centerX;
      let deltaY = touch.clientY - centerY;

      // Batasi jarak tarikan stik
      const distance = Math.hypot(deltaX, deltaY);
      if (distance > maxRadius) {
        deltaX = (deltaX / distance) * maxRadius;
        deltaY = (deltaY / distance) * maxRadius;
      }

      // Pindahkan visual stik
      stick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      // Konversi ke arah gerak (X dan Z) 
      // Dibagi maxRadius agar nilainya antara -1 sampai 1
      this.#joystick.x = deltaX / maxRadius;
      this.#joystick.z = deltaY / maxRadius; 
    };

    const handleEnd = () => {
      isDragging = false;
      stick.style.transform = `translate(0px, 0px)`; // Reset posisi visual
      this.#joystick.x = 0;
      this.#joystick.z = 0;
    };

    // Dukungan Touch (HP) dan Mouse (PC)
    base.addEventListener('touchstart', handleStart, { passive: false });
    base.addEventListener('touchmove', handleMove, { passive: false });
    base.addEventListener('touchend', handleEnd);

    base.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
  }
}
