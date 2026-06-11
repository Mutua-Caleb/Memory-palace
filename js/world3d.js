// LE PALAIS DE MÉMOIRE — voxel world (Three.js)
// A Minecraft-style first-person memory palace: ten blocky rooms in a row,
// glowing word-blocks to walk into, doors that slide open when the dictation
// is done, and The Thing standing between you and the exit.

const World = (() => {
  const RW = 13;          // room width in blocks  (x: -6 … 6)
  const RD = 15;          // room depth in blocks  (forward is -z)
  const WALL_H = 4;       // wall height in blocks
  const EYE = 1.65;
  const SPEED = 4.2, RUN = 6.4;

  let scene, camera, renderer, sceneReady = false;
  let yaw = 0, pitch = 0, locked = false, uiLock = true;
  const keys = {};
  const player = { x: 0, y: 0, z: -2, vy: 0, onGround: true };
  let roomIdx = 0;
  let doorOpenState = [];        // per door: false | "opening" | true
  let doorMeshes = [];
  let torchLights = [];          // [roomIdx] -> [lights]
  let orbs = [];                 // active orbs of the current room
  let orbArmed = true;
  let doorArmed = false, crossedArmed = false;
  let monster, monsterEyes;
  let danger = 0;
  let cb = { onOrb: null, onDoor: null, onCrossed: null };
  let clockPrev = 0;

  /* ---------------- pixel-art textures, generated on canvas ----------- */
  function makeTex(draw) {
    const c = document.createElement("canvas");
    c.width = c.height = 16;
    const x = c.getContext("2d");
    draw(x);
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    return t;
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  function noiseFill(x, base, vary, n = 256) {
    for (let i = 0; i < n; i++) {
      const v = rnd(-vary, vary);
      x.fillStyle = `rgb(${base[0] + v | 0},${base[1] + v | 0},${base[2] + v | 0})`;
      x.fillRect(Math.random() * 16 | 0, Math.random() * 16 | 0, 1, 1);
    }
  }
  function texPlanks(dark = 0) {
    return makeTex(x => {
      x.fillStyle = dark ? "#3a2c1c" : "#5a4630";
      x.fillRect(0, 0, 16, 16);
      noiseFill(x, dark ? [52, 40, 26] : [86, 67, 46], 10);
      x.fillStyle = "rgba(0,0,0,0.45)";
      for (let y = 3; y < 16; y += 4) x.fillRect(0, y, 16, 1);
      x.fillRect(8, 0, 1, 4); x.fillRect(3, 4, 1, 4); x.fillRect(11, 8, 1, 4); x.fillRect(6, 12, 1, 4);
    });
  }
  function texStoneBrick() {
    return makeTex(x => {
      x.fillStyle = "#4a4750";
      x.fillRect(0, 0, 16, 16);
      noiseFill(x, [74, 71, 80], 9);
      x.fillStyle = "rgba(0,0,0,0.5)";
      x.fillRect(0, 0, 16, 1); x.fillRect(0, 8, 16, 1);
      x.fillRect(7, 0, 1, 8); x.fillRect(2, 8, 1, 8); x.fillRect(12, 8, 1, 8);
    });
  }
  function texBlood() {
    return makeTex(x => {
      x.fillStyle = "#4e3a26";
      x.fillRect(0, 0, 16, 16);
      noiseFill(x, [78, 58, 38], 9);
      x.fillStyle = "rgba(0,0,0,0.45)";
      for (let y = 3; y < 16; y += 4) x.fillRect(0, y, 16, 1);
      x.fillStyle = "#6e0510";
      for (let i = 0; i < 5; i++) {
        const px = Math.random() * 12 | 0, py = Math.random() * 12 | 0;
        x.fillRect(px, py, 2 + Math.random() * 3 | 0, 2 + Math.random() * 3 | 0);
      }
      x.fillStyle = "#8a0f1d";
      for (let i = 0; i < 8; i++) x.fillRect(Math.random() * 16 | 0, Math.random() * 16 | 0, 1, 1);
    });
  }
  function texDoor() {
    return makeTex(x => {
      x.fillStyle = "#2c2014";
      x.fillRect(0, 0, 16, 16);
      noiseFill(x, [44, 32, 20], 8);
      x.fillStyle = "rgba(0,0,0,0.5)";
      x.fillRect(5, 0, 1, 16); x.fillRect(10, 0, 1, 16);
      x.fillStyle = "#8a0f1d";
      x.fillRect(3, 3, 2, 1); x.fillRect(9, 7, 3, 1); x.fillRect(6, 11, 2, 2);
    });
  }

  /* ---------------- room construction (instanced cubes) --------------- */
  const box = () => new THREE.BoxGeometry(1, 1, 1);
  function instancedBlocks(positions, material) {
    const m = new THREE.InstancedMesh(box(), material, positions.length);
    const M = new THREE.Matrix4();
    positions.forEach((p, i) => { M.setPosition(p[0], p[1], p[2]); m.setMatrixAt(i, M); });
    m.instanceMatrix.needsUpdate = true;
    return m;
  }

  function buildRoom(i, mats) {
    const g = new THREE.Group();
    const z0 = -i * RD, z1 = -(i + 1) * RD;
    const floor = [], blood = [], wall = [], ceil = [];
    for (let x = -6; x <= 6; x++) {
      for (let z = z0 - 1; z >= z1; z--) {
        (Math.random() < 0.12 ? blood : floor).push([x, -0.5, z]);
        ceil.push([x, WALL_H + 0.5, z]);
      }
    }
    for (let y = 0; y < WALL_H; y++) {
      for (let z = z0 - 1; z >= z1 + 1; z--) {
        wall.push([-6, y + 0.5, z]);
        wall.push([6, y + 0.5, z]);
      }
      for (let x = -6; x <= 6; x++) {
        // far wall, with a 3x3 doorway hole at the centre
        const inHole = Math.abs(x) <= 1 && y <= 2;
        if (!inHole) wall.push([x, y + 0.5, z1]);
        if (i === 0) wall.push([x, y + 0.5, z0]); // wall behind the start
      }
    }
    g.add(instancedBlocks(floor, mats.planks));
    g.add(instancedBlocks(blood, mats.blood));
    g.add(instancedBlocks(wall, mats.brick));
    g.add(instancedBlocks(ceil, mats.darkPlanks));

    // the door — slides up when the room's dictation is done
    const door = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 0.4), mats.door);
    door.position.set(0, 1.5, z1);
    g.add(door);
    doorMeshes[i] = door;
    doorOpenState[i] = false;

    // two torches (lit only while you are in the room)
    const lights = [];
    [[-5.4, z0 - RD / 2], [5.4, z0 - RD / 2]].forEach(([x, z]) => {
      const stick = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.18), mats.darkPlanks);
      stick.position.set(x, 2.3, z);
      g.add(stick);
      const flame = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22),
        new THREE.MeshBasicMaterial({ color: 0xffa540 }));
      flame.position.set(x, 2.62, z);
      g.add(flame);
      const l = new THREE.PointLight(0xff7733, 0, 9, 1.6);
      l.position.set(x * 0.9, 2.7, z);
      g.add(l);
      lights.push(l);
    });
    torchLights[i] = lights;
    return g;
  }

  function buildMonster() {
    const black = new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 1 });
    const m = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.15, 0.4), black);
    torso.position.y = 1.55;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), black);
    head.position.y = 2.4;
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1, 0.26), black);
    legL.position.set(-0.2, 0.5, 0);
    const legR = legL.clone(); legR.position.x = 0.2;
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.1, 0.2), black);
    armL.position.set(-0.55, 1.55, 0);
    const armR = armL.clone(); armR.position.x = 0.55;
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xe8d9b0 });
    monsterEyes = new THREE.Group();
    [[-0.13], [0.13]].forEach(([ex]) => {
      const e = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.02), eyeMat);
      e.position.set(ex, 2.45, 0.29);
      monsterEyes.add(e);
    });
    m.add(torso, head, legL, legR, armL, armR, monsterEyes);
    return m;
  }

  /* ---------------- orbs: the word-blocks you walk into --------------- */
  function spawnOrbs(i, n) {
    clearOrbs();
    const z0 = -i * RD;
    const cols = [-4.2, -2.1, 0, 2.1, 4.2];
    const spots = [];
    for (let r = 0; r < 4; r++) {
      for (const x of cols) {
        spots.push([x + rnd(-0.5, 0.5), z0 - 4.8 - r * 2.4 + rnd(-0.5, 0.5)]);
      }
    }
    for (let k = spots.length - 1; k > 0; k--) {
      const j = Math.random() * (k + 1) | 0;
      [spots[k], spots[j]] = [spots[j], spots[k]];
    }
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a0a14, emissive: 0xb51527, emissiveIntensity: 0.9, roughness: 0.6
    });
    for (let k = 0; k < n; k++) {
      const o = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), mat);
      o.position.set(spots[k][0], 1.25, spots[k][1]);
      o.userData = { idx: k, t: Math.random() * 6 };
      scene.add(o);
      orbs.push(o);
    }
  }
  function clearOrbs() {
    orbs.forEach(o => scene.remove(o));
    orbs = [];
  }

  /* ---------------- input --------------------------------------------- */
  function setupInput(canvas) {
    canvas.addEventListener("click", () => {
      if (!uiLock && !locked) canvas.requestPointerLock();
    });
    document.addEventListener("pointerlockchange", () => {
      locked = document.pointerLockElement === canvas;
      document.body.classList.toggle("locked", locked);
    });
    document.addEventListener("mousemove", e => {
      if (!locked) return;
      yaw -= e.movementX * 0.0023;
      pitch -= e.movementY * 0.0023;
      pitch = Math.max(-1.45, Math.min(1.45, pitch));
    });
    addEventListener("keydown", e => { keys[e.code] = true; });
    addEventListener("keyup", e => { keys[e.code] = false; });
  }

  /* ---------------- movement & collision ------------------------------ */
  function move(dt) {
    if (uiLock || !locked) return;
    const fwd = (keys.KeyW || keys.KeyZ || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
    const str = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.KeyQ || keys.ArrowLeft ? 1 : 0);
    const sp = (keys.ShiftLeft || keys.ShiftRight) ? RUN : SPEED;
    let dx = 0, dz = 0;
    if (fwd || str) {
      const len = Math.hypot(fwd, str);
      const f = fwd / len, s = str / len;
      dx = (Math.sin(yaw) * -f + Math.cos(yaw) * s) * sp * dt;
      dz = (Math.cos(yaw) * -f - Math.sin(yaw) * s) * sp * dt;
    }
    // jump, because Minecraft
    if (keys.Space && player.onGround) { player.vy = 4.6; player.onGround = false; }
    player.vy -= 13 * dt;
    player.y += player.vy * dt;
    if (player.y <= 0) { player.y = 0; player.vy = 0; player.onGround = true; }

    let nx = player.x + dx, nz = player.z + dz;
    nx = Math.max(-5.15, Math.min(5.15, nx));
    // wall planes every RD blocks; pass only through an open door near the centre
    for (let k = 0; k <= ROOMS.length; k++) {
      const P = -k * RD;
      const doorOK = k >= 1 && doorOpenState[k - 1] && Math.abs(nx) < 1.05;
      if (player.z > P + 0.85 && nz < P + 0.85 && !doorOK) nz = P + 0.85;
      if (player.z < P - 0.85 && nz > P - 0.85 && !doorOK) nz = P - 0.85;
    }
    player.x = nx; player.z = nz;
  }

  /* ---------------- per-frame update ----------------------------------- */
  function frame(t) {
    requestAnimationFrame(frame);
    if (!sceneReady) return;
    const dt = Math.min(0.05, (t - clockPrev) / 1000 || 0.016);
    clockPrev = t;
    move(dt);
    camera.position.set(player.x, EYE + player.y, player.z);
    camera.rotation.set(0, 0, 0);
    camera.rotateY(yaw);
    camera.rotateX(pitch);

    // orbs bob & spin; walking into one starts its challenge
    for (const o of orbs) {
      o.userData.t += dt;
      o.rotation.y += dt * 1.4;
      o.position.y = 1.25 + Math.sin(o.userData.t * 2.2) * 0.13;
      o.scale.setScalar(1 + Math.sin(o.userData.t * 3.1) * 0.08);
      if (!uiLock && orbArmed && cb.onOrb) {
        const d = Math.hypot(o.position.x - player.x, o.position.z - player.z);
        if (d < 1.5) { orbArmed = false; cb.onOrb(o.userData.idx); break; }
      }
    }
    // reaching the door triggers the dictation
    if (!uiLock && doorArmed && cb.onDoor) {
      const doorZ = -(roomIdx + 1) * RD;
      if (Math.hypot(player.x, player.z - doorZ) < 2.6) {
        doorArmed = false;
        cb.onDoor();
      }
    }
    // crossing into the next room
    if (!uiLock && crossedArmed && cb.onCrossed) {
      const doorZ = -(roomIdx + 1) * RD;
      if (player.z < doorZ - 1.2) { crossedArmed = false; cb.onCrossed(); }
    }
    // torch flicker
    (torchLights[roomIdx] || []).forEach(l => {
      l.intensity = 0.55 + Math.random() * 0.2 + danger * 0.1;
    });
    // The Thing creeps along the line between the exit door and you
    if (monster) {
      const doorZ = -(roomIdx + 1) * RD;
      const tz = doorZ + 1.6 + (player.z - doorZ - 3) * Math.min(0.92, danger * 0.95);
      const tx = player.x * 0.4 * danger;
      monster.position.z += (tz - monster.position.z) * dt * 0.8;
      monster.position.x += (tx - monster.position.x) * dt * 0.8;
      monster.position.y = Math.abs(Math.sin(t / 300)) * 0.04 * (1 + danger * 3);
      monster.lookAt(player.x, 1.6, player.z);
      monster.visible = danger > 0.04;
    }
    renderer.render(scene, camera);
  }

  /* ---------------- public API ----------------------------------------- */
  function init() {
    const canvas = document.getElementById("gl");
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050a);
    scene.fog = new THREE.FogExp2(0x05050a, 0.055);
    camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 60);

    const mats = {
      planks: new THREE.MeshStandardMaterial({ map: texPlanks(), roughness: 1 }),
      darkPlanks: new THREE.MeshStandardMaterial({ map: texPlanks(1), roughness: 1 }),
      brick: new THREE.MeshStandardMaterial({ map: texStoneBrick(), roughness: 1 }),
      blood: new THREE.MeshStandardMaterial({ map: texBlood(), roughness: 1 }),
      door: new THREE.MeshStandardMaterial({ map: texDoor(), roughness: 1 })
    };
    for (let i = 0; i < ROOMS.length; i++) scene.add(buildRoom(i, mats));

    scene.add(new THREE.AmbientLight(0x221a28, 0.55));
    const lamp = new THREE.SpotLight(0xffe8c0, 1.25, 17, 0.62, 0.55, 1.4);
    camera.add(lamp);
    lamp.position.set(0, 0.2, 0.1);
    lamp.target.position.set(0, 0, -6);
    camera.add(lamp.target);
    scene.add(camera);

    monster = buildMonster();
    monster.visible = false;
    scene.add(monster);

    setupInput(canvas);
    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
    sceneReady = true;
    requestAnimationFrame(frame);
  }

  function startRoom(i, nWords) {
    roomIdx = i;
    player.x = 0; player.y = 0; player.z = -i * RD - 2;
    yaw = 0; pitch = 0;
    spawnOrbs(i, nWords);
    orbArmed = true; doorArmed = false; crossedArmed = false;
    const doorZ = -(i + 1) * RD;
    monster.position.set(0, 0, doorZ + 1.6);
  }

  function solveOrb(idx) {
    const o = orbs.find(o => o.userData.idx === idx);
    if (o) { scene.remove(o); orbs = orbs.filter(x => x !== o); }
  }
  const orbsLeft = () => orbs.length;
  function rearmOrbs() { orbArmed = true; }
  function armDoor() {
    doorArmed = true;
    doorMeshes[roomIdx].material = doorMeshes[roomIdx].material.clone();
    doorMeshes[roomIdx].material.emissive = new THREE.Color(0x8a0f1d);
    doorMeshes[roomIdx].material.emissiveIntensity = 0.5;
  }
  function openDoor() {
    doorOpenState[roomIdx] = true;
    crossedArmed = true;
    const door = doorMeshes[roomIdx];
    const y0 = door.position.y, t0 = performance.now();
    (function anim() {
      const k = Math.min(1, (performance.now() - t0) / 1600);
      door.position.y = y0 + k * 3.2;
      if (k < 1) requestAnimationFrame(anim);
    })();
  }
  function closeDoorBehind(i) {
    const door = doorMeshes[i];
    doorOpenState[i] = false;
    door.position.y = 1.5;
  }
  function setDanger(d) { danger = d; }
  function setUILock(v) {
    uiLock = v;
    if (v && document.pointerLockElement) document.exitPointerLock();
    document.body.classList.toggle("ui-open", v);
  }
  function dawn() {
    scene.background = new THREE.Color(0x2a2238);
    scene.fog = new THREE.FogExp2(0x2a2238, 0.03);
  }
  function bind(c) { Object.assign(cb, c); }

  return { init, startRoom, solveOrb, orbsLeft, rearmOrbs, armDoor, openDoor,
           closeDoorBehind, setDanger, setUILock, dawn, bind,
           get locked() { return locked; } };
})();
