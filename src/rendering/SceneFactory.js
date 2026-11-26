import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';
import { HouseModel } from './models/HouseModel.js'; // 👈 Import Model Rumah

export class SceneFactory {
  // ... (createWorldScene, buildPaths, buildTrees, buildFlowers, buildFountain TETAP SAMA)

  // 👇 UBAH FUNGSI INI 👇
  #buildBuildings(scene) {
    GameConfig.buildings.forEach((b) => {
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(b.x, 0, b.z);

      if (b.type === "house") {
        // Gunakan desain rumah dari model baru
        const house = new HouseModel();
        
        // Putar sedikit agar menghadap ke jalan (menyesuaikan sumbu Z)
        house.rotation.y = Math.PI; 
        
        // Naikkan sedikit agar fondasi pas dengan tanah
        house.position.y = -0.22; 
        
        buildingGroup.add(house);

        // Opsional: Tambahkan kotak tak terlihat (hitbox) untuk visual debug
        // const hitboxGeo = new THREE.BoxGeometry(b.width, b.height, b.depth);
        // const hitboxMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        // const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
        // hitbox.position.y = b.height / 2;
        // buildingGroup.add(hitbox);
        
      } else {
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
}
