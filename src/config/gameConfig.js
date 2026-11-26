export const GameConfig = {
  player: {
    radius: 0.5,
    height: 1.8,
    speed: 8,          
    sprintSpeed: 14,   
    crouchSpeed: 4,    
    color: 0x2196f3,
    spawnX: 0,   
    spawnZ: 30,  
  },
  camera: {
    distance: 8,       
    shoulderOffset: 1.5, 
    heightOffset: 2.5, 
    lookAtHeight: 2.0, 
    lerpSpeed: 15,     
    minPitch: -0.8,    
    maxPitch: 1.0      
  },
  world: {
    boundary: 95,
  },
  // 👇 TAMBAHKAN DATA GEDUNG BARU 👇
  buildings: [
    { name: "Gedung Matematika", x: 0, z: -40, width: 18, depth: 16, height: 10, color: 0xf4f1de, roofColor: 0xe07a5f },
    { name: "Gedung Sains",      x: 40, z: 0,  width: 16, depth: 18, height: 9,  color: 0xe0f4f1, roofColor: 0x3d5a80 },
    { name: "Gedung Bahasa",     x: -40, z: 0, width: 16, depth: 18, height: 9,  color: 0xfce4ec, roofColor: 0xc2185b },
    { name: "Gedung Sejarah",    x: 0, z: 40,  width: 20, depth: 16, height: 8,  color: 0xfff3e0, roofColor: 0x8d6e63 }
  ],
  
  // Data Pohon (diletakkan di pinggir jalan)
  trees: [
    { x: -15, z: -15, scale: 1.2 }, { x: 15, z: -15, scale: 1.1 },
    { x: -15, z: 15, scale: 1.3 },  { x: 15, z: 15, scale: 1.0 },
    { x: -25, z: -30, scale: 1.5 }, { x: 25, z: -30, scale: 1.4 },
    { x: -25, z: 30, scale: 1.2 },  { x: 25, z: 30, scale: 1.3 }
  ],
  
  // Data Bunga (Mengelilingi Air Mancur)
  flowers: [
    { x: -5, z: 5, color: 0xe63946 }, { x: 5, z: 5, color: 0xffd166 },
    { x: -5, z: -5, color: 0xf4a3b5 }, { x: 5, z: -5, color: 0x9b5de5 },
    { x: 0, z: 8, color: 0xe63946 },  { x: 0, z: -8, color: 0xffd166 }
  ],

  fountain: { x: 0, z: 0 }, // Air mancur di tengah (0,0)
};
