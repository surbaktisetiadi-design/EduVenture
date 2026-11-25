export const GameConfig = {
  player: {
    radius: 0.5,
    height: 1.8,
    speed: 8,
    color: 0x2196f3,
    spawnX: 0,   // 👈 Posisi awal pemain (X)
    spawnZ: 30,  // 👈 Posisi awal pemain (Z) - digeser jauh ke depan
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
  buildings: [
    {
      name: "Gedung Matematika",
      x: 0, z: -10,      // 👈 Geser gedung ke belakang (Z: -10)
      width: 16,
      depth: 16,
      height: 8,
      color: 0xf4f1de,
      roofColor: 0xe07a5f
    }
  ]
};
