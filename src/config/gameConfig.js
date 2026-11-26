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
  
  // DATA GEDUNG (Rumah, Museum, dll)
  buildings: [
    { 
      name: "Gedung Matematika", 
      type: "house", 
      x: 0, z: -40, 
      width: 13.6, depth: 11.8, height: 10 
    },
    { 
      name: "Gedung Sains",      
      type: "box", x: 40, z: 0,  width: 16, depth: 18, height: 9,  color: 0xe0f4f1, roofColor: 0x3d5a80 
    },
    { 
      name: "Museum EduVenture",     
      type: "museum", 
      x: -40, z: 0, 
      width: 24, depth: 30, height: 12 
    },
    { 
      name: "Gedung Sejarah",    
      type: "box", x: 0, z: 40,  width: 20, depth: 16, height: 8,  color: 0xfff3e0, roofColor: 0x8d6e63 
    }
  ],
  
  // DATA POHON
  trees: [
    { x: -15, z: -15, scale: 1.2 }, { x: 15, z: -15, scale: 1.1 },
    { x: -15, z: 15, scale: 1.3 },  { x: 15, z: 15, scale: 1.0 },
    { x: -25, z: -30, scale: 1.5 }, { x: 25, z: -30, scale: 1.4 },
    { x: -25, z: 30, scale: 1.2 },  { x: 25, z: 30, scale: 1.3 }
  ],
  
  // DATA BUNGA
  flowers: [
    { x: -5, z: 5, color: 0xe63946 }, { x: 5, z: 5, color: 0xffd166 },
    { x: -5, z: -5, color: 0xf4a3b5 }, { x: 5, z: -5, color: 0x9b5de5 },
    { x: 0, z: 8, color: 0xe63946 },  { x: 0, z: -8, color: 0xffd166 }
  ],

  // DATA AIR MANCUR
  fountain: { x: 0, z: 0 },
};
