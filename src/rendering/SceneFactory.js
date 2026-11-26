import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';
import { HouseModel } from './models/HouseModel.js';
import { MuseumModel } from './models/MuseumModel.js'; // 👈 Import Museum

export class SceneFactory {
  // ... (createWorldScene, buildPaths, trees, flowers, fountain TETAP SAMA)

  #buildBuildings(scene) {
    GameConfig.buildings.forEach((b) => {
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(b.x, 0, b.z);

      if (b.type === "house") {
        const house = new HouseModel();
        house.rotation.y = Math.PI; 
        house.position.y = -0.05; 
        buildingGroup.add(house);
      } 
      // 👇 TAMBAHKAN LOGIKA UNTUK MUSEUM 👇
      else if (b.type === "museum") {
        const museum = new MuseumModel();
        // Putar museum agar menghadap ke jalan (ke arah timur/kanan)
        museum.rotation.y = Math.PI / 2; 
        museum.position.y = -0.25; 
        buildingGroup.add(museum);
      } 
      else {
        // Desain kotak lama untuk gedung lain
        const bodyGeo = new THREE.BoxGeometry(b.width, b.height, b.depth);
        const bodyMat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.8 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = b.height / 2;
        body.castShadow = true; body.receiveShadow = true;
        buildingGroup.add(body);

        const roofGeo = new THREE.ConeGeometry(b.width * 0.8, b.height * 0.4, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.7 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = b.height + (b.height * 0.2);
        roof.rotation.y = Math.PI / 4; 
        roof.castShadow = true;
        buildingGroup.add(roof);
      }

      scene.add(buildingGroup);
    });
  }
  // ...
}
