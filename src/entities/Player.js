  update(dt) {
    // Deteksi apakah karakter bergerak di sumbu X dan Z
    const hasVelocity = (Math.abs(this.position.x - (this.lastX || 0)) > 0.001) || 
                        (Math.abs(this.position.z - (this.lastZ || 0)) > 0.001);
                         
    this.lastX = this.position.x;
    this.lastZ = this.position.z;

    // 👇 KARAKTER HANYA BERJALAN JIKA MENYENTUH TANAH DAN BERGERAK 👇
    const isMoving = hasVelocity && this.isGrounded;

    if (isMoving) {
      const animSpeed = this.isCrouching ? 6 : (this.isRunning ? 16 : 10); 
      const animWidth = this.isCrouching ? 0.2 : (this.isRunning ? 0.8 : 0.5);

      this.walkTime += dt * animSpeed; 
      const swing = Math.sin(this.walkTime) * animWidth;
      
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing;
      this.rightArm.rotation.x = swing;
    } else {
      // Jika di udara atau diam, hentikan ayunan kaki
      this.walkTime = 0;
      const returnSpeed = 10 * dt;
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, returnSpeed);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, returnSpeed);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, returnSpeed);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, returnSpeed);
    }

    // Efek Jongkok
    const targetScale = this.isCrouching ? 0.6 : 1.0;
    this.mesh.scale.y = THREE.MathUtils.lerp(this.mesh.scale.y, targetScale, 15 * dt);

    // Kedipan Mata
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
