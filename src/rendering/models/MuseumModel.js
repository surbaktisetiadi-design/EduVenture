import * as THREE from 'three';

export class MuseumModel extends THREE.Group {
  constructor() {
    super();
    this.interactiveDoors = [];
    this.walkableFloors = [];
    this.#buildMuseum();
  }

  #addBox(parent, w, h, d, mat, x, y, z, opts = {}) {
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    if (opts.rx || opts.ry || opts.rz) mesh.rotation.set(opts.rx || 0, opts.ry || 0, opts.rz || 0);
    mesh.castShadow = opts.castShadow !== false;
    mesh.receiveShadow = opts.receiveShadow !== false;
    parent.add(mesh);

    if (opts.walkable) {
      this.walkableFloors.push({
        minX: x - w / 2, maxX: x + w / 2,
        minZ: z - d / 2, maxZ: z + d / 2,
        topY: y + h / 2
      });
    }
    return mesh;
  }

  #createHingedDoor(parent, w, h, x, y, z, rotY = 0) {
    const grp = new THREE.Group();
    grp.position.set(x, y, z);
    grp.rotation.y = rotY;
    parent.add(grp);

    const matGlass = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, roughness: 0.1 });
    const matFrame = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const pivot = new THREE.Group();
    pivot.position.set(-w / 2, 0, 0);
    grp.add(pivot);

    this.#addBox(pivot, w, h, 0.05, matGlass, w / 2, h / 2, 0, { castShadow: false });
    this.#addBox(pivot, w, 0.08, 0.08, matFrame, w / 2, 0.04, 0);
    this.#addBox(pivot, w, 0.08, 0.08, matFrame, w / 2, h - 0.04, 0);
    this.#addBox(pivot, 0.08, h, 0.08, matFrame, 0.04, h / 2, 0);
    this.#addBox(pivot, 0.08, h, 0.08, matFrame, w - 0.04, h / 2, 0);

    this.interactiveDoors.push({
      pivot: pivot,
      isOpen: false,
      currentAngle: 0,
      targetAngle: 0,
      openAngle: Math.PI * 0.55,
      worldPos: new THREE.Vector3(x, y + h / 2, z)
    });
  }

  #buildMuseum() {
    const matMarble = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.2 });
    const matWall = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.8 });
    const matRoof = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.6 });
    const matCarpet = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.9 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3 });

    const W = 24; 
    const D = 30; 
    const H = 12; 

    // LANTAI 1
    this.#addBox(this, W, 0.5, D, matMarble, 0, 0.25, 0, { walkable: true });
    this.#addBox(this, 6, 0.52, 20, matCarpet, 0, 0.26, 0, { walkable: true });

    // DINDING LUAR
    this.#addBox(this, W, H, 0.5, matWall, 0, H / 2, -D / 2); 
    this.#addBox(this, 0.5, H, D, matWall, -W / 2, H / 2, 0); 
    this.#addBox(this, 0.5, H, D, matWall, W / 2, H / 2, 0);  
    
    // Dinding Depan dengan Pintu (Pintu ada di X positif)
    this.#addBox(this, 9, H, 0.5, matWall, -7.5, H / 2, D / 2); 
    this.#addBox(this, 9, H, 0.5, matWall, 7.5, H / 2, D / 2);  
    this.#addBox(this, 6, 4, 0.5, matWall, 0, H - 2, D / 2); 

    // PINTU MASUK OTOMATIS
    this.#createHingedDoor(this, 6, 7, 0, 0, D / 2, 0);

    // PILAR & ATAP
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      this.#addBox(this, 1.5, H, 1.5, matMarble, i * 5, H / 2, D / 2 + 2);
    }
    this.#addBox(this, W + 2, 1, 4, matRoof, 0, H + 0.5, D / 2 + 1);
    this.#addBox(this, W + 1, 1, D + 1, matRoof, 0, H + 0.5, 0);

    // TANGGA KE LANTAI 2 (Pojok Kanan Dalam)
    const numSteps = 15;
    const stepH = 0.3;
    const stepD = 0.4;
    const startZ = -5;
    
    for (let i = 0; i < numSteps; i++) {
      const sy = 0.5 + (i + 1) * stepH;
      const sz = startZ - i * stepD;
      this.#addBox(this, 4, 0.1, stepD + 0.1, matMarble, 8, sy - 0.05, sz, { walkable: true });
    }

    // LANTAI 2 (Balkon Pameran)
    this.#addBox(this, W - 8, 0.5, D - 10, matMarble, -4, 5.0, -5, { walkable: true }); 

    // ETALASE PAMERAN
    for (let i = -1; i <= 1; i++) {
      this.#addBox(this, 2, 3, 2, matGlass, -8, 2, i * 8);
      this.#addBox(this, 1, 1, 1, matGold, -8, 2, i * 8);
      this.#addBox(this, 2, 3, 2, matGlass, 8, 2, i * 8);
      this.#addBox(this, 1, 1, 1, matGold, 8, 2, i * 8);
    }

    // PATUNG TENGAH
    this.#addBox(this, 3, 1, 3, matMarble, 0, 0.5, -8);
    const statueGeo = new THREE.CylinderGeometry(0.5, 0.8, 4, 8);
    const statueMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const statue = new THREE.Mesh(statueGeo, statueMat);
    statue.position.set(0, 3, -8);
    statue.castShadow = true;
    this.add(statue);
  }

  update(dt) {
    this.interactiveDoors.forEach(d => {
      d.currentAngle += (d.targetAngle - d.currentAngle) * Math.min(1, dt * 10);
      d.pivot.rotation.y = d.currentAngle;
    });
  }
}
