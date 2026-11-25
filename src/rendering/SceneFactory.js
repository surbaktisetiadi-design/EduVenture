import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js'; // Import config

export class SceneFactory {
  createWorldScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0d8f0);
    scene.fog = new THREE.Fog(0xa0d8f0, 60, 140);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.1);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -50;
    sun.shadow.camera.right = 50;
    sun.shadow.camera.top = 50;
    sun.shadow.camera.bottom = -50;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 150;
    scene.add(sun);

    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x7bc67e, roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(200, 100, 0x5a9e5e, 0x5a9e5e);
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    grid.position.y = 0.01;
    scene.add(grid);

    // 👇 BUAT GEDUNG DARI CONFIG 👇
    GameConfig.buildings.forEach((b) => {
      const buildingGroup = new THREE.Group();
      
      // Badan Gedung
      const bodyGeo = new THREE.BoxGeometry(b.width, b.height, b.depth);
      const bodyMat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.8 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = b.height / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      buildingGroup.add(body);

      // Atap Gedung (Piramida)
      const roofGeo = new THREE.ConeGeometry(b.width * 0.8, b.height * 0.4, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.7 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = b.height + (b.height * 0.2);
      roof.rotation.y = Math.PI / 4; // Putar agar sejajar dengan kotak
      roof.castShadow = true;
      buildingGroup.add(roof);

      buildingGroup.position.set(b.x, 0, b.z);
      scene.add(buildingGroup);
    });

    return scene;
  }
}
