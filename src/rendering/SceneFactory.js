import * as THREE from 'three';

export class SceneFactory {
  createWorldScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0d8f0); // langit biru cerah
    scene.fog = new THREE.Fog(0xa0d8f0, 60, 140);

    // --- Cahaya ambient (menerangi seluruh scene) ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    // --- Cahaya matahari (menghasilkan bayangan) ---
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

    // --- Ground: lapangan hijau 200×200 ---
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7bc67e,
      roughness: 0.95,
      metalness: 0.0,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // --- Grid halus untuk orientasi visual ---
    const grid = new THREE.GridHelper(200, 100, 0x5a9e5e, 0x5a9e5e);
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    grid.position.y = 0.01;
    scene.add(grid);

    return scene;
  }
}