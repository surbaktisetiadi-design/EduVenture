import * as THREE from 'three';
import { GameConfig } from '../config/gameConfig.js';
import { HouseModel } from './models/HouseModel.js';

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
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 150;
    scene.add(sun);

    // 1. Ground / Rumput
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x7bc67e, roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 2. Bangun Dunia
    this.#buildPaths(scene);
    this.#buildBuildings(scene);
    this.#buildTrees(scene);
    this.#buildFlowers(scene);
    this.#buildFountain(scene);

    return scene;
  }

  #buildPaths(scene) {
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xe0d0b0, roughness: 0.9 });
    
    const pathV = new THREE.Mesh(new THREE.PlaneGeometry(6, 100), pathMat);
    pathV.rotation.x = -Math.PI / 2;
    pathV.position.set(0, 0.02, 0);
    pathV.receiveShadow = true;
    scene.add(pathV);

    const pathH = new THREE.Mesh(new THREE.PlaneGeometry(100, 6), pathMat);
    pathH.rotation.x = -Math.PI / 2;
    pathH.position.set(0, 0.02, 0);
    pathH.receiveShadow = true;
    scene.add(pathH);

    const circleGeo = new THREE.CircleGeometry(8, 32);
    const pathC = new THREE.Mesh(circleGeo, pathMat);
    pathC.rotation.x = -Math.PI / 2;
    pathC.position.set(0, 0.025, 0);
    pathC.receiveShadow = true;
    scene.add(pathC);
  }

  #buildBuildings(scene) {
    GameConfig.buildings.forEach((b) => {
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(b.x, 0, b.z);

      if (b.type === "house") {
        // 👇 RAKIT RUMAH BARU 👇
        const house = new HouseModel();
        
        // Putar rumah agar menghadap ke jalan (sesuaikan sudutnya)
        house.rotation.y = Math.PI; 
        
        // Posisi Y sedikit diturunkan agar fondasi menyentuh tanah
        house.position.y = -0.22; 
        
        buildingGroup.add(house);
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

  #buildTrees(scene) {
    GameConfig.trees.forEach((t) => {
      const treeGroup = new THREE.Group();
      
      const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const leavesGeo = new THREE.IcosahedronGeometry(1.5, 0);
      const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, flatShading: true });
      const leaves = new THREE.Mesh(leavesGeo, leavesMat);
      leaves.position.y = 2.8;
      leaves.castShadow = true;
      treeGroup.add(leaves);

      treeGroup.position.set(t.x, 0, t.z);
      treeGroup.scale.set(t.scale, t.scale, t.scale);
      scene.add(treeGroup);
    });
  }

  #buildFlowers(scene) {
    GameConfig.flowers.forEach((f) => {
      const flowerGroup = new THREE.Group();
      
      const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 4);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.25;
      flowerGroup.add(stem);

      const petalGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const petalMat = new THREE.MeshStandardMaterial({ color: f.color });
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.y = 0.5;
      petal.castShadow = true;
      flowerGroup.add(petal);

      flowerGroup.position.set(f.x, 0, f.z);
      scene.add(flowerGroup);
    });
  }

  #buildFountain(scene) {
    const f = GameConfig.fountain;
    const fountainGroup = new THREE.Group();

    const poolGeo = new THREE.CylinderGeometry(4, 4, 0.6, 16);
    const poolMat = new THREE.MeshStandardMaterial({ color: 0x4ea8de, roughness: 0.1, metalness: 0.2 });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.y = 0.3;
    pool.receiveShadow = true;
    fountainGroup.add(pool);

    const pillarGeo = new THREE.CylinderGeometry(0.6, 0.9, 2.5, 8);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 1.55;
    pillar.castShadow = true;
    fountainGroup.add(pillar);

    const waterGeo = new THREE.SphereGeometry(0.8, 8, 8);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = 3.2;
    fountainGroup.add(water);

    fountainGroup.position.set(f.x, 0, f.z);
    scene.add(fountainGroup);
  }
}
