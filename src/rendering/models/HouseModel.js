import * as THREE from 'three';

export class HouseModel extends THREE.Group {
  constructor() {
    super();
    this.#buildTextures();
    this.#buildMaterials();
    this.#buildHouse();
  }

  // Menyimpan tekstur agar tidak dibuat ulang
  tex = {};

  #buildTextures() {
    // A. Tekstur Plester
    const plasterBumpCanvas = document.createElement('canvas');
    plasterBumpCanvas.width = 256; plasterBumpCanvas.height = 256;
    const pbCtx = plasterBumpCanvas.getContext('2d');
    pbCtx.fillStyle = '#808080'; pbCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) {
      const v = 115 + Math.floor(Math.random() * 26);
      pbCtx.fillStyle = `rgb(${v},${v},${v})`;
      pbCtx.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
    }
    this.tex.plasterBump = new THREE.CanvasTexture(plasterBumpCanvas);
    this.tex.plasterBump.wrapS = this.tex.plasterBump.wrapT = THREE.RepeatWrapping;
    this.tex.plasterBump.repeat.set(4, 4);

    // B. Tekstur Genteng
    const roofCanvas = document.createElement('canvas');
    roofCanvas.width = 512; roofCanvas.height = 512;
    const rCtx = roofCanvas.getContext('2d');
    rCtx.fillStyle = '#252930'; rCtx.fillRect(0, 0, 512, 512);
    
    const roofBumpCanvas = document.createElement('canvas');
    roofBumpCanvas.width = 512; roofBumpCanvas.height = 512;
    const rbCtx = roofBumpCanvas.getContext('2d');
    rbCtx.fillStyle = '#808080'; rbCtx.fillRect(0, 0, 512, 512);

    const rows = 12, cols = 10;
    const tileW = 512 / cols, tileH = 512 / rows;
    for (let y = 0; y < rows; y++) {
      const offsetX = (y % 2 === 0) ? 0 : tileW * 0.5;
      for (let x = -1; x <= cols; x++) {
        const tx = x * tileW + offsetX, ty = y * tileH;
        const grad = rCtx.createLinearGradient(tx, ty, tx + tileW, ty);
        const base = 36 + Math.floor(Math.random() * 10);
        grad.addColorStop(0, `rgb(${base - 8}, ${base - 6}, ${base - 2})`);
        grad.addColorStop(0.45, `rgb(${base + 14}, ${base + 16}, ${base + 22})`);
        grad.addColorStop(1, `rgb(${base - 10}, ${base - 8}, ${base - 4})`);
        rCtx.fillStyle = grad;
        rCtx.fillRect(tx + 1, ty + 1, tileW - 2, tileH - 3);
        rCtx.fillStyle = '#111317';
        rCtx.fillRect(tx, ty + tileH - 4, tileW, 4);

        const bGrad = rbCtx.createLinearGradient(tx, ty, tx + tileW, ty);
        bGrad.addColorStop(0, '#303030'); bGrad.addColorStop(0.5, '#f0f0f0'); bGrad.addColorStop(1, '#252525');
        rbCtx.fillStyle = bGrad;
        rbCtx.fillRect(tx + 1, ty + 1, tileW - 2, tileH - 3);
      }
    }
    this.tex.roof = new THREE.CanvasTexture(roofCanvas);
    this.tex.roof.wrapS = this.tex.roof.wrapT = THREE.RepeatWrapping;
    this.tex.roof.repeat.set(5, 4);
    this.tex.roofBump = new THREE.CanvasTexture(roofBumpCanvas);
    this.tex.roofBump.wrapS = this.tex.roofBump.wrapT = THREE.RepeatWrapping;
    this.tex.roofBump.repeat.set(5, 4);

    // C. Tekstur Batu Alam
    const stoneCanvas = document.createElement('canvas');
    stoneCanvas.width = 512; stoneCanvas.height = 512;
    const sCtx = stoneCanvas.getContext('2d');
    sCtx.fillStyle = '#383c42'; sCtx.fillRect(0, 0, 512, 512);
    
    const stoneBumpCanvas = document.createElement('canvas');
    stoneBumpCanvas.width = 512; stoneBumpCanvas.height = 512;
    const sbCtx = stoneBumpCanvas.getContext('2d');
    sbCtx.fillStyle = '#202020'; sbCtx.fillRect(0, 0, 512, 512);

    let curY = 0;
    while (curY < 512) {
      const h = 16 + Math.floor(Math.random() * 18);
      let curX = 0;
      while (curX < 512) {
        const w = 55 + Math.floor(Math.random() * 85);
        const g = 54 + Math.floor(Math.random() * 38);
        sCtx.fillStyle = `rgb(${g}, ${g + 2}, ${g + 5})`;
        sCtx.fillRect(curX + 2, curY + 2, w - 4, h - 4);
        for (let p = 0; p < 25; p++) {
          sCtx.fillStyle = 'rgba(15,18,22,0.28)';
          sCtx.fillRect(curX + 3 + Math.random() * (w - 6), curY + 3 + Math.random() * (h - 6), 2, 2);
        }
        const bVal = 110 + Math.floor(Math.random() * 130);
        sbCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
        sbCtx.fillRect(curX + 2, curY + 2, w - 4, h - 4);
        curX += w;
      }
      curY += h;
    }
    this.tex.stone = new THREE.CanvasTexture(stoneCanvas);
    this.tex.stone.wrapS = this.tex.stone.wrapT = THREE.RepeatWrapping;
    this.tex.stone.repeat.set(2, 3);
    this.tex.stoneBump = new THREE.CanvasTexture(stoneBumpCanvas);
    this.tex.stoneBump.wrapS = this.tex.stoneBump.wrapT = THREE.RepeatWrapping;
    this.tex.stoneBump.repeat.set(2, 3);

    // D. Tekstur Kayu
    const woodCanvas = document.createElement('canvas');
    woodCanvas.width = 256; woodCanvas.height = 256;
    const wCtx = woodCanvas.getContext('2d');
    wCtx.fillStyle = '#8f5b2d'; wCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 240; i++) {
      const x = Math.random() * 256;
      const w = 1 + Math.random() * 2.5;
      wCtx.fillStyle = Math.random() > 0.5 ? 'rgba(55, 30, 12, 0.25)' : 'rgba(185, 125, 68, 0.22)';
      wCtx.fillRect(x, 0, w, 256);
    }
    this.tex.wood = new THREE.CanvasTexture(woodCanvas);
    this.tex.wood.wrapS = this.tex.wood.wrapT = THREE.RepeatWrapping;

    // E. Tekstur Keramik
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = 256; tileCanvas.height = 256;
    const tCtx = tileCanvas.getContext('2d');
    tCtx.fillStyle = '#ece8e0'; tCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 40; i++) {
      tCtx.fillStyle = 'rgba(205, 198, 186, 0.16)';
      tCtx.beginPath(); tCtx.arc(Math.random() * 256, Math.random() * 256, 15 + Math.random() * 35, 0, Math.PI * 2); tCtx.fill();
    }
    tCtx.strokeStyle = '#c8c1b4'; tCtx.lineWidth = 2;
    tCtx.strokeRect(0, 0, 128, 128); tCtx.strokeRect(128, 0, 128, 128);
    tCtx.strokeRect(0, 128, 128, 128); tCtx.strokeRect(128, 128, 128, 128);
    this.tex.floorTile = new THREE.CanvasTexture(tileCanvas);
    this.tex.floorTile.wrapS = this.tex.floorTile.wrapT = THREE.RepeatWrapping;
    this.tex.floorTile.repeat.set(6, 6);

    // F. Tekstur Paving
    const pavingCanvas = document.createElement('canvas');
    pavingCanvas.width = 256; pavingCanvas.height = 256;
    const pCtx = pavingCanvas.getContext('2d');
    pCtx.fillStyle = '#6b7078'; pCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2200; i++) {
      const v = 85 + Math.floor(Math.random() * 75);
      pCtx.fillStyle = `rgb(${v},${v},${v + 3})`;
      pCtx.beginPath(); pCtx.arc(Math.random() * 256, Math.random() * 256, 1.7, 0, Math.PI * 2); pCtx.fill();
    }
    pCtx.strokeStyle = '#3c4047'; pCtx.lineWidth = 4;
    pCtx.strokeRect(4, 4, 248, 248);
    this.tex.paving = new THREE.CanvasTexture(pavingCanvas);
    this.tex.paving.wrapS = this.tex.paving.wrapT = THREE.RepeatWrapping;
    this.tex.paving.repeat.set(3, 5);
  }

  mats = {};
  #buildMaterials() {
    this.mats = {
      whiteWall: new THREE.MeshStandardMaterial({ color: 0xf8fafc, bumpMap: this.tex.plasterBump, bumpScale: 0.006, roughness: 0.62, metalness: 0.04, side: THREE.DoubleSide }),
      warmGrayWall: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, bumpMap: this.tex.plasterBump, bumpScale: 0.006, roughness: 0.68, metalness: 0.05, side: THREE.DoubleSide }),
      darkAccent: new THREE.MeshStandardMaterial({ color: 0x27303f, roughness: 0.5, metalness: 0.25, side: THREE.DoubleSide }),
      stone: new THREE.MeshStandardMaterial({ map: this.tex.stone, bumpMap: this.tex.stoneBump, bumpScale: 0.035, roughness: 0.85, metalness: 0.05, side: THREE.DoubleSide }),
      wood: new THREE.MeshStandardMaterial({ map: this.tex.wood, roughness: 0.52, metalness: 0.08, side: THREE.DoubleSide }),
      darkWood: new THREE.MeshStandardMaterial({ map: this.tex.wood, color: 0x7c4d2b, roughness: 0.48, metalness: 0.1, side: THREE.DoubleSide }),
      roof: new THREE.MeshStandardMaterial({ map: this.tex.roof, bumpMap: this.tex.roofBump, bumpScale: 0.04, roughness: 0.55, metalness: 0.18, side: THREE.DoubleSide }),
      glass: new THREE.MeshPhysicalMaterial({ color: 0xcbe8f8, transparent: true, opacity: 0.34, roughness: 0.07, metalness: 0.15, reflectivity: 0.95, side: THREE.DoubleSide, depthWrite: false }),
      blackMetal: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.8, side: THREE.DoubleSide }),
      chrome: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 }),
      floorTile: new THREE.MeshStandardMaterial({ map: this.tex.floorTile, roughness: 0.32, metalness: 0.06, side: THREE.DoubleSide }),
      parquet: new THREE.MeshStandardMaterial({ map: this.tex.wood, color: 0xd6a676, roughness: 0.44, metalness: 0.05, side: THREE.DoubleSide }),
      paving: new THREE.MeshStandardMaterial({ map: this.tex.paving, roughness: 0.8, metalness: 0.05 }),
      plinthBase: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, metalness: 0.05 }),
      sofaFabric: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 }),
      cushion: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 }),
      bedSheet: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 }),
      blanket: new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.85 }),
      porcelain: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.1 }),
      lampGlow: new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xffa726, emissiveIntensity: 1.5 })
    };
  }

  #addBox(parent, w, h, d, mat, x, y, z, rx = 0, ry = 0, rz = 0, castShadow = true, receiveShadow = true) {
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    if (rx || ry || rz) mesh.rotation.set(rx, ry, rz);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    parent.add(mesh);
    return mesh;
  }

  #createWindow(parent, w, h, x, y, z, rotY = 0) {
    const win = new THREE.Group();
    win.position.set(x, y, z);
    win.rotation.y = rotY;
    parent.add(win);

    const ft = 0.065; const fd = 0.14;
    this.#addBox(win, w, ft, fd, this.mats.blackMetal, 0, h / 2 - ft / 2, 0);
    this.#addBox(win, w, ft, fd, this.mats.blackMetal, 0, -h / 2 + ft / 2, 0);
    this.#addBox(win, ft, h, fd, this.mats.blackMetal, -w / 2 + ft / 2, 0, 0);
    this.#addBox(win, ft, h, fd, this.mats.blackMetal, w / 2 - ft / 2, 0, 0);

    if (w > 1.3) {
      const div = Math.floor(w / 1.05);
      for (let i = 1; i < div; i++) {
        const ox = -w / 2 + (w / div) * i;
        this.#addBox(win, 0.04, h - ft * 2, fd * 0.8, this.mats.blackMetal, ox, 0, 0);
      }
    }
    this.#addBox(win, w - ft * 1.5, h - ft * 1.5, 0.02, this.mats.glass, 0, 0, 0, 0, 0, 0, false, false);
  }

  #buildHouse() {
    const houseRoot = this; // Gunakan class ini sebagai root
    const a = this.#addBox.bind(this);
    const cw = this.#createWindow.bind(this);
    const m = this.mats;

    // --- A. ALAS TAPAK ---
    a(houseRoot, 13.6, 0.22, 11.8, m.plinthBase, 0.5, 0.11, 0.5, 0, 0, 0, false, true);
    a(houseRoot, 8.2, 0.42, 9.2, m.stone, -1.5, 0.41, 0);
    a(houseRoot, 4.4, 0.38, 1.6, m.floorTile, -1.5, 0.39, 5.2);
    a(houseRoot, 2.5, 0.13, 0.34, m.stone, -1.5, 0.265, 6.62);
    a(houseRoot, 2.5, 0.26, 0.34, m.stone, -1.5, 0.33, 6.30);
    a(houseRoot, 2.5, 0.38, 0.34, m.stone, -1.5, 0.39, 5.98);

    // --- B. DINDING LANTAI 1 ---
    const y1Base = 0.62; const h1 = 3.4; const y1Mid = y1Base + h1 / 2;
    a(houseRoot, 7.9, 0.05, 8.9, m.floorTile, -1.5, y1Base + 0.025, 0);
    
    a(houseRoot, 3.2, h1, 0.16, m.whiteWall, -3.9, y1Mid, -4.42);
    a(houseRoot, 2.6, h1, 0.16, m.whiteWall, 1.2, y1Mid, -4.42);
    a(houseRoot, 2.2, 0.9, 0.16, m.whiteWall, -1.2, y1Base + 0.45, -4.42);
    a(houseRoot, 2.2, 0.7, 0.16, m.whiteWall, -1.2, y1Base + h1 - 0.35, -4.42);
    cw(houseRoot, 2.2, 1.8, -1.2, y1Base + 1.8, -4.42);

    a(houseRoot, 0.16, h1, 4.0, m.whiteWall, -5.42, y1Mid, -2.5);
    a(houseRoot, 0.16, h1, 3.6, m.whiteWall, -5.42, y1Mid, 2.7);
    a(houseRoot, 0.16, 0.85, 1.4, m.whiteWall, -5.42, y1Base + 0.425, 0.2);
    a(houseRoot, 0.16, 0.55, 1.4, m.whiteWall, -5.42, y1Base + h1 - 0.275, 0.2);
    cw(houseRoot, 1.4, 2.0, -5.42, y1Base + 1.85, 0.2, Math.PI / 2);

    a(houseRoot, 0.16, h1, 3.6, m.whiteWall, 2.42, y1Mid, -2.7);
    a(houseRoot, 0.16, h1, 3.2, m.whiteWall, 2.42, y1Mid, 2.9);
    a(houseRoot, 0.16, 1.0, 2.2, m.whiteWall, 2.42, y1Base + 2.9, 0.2);
    a(houseRoot, 0.1, 2.2, 0.95, m.darkWood, 2.42, y1Base + 1.1, 0.2);
    a(houseRoot, 0.14, 0.25, 0.04, m.chrome, 2.42, y1Base + 1.05, -0.15);
    cw(houseRoot, 1.0, 1.4, 2.42, y1Base + 1.5, -0.8, Math.PI / 2);

    a(houseRoot, 0.65, h1 + 0.08, 0.65, m.stone, -3.7, y1Mid, 4.45);
    a(houseRoot, 0.65, h1 + 0.08, 0.65, m.stone, 0.7, y1Mid, 4.45);

    a(houseRoot, 1.6, 0.85, 0.16, m.whiteWall, -4.65, y1Base + 0.425, 4.42);
    a(houseRoot, 1.6, 0.55, 0.16, m.whiteWall, -4.65, y1Base + h1 - 0.275, 4.42);
    cw(houseRoot, 1.45, 2.0, -4.65, y1Base + 1.85, 4.42);

    a(houseRoot, 3.8, 0.75, 0.16, m.whiteWall, -1.5, y1Base + h1 - 0.375, 4.42);
    a(houseRoot, 0.6, h1 - 0.75, 0.16, m.whiteWall, -3.1, y1Base + (h1 - 0.75) / 2, 4.42);
    a(houseRoot, 0.6, h1 - 0.75, 0.16, m.whiteWall, 0.1, y1Base + (h1 - 0.75) / 2, 4.42);
    a(houseRoot, 1.38, 2.45, 0.18, m.blackMetal, -1.5, y1Base + 1.225, 4.42);
    a(houseRoot, 0.61, 2.35, 0.08, m.wood, -1.815, y1Base + 1.175, 4.43);
    a(houseRoot, 0.61, 2.35, 0.08, m.wood, -1.185, y1Base + 1.175, 4.43);
    a(houseRoot, 0.03, 0.75, 0.06, m.chrome, -1.57, y1Base + 1.15, 4.51);
    a(houseRoot, 0.03, 0.75, 0.06, m.chrome, -1.43, y1Base + 1.15, 4.51);
    cw(houseRoot, 0.62, 2.35, -2.5, y1Base + 1.22, 4.42);
    cw(houseRoot, 0.62, 2.35, -0.5, y1Base + 1.22, 4.42);
    a(houseRoot, 1.6, h1, 0.16, m.whiteWall, 1.7, y1Mid, 4.42);

    // --- C. BALKON & DINDING ATAS ---
    const y2Base = 4.02; const h2 = 3.2; const y2Mid = y2Base + h2 / 2;
    a(houseRoot, 8.15, 0.24, 9.45, m.whiteWall, -1.5, 3.94, 0.12);
    a(houseRoot, 7.8, 0.04, 7.6, m.parquet, -1.5, 4.08, -0.6);
    a(houseRoot, 7.9, 0.04, 1.6, m.floorTile, -1.5, 4.08, 4.0);
    
    const railY = 4.57; const railH = 0.94;
    a(houseRoot, 7.9, railH, 0.03, m.glass, -1.5, railY, 4.78, 0, 0, 0, false, false);
    a(houseRoot, 0.03, railH, 1.55, m.glass, -5.45, railY, 4.0, 0, 0, 0, false, false);
    a(houseRoot, 0.03, railH, 1.55, m.glass, 2.45, railY, 4.0, 0, 0, 0, false, false);
    a(houseRoot, 7.98, 0.055, 0.075, m.chrome, -1.5, railY + railH / 2 + 0.02, 4.78);
    a(houseRoot, 0.075, 0.055, 1.62, m.chrome, -5.45, railY + railH / 2 + 0.02, 4.0);
    a(houseRoot, 0.075, 0.055, 1.62, m.chrome, 2.45, railY + railH / 2 + 0.02, 4.0);
    for (let px = -5.4; px <= 2.4; px += 1.3) {
      a(houseRoot, 0.045, railH, 0.045, m.chrome, px, railY, 4.78);
    }

    a(houseRoot, 8.0, h2, 0.16, m.whiteWall, -1.5, y2Mid, -4.42);
    a(houseRoot, 0.16, h2, 7.8, m.whiteWall, -5.42, y2Mid, -0.6);
    a(houseRoot, 0.16, h2, 7.8, m.whiteWall, 2.42, y2Mid, -0.6);
    
    a(houseRoot, 3.3, 0.55, 0.16, m.whiteWall, -3.85, y2Base + 0.275, 3.2);
    a(houseRoot, 3.3, 0.45, 0.16, m.whiteWall, -3.85, y2Base + h2 - 0.225, 3.2);
    cw(houseRoot, 3.1, 2.2, -3.85, y2Base + 1.65, 3.2);
    a(houseRoot, 1.4, h2, 0.16, m.warmGrayWall, -1.5, y2Mid, 3.2);
    cw(houseRoot, 1.6, 2.4, 0.0, y2Base + 1.25, 3.2);
    a(houseRoot, 1.6, 0.7, 0.16, m.whiteWall, 0.0, y2Base + h2 - 0.35, 3.2);
    a(houseRoot, 1.7, h2, 0.16, m.whiteWall, 1.65, y2Mid, 3.2);
    
    for (let s = 0; s < 14; s++) {
      const sx = 0.88 + s * 0.12;
      a(houseRoot, 0.05, h2 + 0.1, 0.18, m.wood, sx, y2Mid, 3.42);
    }
    for (let hh = 0; hh < 4; hh++) {
      a(houseRoot, 3.4, 0.04, 0.12, m.wood, -3.85, y2Base + h2 - 0.15, 3.32 + hh * 0.11);
    }

    // --- D. ATAP ---
    a(houseRoot, 9.9, 0.18, 11.1, m.whiteWall, -1.5, 7.26, 0.1);
    a(houseRoot, 10.05, 0.28, 11.25, m.darkAccent, -1.5, 7.46, 0.1);
    a(houseRoot, 9.85, 0.08, 11.05, m.blackMetal, -1.5, 7.58, 0.1);

    const roofBaseY = 7.6; const roofH = 2.45; const rw = 5.05; const rd = 5.65;
    const ridgeHalf = 1.45; const cx = -1.5; const cz = 0.1;

    const v0 = [cx - rw, roofBaseY, cz + rd]; const v1 = [cx + rw, roofBaseY, cz + rd];
    const v2 = [cx + rw, roofBaseY, cz - rd]; const v3 = [cx - rw, roofBaseY, cz - rd];
    const r0 = [cx - ridgeHalf, roofBaseY + roofH, cz]; const r1 = [cx + ridgeHalf, roofBaseY + roofH, cz];

    const roofVerts = new Float32Array([
      ...v0, ...v1, ...r1,   ...v0, ...r1, ...r0,
      ...v2, ...v3, ...r0,   ...v2, ...r0, ...r1,
      ...v3, ...v0, ...r0,   ...v1, ...v2, ...r1
    ]);
    const roofUVs = new Float32Array([
      0, 0, 1, 0, 0.8, 1,   0, 0, 0.8, 1, 0.2, 1,
      0, 0, 1, 0, 0.8, 1,   0, 0, 0.8, 1, 0.2, 1,
      0, 0, 1, 0, 0.5, 1,   0, 0, 1, 0, 0.5, 1
    ]);
    const roofGeom = new THREE.BufferGeometry();
    roofGeom.setAttribute('position', new THREE.BufferAttribute(roofVerts, 3));
    roofGeom.setAttribute('uv', new THREE.BufferAttribute(roofUVs, 2));
    roofGeom.computeVertexNormals();
    const roofMesh = new THREE.Mesh(roofGeom, m.roof);
    roofMesh.castShadow = true; roofMesh.receiveShadow = true;
    houseRoot.add(roofMesh);
    a(houseRoot, ridgeHalf * 2 + 0.18, 0.14, 0.22, m.blackMetal, cx, roofBaseY + roofH + 0.04, cz);

    // --- E. KANOPI CARPORT ---
    a(houseRoot, 4.2, 0.18, 7.2, m.paving, 4.65, 0.31, 1.8, 0, 0, 0, false, true);
    const canopyY = 3.25;
    a(houseRoot, 0.15, canopyY - 0.2, 0.15, m.blackMetal, 6.6, (canopyY + 0.2) / 2, 5.1);
    a(houseRoot, 0.15, canopyY - 0.2, 0.15, m.blackMetal, 6.6, (canopyY + 0.2) / 2, -1.5);
    a(houseRoot, 4.3, 0.2, 7.0, m.blackMetal, 4.6, canopyY, 1.8);
    for (let kz = -1.4; kz <= 5.0; kz += 0.36) {
      a(houseRoot, 4.0, 0.07, 0.05, m.wood, 4.6, canopyY - 0.02, kz);
    }
    a(houseRoot, 4.1, 0.03, 6.7, m.glass, 4.6, canopyY + 0.11, 1.8, 0, 0, 0, false, false);

    // --- F. INTERIOR LANTAI 1 ---
    const fl1 = y1Base + 0.05;
    a(houseRoot, 2.6, 0.02, 2.0, new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.95 }), -3.7, fl1 + 0.01, 2.0, 0, 0, 0, false, true);
    a(houseRoot, 2.3, 0.36, 0.85, m.sofaFabric, -3.7, fl1 + 0.18, 1.0);
    a(houseRoot, 2.3, 0.45, 0.2, m.sofaFabric, -3.7, fl1 + 0.55, 0.68);
    a(houseRoot, 0.85, 0.36, 1.1, m.sofaFabric, -4.42, fl1 + 0.18, 1.95);
    a(houseRoot, 0.4, 0.35, 0.14, m.cushion, -4.2, fl1 + 0.52, 0.85, -0.2, 0.2, 0);
    a(houseRoot, 0.4, 0.35, 0.14, m.cushion, -3.0, fl1 + 0.52, 0.85, -0.2, -0.15, 0);
    a(houseRoot, 1.1, 0.05, 0.6, m.wood, -3.55, fl1 + 0.36, 2.05);
    a(houseRoot, 0.9, 0.34, 0.45, m.blackMetal, -3.55, fl1 + 0.17, 2.05);
    a(houseRoot, 0.4, 0.42, 1.8, m.wood, -5.12, fl1 + 0.21, 2.2);
    a(houseRoot, 0.06, 0.85, 1.5, m.blackMetal, -5.28, fl1 + 1.15, 2.2);
    a(houseRoot, 1.8, 0.07, 0.95, m.wood, -2.2, fl1 + 0.75, -2.3);
    [[-2.95, -2.65], [-1.45, -2.65], [-2.95, -1.95], [-1.45, -1.95]].forEach(([lx, lz]) => {
      a(houseRoot, 0.08, 0.72, 0.08, m.blackMetal, lx, fl1 + 0.36, lz);
    });
    [[-2.6, -3.0, 0], [-1.8, -3.0, 0], [-2.6, -1.6, Math.PI], [-1.8, -1.6, Math.PI]].forEach(([cxp, czp, rot]) => {
      const ch = new THREE.Group(); ch.position.set(cxp, fl1, czp); ch.rotation.y = rot; houseRoot.add(ch);
      a(ch, 0.45, 0.05, 0.45, m.cushion, 0, 0.45, 0);
      a(ch, 0.45, 0.45, 0.05, m.wood, 0, 0.68, -0.2);
      a(ch, 0.4, 0.44, 0.4, m.blackMetal, 0, 0.22, 0);
    });
    a(houseRoot, 2.5, 0.88, 0.65, m.whiteWall, 1.05, fl1 + 0.44, -4.02);
    a(houseRoot, 2.54, 0.05, 0.68, m.darkAccent, 1.05, fl1 + 0.9, -4.02);
    a(houseRoot, 0.65, 0.03, 0.45, m.blackMetal, 0.45, fl1 + 0.94, -4.02);
    a(houseRoot, 0.55, 0.03, 0.42, m.chrome, 1.55, fl1 + 0.94, -4.02);
    a(houseRoot, 2.5, 0.68, 0.38, m.wood, 1.05, fl1 + 2.25, -4.15);
    a(houseRoot, 1.8, 0.9, 0.75, m.warmGrayWall, 1.1, fl1 + 0.45, -2.45);
    a(houseRoot, 1.9, 0.05, 0.85, m.whiteWall, 1.1, fl1 + 0.92, -2.45);
    a(houseRoot, 0.85, 1.85, 0.72, m.chrome, 1.9, fl1 + 0.925, -1.2);

    const numSteps = 14; const stepRise = (y2Base - y1Base) / numSteps; const stepRun = 0.26;
    a(houseRoot, 0.16, 0.22, 4.1, m.blackMetal, 1.82, y1Base + 1.65, 1.4, 0.74, 0, 0);
    for (let i = 0; i < numSteps; i++) {
      const sy = y1Base + (i + 0.5) * stepRise; const sz = 3.1 - i * stepRun;
      a(houseRoot, 1.02, 0.055, stepRun + 0.04, m.wood, 1.82, sy + stepRise / 2, sz + 0.02);
    }
    a(houseRoot, 0.03, 0.78, 3.85, m.glass, 1.35, y1Base + 1.95, 1.32, 0.74, 0, 0, false, false);
    a(houseRoot, 0.05, 0.05, 3.9, m.wood, 1.35, y1Base + 2.34, 1.32, 0.74, 0, 0);

    // --- G. INTERIOR LANTAI 2 ---
    const fl2 = y2Base + 0.08;
    a(houseRoot, 0.14, h2 - 0.1, 5.2, m.whiteWall, -1.1, y2Mid, 0.6);
    a(houseRoot, 4.2, h2 - 0.1, 0.14, m.whiteWall, -3.3, y2Mid, -1.2);
    a(houseRoot, 3.4, h2 - 0.1, 0.14, m.whiteWall, 0.7, y2Mid, -1.0);

    a(houseRoot, 2.1, 0.35, 1.9, m.wood, -4.25, fl2 + 0.175, 1.1);
    a(houseRoot, 0.12, 1.1, 1.95, m.darkWood, -5.28, fl2 + 0.55, 1.1);
    a(houseRoot, 1.95, 0.25, 1.8, m.bedSheet, -4.25, fl2 + 0.47, 1.1);
    a(houseRoot, 1.25, 0.27, 1.82, m.blanket, -3.88, fl2 + 0.48, 1.1);
    a(houseRoot, 0.42, 0.12, 0.65, m.bedSheet, -4.95, fl2 + 0.65, 0.68);
    a(houseRoot, 0.42, 0.12, 0.65, m.bedSheet, -4.95, fl2 + 0.65, 1.52);
    a(houseRoot, 0.45, 0.48, 0.45, m.wood, -5.05, fl2 + 0.24, -0.15);
    a(houseRoot, 0.45, 0.48, 0.45, m.wood, -5.05, fl2 + 0.24, 2.35);
    a(houseRoot, 0.58, 2.3, 1.85, m.wood, -1.48, fl2 + 1.15, 0.2);
    a(houseRoot, 1.4, 0.35, 2.0, m.wood, 1.5, fl2 + 0.175, -3.2);
    a(houseRoot, 1.32, 0.22, 1.9, m.bedSheet, 1.5, fl2 + 0.45, -3.2);
    a(houseRoot, 1.2, 0.24, 1.92, m.cushion, 1.5, fl2 + 0.46, -2.85);
    a(houseRoot, 0.55, 2.1, 1.2, m.whiteWall, -0.7, fl2 + 1.05, -3.6);
    a(houseRoot, 0.95, 0.78, 0.52, m.whiteWall, -4.8, fl2 + 0.39, -2.0);
    a(houseRoot, 0.5, 0.12, 0.38, m.porcelain, -4.8, fl2 + 0.84, -2.0);
    a(houseRoot, 0.42, 0.42, 0.55, m.porcelain, -2.2, fl2 + 0.21, -2.1);
    a(houseRoot, 0.42, 0.45, 0.18, m.porcelain, -2.2, fl2 + 0.62, -1.9);
    a(houseRoot, 0.03, 2.1, 1.4, m.glass, -3.6, fl2 + 1.05, -3.6, 0, 0, 0, false, false);
    a(houseRoot, 1.6, 0.08, 1.4, m.floorTile, -4.5, fl2 + 0.04, -3.6);
  }
}
