export class PlayerController {
  constructor(localPlayer, inputManager) {
    this.player = localPlayer;
    this.input = inputManager;
  }

  update(dt) {
    const dir = this.input.getMovementVector();
    
    // 🎮 Logika Pergerakan Joystick (Mutlak/Seperti Minecraft)
    if (dir) {
      // dir.x adalah -1 (kiri) sampai 1 (kanan)
      // dir.z adalah -1 (depan/atas layar) sampai 1 (belakang/bawah layar)
      
      // Gerakkan berdasarkan arah absolut
      this.player.moveBy(dir.x, dir.z, dt);

      // Putar badan pemain menghadap ke arah dia berjalan
      // Kita gunakan Math.atan2 untuk mendapatkan sudut (dalam radian)
      const targetAngle = Math.atan2(dir.x, dir.z);
      
      // Rotasi mesh pemain (hanya Y)
      // (Opsional: tambahkan efek halus rotasi jika mau, tapi untuk kotak langsung saja)
      this.player.mesh.rotation.y = targetAngle;
    }

    // Lompat
    if (this.input.isJumping()) {
      this.player.jump();
    }
  }
}
