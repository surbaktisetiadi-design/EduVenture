export const GameConfig = {
  player: {
    radius: 0.5,
    height: 1.8,
    speed: 8,          // Kecepatan jalan
    sprintSpeed: 14,   // Kecepatan lari (Shift)
    crouchSpeed: 4,    // Kecepatan jongkok (C)
    color: 0x2196f3,
    spawnX: 0,   
    spawnZ: 30,  
  },
  camera: {
    distance: 8,       // Jarak kamera dari pemain
    shoulderOffset: 1.5, // Geser kamera ke kanan (Over-the-shoulder)
    heightOffset: 2.5, // Ketinggian kamera dari tanah
    lookAtHeight: 1.5, // Titik fokus kamera (dada pemain)
    lerpSpeed: 15,     // Seberapa cepat kamera menyusul
    minPitch: -0.8,    // Batas lihat ke bawah (radian)
    maxPitch: 1.0      // Batas lihat ke atas (radian)
  },
  world: {
    boundary: 95,
  },
  // ... (biarkan data buildings, trees, flowers, fountain seperti sebelumnya)
  buildings: [
    { name: "Gedung Matematika", x: 0, z: -10, width: 16, depth: 16, height: 8, color: 0xf4f1de, roofColor: 0xe07a5f }
  ],
  trees: [ { x: -15, z: -5, scale: 1.2 }, { x: 15, z: 5, scale: 1.1 } ],
  flowers: [ { x: -5, z: 15, color: 0xe63946 }, { x: 5, z: 15, color: 0xffd166 } ],
  fountain: { x: 0, z: 10 }
};
