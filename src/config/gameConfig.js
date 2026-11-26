export const GameConfig = {
  // ... (player, camera, world biarkan sama) ...

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
    // 👇 GANTI GEDUNG BAHASA MENJADI MUSEUM 👇
    { 
      name: "Museum EduVenture",     
      type: "museum", 
      x: -40, z: 0, 
      width: 24, depth: 30, height: 12 // Ukuran persis museum
    },
    { 
      name: "Gedung Sejarah",    
      type: "box", x: 0, z: 40,  width: 20, depth: 16, height: 8,  color: 0xfff3e0, roofColor: 0x8d6e63 
    }
  ],
  // ... (trees, flowers, fountain biarkan sama) ...
};
