export const GameConfig = {
  player: {
    radius: 0.5,
    height: 1.8,
    speed: 8,          // unit/detik
    color: 0x2196f3,
  },
  camera: {
    offsetY: 18,
    offsetZ: 14,
    lookAtHeight: 1.5,
    lerpSpeed: 8,      // makin besar, makin cepat kamera mengikuti
  },
  world: {
    boundary: 95,      // batas gerak pemain (di dalam ground 200×200)
  },
};