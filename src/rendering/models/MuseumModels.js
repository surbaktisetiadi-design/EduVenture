import * as THREE from 'three';

export class MuseumModel extends THREE.Group {
  constructor() {
    super();
    this.#buildMuseum();
  }

  #addBox(parent, w, h, d, mat, x, y, z, castShadow = true, receiveShadow = true) {
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    parent.add(mesh);
    return mesh;
  }

  #buildMuseum() {
    // --- MATERIAL ---
    const matMarble = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.2, metalness: 0.1 });
    const matWall = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.8 });
    const matRoof = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.6 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, roughness: 0.1 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
    const matStatue = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
    const matCarpet = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.9 });

    const W = 24; // Lebar
    const D = 30; // Kedalaman
    const H = 12; // Tinggi

    // --- LANTAI MARMER ---
    this.#addBox(this, W, 0.5, D, matMarble, 0, 0.25, 0, false, true);

    // --- KARPET MERAH TENGAH ---
    this.#addBox(this, 6, 0.55, 20, matCarpet, 0, 0.27, 0, false, true);

    // --- DINDING LUAR (Dengan celah di depan untuk Pintu Masuk) ---
    // Dinding Belakang
    this.#addBox(this, W, H, 0.5, matWall, 0, H / 2, -D / 2);
    // Dinding Kiri
    this.#addBox(this, 0.5, H, D, matWall, -W / 2, H / 2, 0);
    // Dinding Kanan
    this.#addBox(this, 0.5, H, D, matWall, W / 2, H / 2, 0);
    
    // Dinding Depan (Kiri & Kanan Pintu)
    this.#addBox(this, 9, H, 0.5, matWall, -7.5, H / 2, D / 2); // Kiri
    this.#addBox(this, 9, H, 0.5, matWall, 7.5, H / 2, D / 2);  // Kanan
    // Atas Pintu
    this.#addBox(this, 6, 4, 0.5, matWall, 0, H - 2, D / 2); 

    // --- PILAR DEPAN (Gaya Klasik) ---
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue; // Biarkan tengah kosong untuk pintu
      this.#addBox(this, 1.5, H, 1.5, matMarble, i * 5, H / 2, D / 2 + 2);
    }
    // Atap Pilar Depan
    this.#addBox(this, W + 2, 1, 4, matRoof, 0, H + 0.5, D / 2 + 1);

    // --- ATAP UTAMA ---
    this.#addBox(this, W + 1, 1, D + 1, matRoof, 0, H + 0.5, 0);
    this.#addBox(this, W - 2, 2, D - 2, matWall, 0, H + 1.5, 0); // Atap tingkat 2

    // --- PINTU KACA OTOMATIS (Visual) ---
    this.#addBox(this, 5.8, 7, 0.2, matGlass, 0, 3.5, D / 2);

    // --- ETALASE PAMERAN (Interior) ---
    // Vitrin Kiri & Kanan
    for (let i = -1; i <= 1; i++) {
      // Kiri
      this.#addBox(this, 2, 3, 2, matGlass, -8, 1.5, i * 8);
      this.#addBox(this, 1, 1, 1, matGold, -8, 1.5, i * 8); // Benda Emas di dalam
      // Kanan
      this.#addBox(this, 2, 3, 2, matGlass, 8, 1.5, i * 8);
      this.#addBox(this, 1, 1, 1, matGold, 8, 1.5, i * 8);
    }

    // --- PATUNG TENGAH ---
    this.#addBox(this, 3, 1, 3, matMarble, 0, 0.5, -8); // Alas Patung
    const statueGeo = new THREE.CylinderGeometry(0.5, 0.8, 4, 8);
    const statue = new THREE.Mesh(statueGeo, matStatue);
    statue.position.set(0, 3, -8);
    statue.castShadow = true;
    this.add(statue);
  }
}
