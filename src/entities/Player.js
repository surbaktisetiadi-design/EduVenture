  update(dt) {
    // Deteksi pergerakan
    const isMoving = (Math.abs(this.position.x - (this.lastX || 0)) > 0.001) || 
                     (Math.abs(this.position.z - (this.lastZ || 0)) > 0.001);
                     
    this.lastX = this.position.x;
    this.lastZ = this.position.z;

    // --- 1. Animasi Berjalan ---
    if (isMoving) {
      // Jika jongkok, gerakan lebih lambat dan kecil
      const animSpeed = this.isCrouching ? 5 : 12; 
      const animWidth = this.isCrouching ? 0.2 : 0.6;

      this.walkTime += dt * animSpeed; 
      const swing = Math.sin(this.walkTime) * animWidth;
      
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing;
      this.rightArm.rotation.x = swing;
    } else {
      // Kembali diam
      this.walkTime = 0;
      const returnSpeed = 10 * dt;
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, returnSpeed);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, returnSpeed);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, returnSpeed);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, returnSpeed);
    }

    // --- 2. Animasi Kedipan Mata ---
    this.blinkTimer += dt;
    if (this.blinkTimer > this.nextBlink) {
      this.eyes.forEach(eye => eye.scale.y = 0.1);
      setTimeout(() => {
        this.eyes.forEach(eye => eye.scale.y = 1);
      }, 100);
      this.blinkTimer = 0;
      this.nextBlink = Math.random() * 3 + 2;
    }
  }
