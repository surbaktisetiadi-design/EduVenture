export const GameConfig = {
  player: {
    radius: 0.5,
    height: 1.8,
    speed: 8,          
    color: 0x2196f3,
  },
  camera: {
    offsetY: 18,
    offsetZ: 14,
    lookAtHeight: 1.5,
    lerpSpeed: 8,      
  },
  world: {
    boundary: 95,      
  },
  // 👇 TAMBAHAN DATA GEDUNG 👇
  buildings: [
    {
      name: "Gedung Matematika",
      x: 0, z: -20,      // Posisi tengah gedung
      width: 16,         // Lebar (sumbu X)
      depth: 16,         // Panjang (sumbu Z)
      height: 8,         // Tinggi
      color: 0xf4f1de,   // Warna dinding
      roofColor: 0xe07a5f // Warna atap
    }
  ]
};
