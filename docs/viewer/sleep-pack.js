/* Duster II Sleep Pack — v0.1 millimetres, same numbers as cad/params.py */
(function () {
  if (!window.THREE) {
    document.getElementById("fail").hidden = false;
    return;
  }

  const T = THREE;
  const DURATION = 42;

  const P = {
    ply: 15,
    boxW: 950,
    boxD: 800,
    boxH: 320,
    innerW: 920,
    innerD: 770,
    innerH: 305,
    railTopH: 70,
    railBotH: 50,
    tableW: 918,
    tableH: 198,
    bedW: 950,
    p1: 800,
    p2: 549,
    p3: 549,
    gap: 2,
    wing: 175,
    frameSeg: 550,
    frameH: 80,
    slatW: 918,
    slatH: 80,
    legH: 305,
    restH: 50,
    mattressT: 50,
  };

  const COL = {
    box: 0xd8c7a1,
    deck: 0xc9b48a,
    wing: 0xb9d4c0,
    frame: 0x9aa7b5,
    foam: 0xe8dcc0,
    edge: 0x4a3d2c,
  };

  const CHAPTERS = [
    { t: 0.0, n: "01", title: "Separated parts", body: "" },
    { t: 2.3, n: "02", title: "Box carcass", body: "" },
    { t: 6.4, n: "03", title: "Bottom in", body: "" },
    { t: 8.2, n: "04", title: "Picnic table", body: "" },
    { t: 10.0, n: "05", title: "Frame tucks in", body: "" },
    { t: 12.4, n: "06", title: "Z-fold lid", body: "" },
    { t: 15.6, n: "07", title: "Folded — five seats", body: "" },
    { t: 18.2, n: "08", title: "Pull the frame", body: "" },
    { t: 21.6, n: "09", title: "Slot the slats", body: "" },
    { t: 24.2, n: "10", title: "Unfold the bed", body: "" },
    { t: 29.0, n: "11", title: "Wings and picnic", body: "" },
    { t: 33.4, n: "12", title: "Sleep pack", body: "" },
  ];

  function viewerLang() {
    const q = new URLSearchParams(location.search).get("lang");
    return q || localStorage.getItem("duster-lang") || "en";
  }

  function applyViewerCopy() {
    const pack = (window.VIEWER_I18N && window.VIEWER_I18N[viewerLang()]) || (window.VIEWER_I18N && window.VIEWER_I18N.en);
    if (!pack) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("v-brand", pack.brand);
    set("v-meta", pack.meta);
    set("hint", pack.hint);
    set("v-parts", pack.parts);
    set("v-folded", pack.folded);
    set("v-picnic", pack.picnic);
    set("v-sleep", pack.sleep);
    set("v-labels", pack.labels);
    set("v-boot", pack.boot);
    pack.chapters.forEach((c, i) => {
      if (CHAPTERS[i]) {
        CHAPTERS[i].title = c.title;
        CHAPTERS[i].body = c.body;
      }
    });
  }
  applyViewerCopy();

  const ASSEMBLE = [
    "SIDE_L", "SIDE_R", "FRONT", "RAIL_BOT", "RAIL_TOP", "BOTTOM", "TABLE",
    "RAIL_L_A", "RAIL_L_B", "RAIL_R_A", "RAIL_R_B", "LEG_L", "LEG_R",
    "SEAT_L", "SEAT_R", "SOCK_L1", "SOCK_L2", "SOCK_R1", "SOCK_R2",
    "SLAT_1", "SLAT_2", "DECK_P1", "DECK_P2", "DECK_P3",
    "RUN_L1", "RUN_L2", "RUN_R1", "RUN_R2", "WING_L", "WING_R",
  ];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerp3(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  function smoother(t) {
    t = clamp(t, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  function ramp(t, a, b) { return smoother((t - a) / Math.max(0.0001, b - a)); }
  function lerpAngle(a, b, t) {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return a + d * t;
  }
  function rotYZ(y, z, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [y * c - z * s, y * s + z * c];
  }

  function woodTex(hex, seed) {
    const cnv = document.createElement("canvas");
    cnv.width = cnv.height = 256;
    const ctx = cnv.getContext("2d");
    ctx.fillStyle = "#" + hex.toString(16).padStart(6, "0");
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 36; i++) {
      const x = ((seed * 17 + i * 37) % 256);
      ctx.strokeStyle = "rgba(70,50,28," + (0.05 + (i % 5) * 0.02) + ")";
      ctx.lineWidth = 1 + (i % 3);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 18, 90, x - 22, 170, x + 8, 256);
      ctx.stroke();
    }
    const tex = new T.CanvasTexture(cnv);
    tex.wrapS = tex.wrapT = T.RepeatWrapping;
    tex.colorSpace = T.SRGBColorSpace;
    return tex;
  }

  const textures = {
    box: woodTex(COL.box, 1),
    deck: woodTex(COL.deck, 4),
    wing: woodTex(COL.wing, 7),
    frame: woodTex(COL.frame, 11),
  };

  function board(sx, sy, sz, kind) {
    const geo = new T.BoxGeometry(sx, sz, sy);
    const mat = new T.MeshStandardMaterial({
      color: 0xffffff,
      map: textures[kind] || textures.box,
      roughness: 0.74,
      metalness: 0.03,
    });
    const mesh = new T.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const edges = new T.LineSegments(
      new T.EdgesGeometry(geo, 25),
      new T.LineBasicMaterial({ color: COL.edge, transparent: true, opacity: 0.55 })
    );
    mesh.add(edges);
    mesh.userData.size = [sx, sy, sz];
    return mesh;
  }

  function foam(sx, sy, sz) {
    const mesh = new T.Mesh(
      new T.BoxGeometry(sx, sz, sy),
      new T.MeshStandardMaterial({ color: COL.foam, roughness: 0.95, metalness: 0 })
    );
    mesh.castShadow = true;
    return mesh;
  }

  function apply(mesh, pose, floatZ) {
    const z = pose.center[2] + (floatZ || 0);
    mesh.position.set(pose.center[0], z, pose.center[1]);
    mesh.rotation.set(pose.rotX || 0, 0, 0);
    const op = pose.opacity == null ? 1 : pose.opacity;
    mesh.visible = op > 0.02;
    mesh.traverse((ch) => {
      if (ch.material && ch.material.transparent !== undefined) {
        if (ch === mesh) {
          ch.material.transparent = op < 0.999;
          ch.material.opacity = op;
        }
      }
    });
    if (mesh.material) {
      mesh.material.transparent = op < 0.999;
      mesh.material.opacity = op;
    }
  }

  /* ----- poses in CAD: X right, Y cabin, Z up; centers ----- */

  function hingeCenter(hinge, localY, localZ, angle) {
    const [y, z] = rotYZ(localY, localZ, angle);
    return [hinge[0], hinge[1] + y, hinge[2] + z];
  }

  function deckPoses(p2a, p3a, wingS) {
    const H2 = [475, 800, 335];
    const p2c = hingeCenter(H2, 274.5, -7.5, p2a);
    const stacked3 = { center: [p2c[0], p2c[1], p2c[2] + 15], rotX: p2a };
    const H3 = hingeCenter(H2, 549, 0, p2a);
    const open3 = { center: hingeCenter(H3, 274.5, -7.5, p2a + p3a), rotX: p2a + p3a };
    const p3 = mix(open3, stacked3, p3a / Math.PI);

    function wing(sign, s) {
      const localX = sign * (387.5 + s * 175);
      const [y, z] = rotYZ(274.5, -7.5, p2a);
      return { center: [H2[0] + localX, H2[1] + y, H2[2] + z], rotX: p2a };
    }
    function runner(x, dz) {
      const [y, z] = rotYZ(274.5, -7.5 + dz, p2a);
      return { center: [x, H2[1] + y, H2[2] + z], rotX: p2a };
    }
    return {
      DECK_P1: { center: [475, 400, 327.5], rotX: 0 },
      DECK_P2: { center: p2c, rotX: p2a },
      DECK_P3: p3,
      WING_L: wing(-1, wingS),
      WING_R: wing(1, wingS),
      RUN_L1: runner(20, -12),
      RUN_L2: runner(56, -12),
      RUN_R1: runner(894, -12),
      RUN_R2: runner(930, -12),
    };
  }

  function framePoses(alpha, gamma) {
    function side(x, inset) {
      const H = [x, 800, 280];
      const aC = hingeCenter(H, 275, 0, alpha);
      const HB = hingeCenter(H, 550, 0, alpha);
      const bOpen = { center: hingeCenter(HB, 275, 0, alpha + gamma), rotX: alpha + gamma };
      const bStacked = { center: [aC[0] + inset, aC[1], aC[2] + 10], rotX: alpha };
      const B = mix(bOpen, bStacked, gamma / Math.PI);
      const sock = (along, onB) => {
        const base = onB ? HB : H;
        const ang = onB ? alpha : alpha;
        const c = hingeCenter(base, along, 0, onB ? alpha + (1 - gamma / Math.PI) * 0 : alpha);
        return { center: [c[0] + inset, c[1], 280], rotX: ang };
      };
      return {
        A: { center: aC, rotX: alpha },
        B,
        S1: sock(180, false),
        S2: { center: [B.center[0] + inset * 0.2, B.center[1], 280], rotX: B.rotX },
        REST: { center: [aC[0] + inset, aC[1], aC[2] - 55], rotX: alpha },
      };
    }
    const L = side(22.5, 18);
    const R = side(927.5, -18);
    const legU = 1 - gamma / Math.PI;
    return {
      RAIL_L_A: L.A, RAIL_L_B: L.B, SOCK_L1: L.S1, SOCK_L2: L.S2, SEAT_L: L.REST,
      RAIL_R_A: R.A, RAIL_R_B: R.B, SOCK_R1: R.S1, SOCK_R2: R.S2, SEAT_R: R.REST,
      LEG_L: mix({ center: [48, 500, 200], rotX: Math.PI / 2 }, { center: [22.5, 1860, 152.5], rotX: 0 }, legU),
      LEG_R: mix({ center: [902, 500, 200], rotX: Math.PI / 2 }, { center: [927.5, 1860, 152.5], rotX: 0 }, legU),
    };
  }

  function tablePose(open) {
    const H = [475, 8, 250];
    const a = open * (-Math.PI / 2);
    return { center: hingeCenter(H, 8, -99, a), rotX: a };
  }

  function slatPose(i, u) {
    const stored = { center: [475, 360 + i * 90, 23 + i * 16], rotX: 0 };
    const y = i === 0 ? 980 : 1380;
    const slotted = { center: [475, y, 280], rotX: Math.PI / 2 };
    const mid = { center: [475, lerp(stored.center[1], y, 0.5), 420], rotX: Math.PI / 4 };
    if (u < 0.5) return mix(stored, mid, u * 2);
    return mix(mid, slotted, (u - 0.5) * 2);
  }

  function mix(a, b, t) {
    t = smoother(t);
    return {
      center: lerp3(a.center, b.center, t),
      rotX: lerpAngle(a.rotX || 0, b.rotX || 0, t),
      opacity: lerp(a.opacity == null ? 1 : a.opacity, b.opacity == null ? 1 : b.opacity, t),
    };
  }

  function staticBox() {
    return {
      SIDE_L: { center: [7.5, 400, 160], rotX: 0 },
      SIDE_R: { center: [942.5, 400, 160], rotX: 0 },
      BOTTOM: { center: [475, 400, 7.5], rotX: 0 },
      FRONT: { center: [475, 792.5, 167.5], rotX: 0 },
      RAIL_BOT: { center: [475, 7.5, 25], rotX: 0 },
      RAIL_TOP: { center: [475, 7.5, 285], rotX: 0 },
    };
  }

  function explodeOffsets() {
    return {
      SIDE_L: [-420, -40, 80],
      SIDE_R: [420, -40, 80],
      BOTTOM: [0, 80, -220],
      FRONT: [0, 380, 120],
      RAIL_BOT: [0, -420, 20],
      RAIL_TOP: [0, -420, 260],
      TABLE: [0, -640, 80],
      DECK_P1: [-40, -80, 420],
      DECK_P2: [280, 220, 560],
      DECK_P3: [560, 480, 700],
      WING_L: [-520, 260, 520],
      WING_R: [520, 260, 520],
      RUN_L1: [-480, 160, 380],
      RUN_L2: [-480, 200, 400],
      RUN_R1: [480, 160, 380],
      RUN_R2: [480, 200, 400],
      RAIL_L_A: [-360, 520, 40],
      RAIL_L_B: [-360, 720, 80],
      RAIL_R_A: [360, 520, 40],
      RAIL_R_B: [360, 720, 80],
      LEG_L: [-300, 980, 0],
      LEG_R: [300, 980, 0],
      SLAT_1: [0, 1100, 40],
      SLAT_2: [0, 1220, 80],
      SOCK_L1: [-280, 560, 160],
      SOCK_L2: [-280, 640, 180],
      SOCK_R1: [280, 560, 160],
      SOCK_R2: [280, 640, 180],
      SEAT_L: [-240, 860, 20],
      SEAT_R: [240, 860, 20],
      MATT: [0, 900, 900],
      PAD_L: [-400, 900, 760],
      PAD_R: [400, 900, 760],
      FOOT_L: [-120, 1700, 80],
      FOOT_R: [120, 1700, 80],
    };
  }

  function addOff(pose, off) {
    if (!off) return pose;
    return { center: [pose.center[0] + off[0], pose.center[1] + off[1], pose.center[2] + off[2]], rotX: pose.rotX, opacity: pose.opacity };
  }

  function stateAt(t) {
    const box = staticBox();
    const foldedDeck = deckPoses(Math.PI, Math.PI, 0);
    const foldedFrame = framePoses(Math.PI, Math.PI);
    const foldedTable = tablePose(0);
    const folded = Object.assign({}, box, foldedDeck, foldedFrame, {
      TABLE: foldedTable,
      SLAT_1: slatPose(0, 0),
      SLAT_2: slatPose(1, 0),
    });

    const deployedDeck = deckPoses(0, 0, 1);
    const deployedFrame = framePoses(0, 0);
    const deployed = Object.assign({}, box, deployedDeck, deployedFrame, {
      TABLE: tablePose(1),
      SLAT_1: slatPose(0, 1),
      SLAT_2: slatPose(1, 1),
    });

    const offs = explodeOffsets();
    const exploded = {};
    Object.keys(folded).forEach((id) => {
      exploded[id] = addOff(folded[id], offs[id]);
      if (id === "DECK_P2" || id === "DECK_P3" || id.startsWith("WING") || id.startsWith("RUN")) {
        exploded[id] = { center: exploded[id].center, rotX: 0 };
      }
    });

    const out = {};
    ASSEMBLE.forEach((id, i) => {
      const u = staggerAssemble(t, i, ASSEMBLE.length);
      out[id] = mix(exploded[id], folded[id], u);
    });

    const frameU = ramp(t, 18.2, 21.2);
    const slatU = ramp(t, 21.6, 23.8);
    const p2U = ramp(t, 24.2, 26.8);
    const p3U = ramp(t, 26.6, 29.0);
    const wingU = ramp(t, 29.0, 31.0);
    const tableU = ramp(t, 30.6, 32.6);
    const foamU = ramp(t, 33.4, 35.6);

    if (t > 17.5) {
      const liveDeck = deckPoses(Math.PI * (1 - p2U), Math.PI * (1 - p3U), wingU);
      const alpha = frameU < 0.55 ? Math.PI * (1 - frameU / 0.55) : 0;
      const gamma = frameU < 0.55 ? Math.PI : Math.PI * (1 - (frameU - 0.55) / 0.45);
      const liveFrame = framePoses(alpha, gamma);
      Object.assign(out, liveDeck, liveFrame);
      out.TABLE = mix(folded.TABLE, deployed.TABLE, tableU);
      out.SLAT_1 = slatPose(0, slatU);
      out.SLAT_2 = slatPose(1, slatU);
      ["SIDE_L", "SIDE_R", "BOTTOM", "FRONT", "RAIL_BOT", "RAIL_TOP"].forEach((id) => {
        out[id] = box[id];
      });
    }

    out.MATT = {
      center: [475, 950, 320 + 15 + 25],
      rotX: 0,
      opacity: foamU,
    };
    out.PAD_L = { center: [-87.5, 1074.5, 360], rotX: 0, opacity: foamU * wingU };
    out.PAD_R = { center: [950 + 87.5, 800 + 274.5, 320 + 15 + 25], rotX: 0, opacity: foamU * wingU };
    out.FOOT_L = { center: [200, 1780, 40], rotX: 0, opacity: foamU };
    out.FOOT_R = { center: [750, 1780, 40], rotX: 0, opacity: foamU };

    return { poses: out, foamU, boot: ramp(t, 14.8, 16.6) * (1 - ramp(t, 18.0, 19.2) * 0.35) };
  }

  function staggerAssemble(t, i, n) {
    const t0 = 2.2;
    const t1 = 14.6;
    const span = t1 - t0;
    const dur = 1.35;
    const start = t0 + (i / Math.max(n - 1, 1)) * (span - dur);
    return ramp(t, start, start + dur);
  }

  /* ----- scene ----- */

  const canvas = document.getElementById("view");
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x14110e, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = T.SRGBColorSpace;

  const scene = new T.Scene();
  scene.fog = new T.Fog(0x14110e, 4200, 9000);

  const camera = new T.PerspectiveCamera(42, 1, 20, 16000);
  const world = new T.Group();
  world.position.set(-475, 0, -700);
  scene.add(world);

  scene.add(new T.HemisphereLight(0xf3ead8, 0x2a241c, 0.72));
  const key = new T.DirectionalLight(0xfff4e0, 1.35);
  key.position.set(1800, 2800, -900);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -2200;
  key.shadow.camera.right = 2200;
  key.shadow.camera.top = 2200;
  key.shadow.camera.bottom = -1600;
  key.shadow.camera.near = 200;
  key.shadow.camera.far = 7000;
  scene.add(key);
  const fill = new T.DirectionalLight(0xc5d4e0, 0.35);
  fill.position.set(-1600, 1200, 1800);
  scene.add(fill);

  const ground = new T.Mesh(
    new T.PlaneGeometry(12000, 12000),
    new T.MeshStandardMaterial({ color: 0x1b1713, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  world.add(ground);

  const grid = new T.GridHelper(8000, 40, 0x3a3228, 0x2a241c);
  grid.position.y = 0.4;
  world.add(grid);

  const boot = new T.Group();
  const bootMat = new T.MeshStandardMaterial({
    color: 0x6e7c88,
    transparent: true,
    opacity: 0.14,
    roughness: 0.9,
    depthWrite: false,
  });
  const floor = new T.Mesh(new T.BoxGeometry(1100, 8, 2100), bootMat);
  floor.position.set(475, 4, 700);
  boot.add(floor);
  [-80, 1030].forEach((x) => {
    const arch = new T.Mesh(new T.CylinderGeometry(160, 160, 420, 22, 1, false, 0, Math.PI), bootMat);
    arch.rotation.z = Math.PI / 2;
    arch.position.set(x, 0, 280);
    boot.add(arch);
  });
  world.add(boot);

  const meshes = {
    SIDE_L: board(15, 800, 320, "box"),
    SIDE_R: board(15, 800, 320, "box"),
    BOTTOM: board(920, 770, 15, "box"),
    FRONT: board(920, 15, 305, "box"),
    RAIL_BOT: board(920, 15, 50, "box"),
    RAIL_TOP: board(920, 15, 70, "box"),
    TABLE: board(918, 15, 198, "deck"),
    DECK_P1: board(950, 800, 15, "deck"),
    DECK_P2: board(950, 549, 15, "deck"),
    DECK_P3: board(950, 549, 15, "deck"),
    WING_L: board(175, 549, 15, "wing"),
    WING_R: board(175, 549, 15, "wing"),
    RUN_L1: board(20, 549, 15, "wing"),
    RUN_L2: board(20, 549, 15, "wing"),
    RUN_R1: board(20, 549, 15, "wing"),
    RUN_R2: board(20, 549, 15, "wing"),
    RAIL_L_A: board(15, 550, 80, "frame"),
    RAIL_L_B: board(15, 550, 80, "frame"),
    RAIL_R_A: board(15, 550, 80, "frame"),
    RAIL_R_B: board(15, 550, 80, "frame"),
    LEG_L: board(15, 80, 305, "frame"),
    LEG_R: board(15, 80, 305, "frame"),
    SLAT_1: board(918, 80, 15, "frame"),
    SLAT_2: board(918, 80, 15, "frame"),
    SOCK_L1: board(15, 40, 90, "frame"),
    SOCK_L2: board(15, 40, 90, "frame"),
    SOCK_R1: board(15, 40, 90, "frame"),
    SOCK_R2: board(15, 40, 90, "frame"),
    SEAT_L: board(15, 80, 50, "frame"),
    SEAT_R: board(15, 80, 50, "frame"),
    MATT: foam(950, 1900, 50),
    PAD_L: foam(175, 549, 50),
    PAD_R: foam(175, 549, 50),
    FOOT_L: foam(150, 400, 80),
    FOOT_R: foam(150, 400, 80),
  };

  Object.values(meshes).forEach((m) => world.add(m));

  const labelHost = document.getElementById("labels");
  const labelIds = [
    ["SIDE_L", "SIDE_L"],
    ["BOTTOM", "BOTTOM"],
    ["FRONT", "FRONT"],
    ["TABLE", "TABLE"],
    ["DECK_P1", "DECK_P1"],
    ["DECK_P2", "DECK_P2"],
    ["DECK_P3", "DECK_P3"],
    ["WING_L", "WING"],
    ["RAIL_L_A", "RAIL_SEG"],
    ["SLAT_1", "SLAT"],
    ["LEG_L", "LEG"],
  ];
  const labels = labelIds.map(([id, text]) => {
    const el = document.createElement("div");
    el.className = "label";
    el.textContent = text;
    labelHost.appendChild(el);
    return { id, el };
  });

  /* ----- camera + input ----- */

  const cam = {
    theta: 0.72,
    phi: 1.08,
    r: 3400,
    look: { x: 0, y: 220, z: 0 },
    user: false,
  };

  const camKeys = [
    { t: 0, theta: 0.55, phi: 1.12, r: 3600, look: [0, 260, 40] },
    { t: 7, theta: 0.85, phi: 1.18, r: 2300, look: [0, 180, -80] },
    { t: 16, theta: 0.95, phi: 1.15, r: 2100, look: [20, 200, -40] },
    { t: 20, theta: 0.55, phi: 1.05, r: 2800, look: [0, 220, 280] },
    { t: 28, theta: 0.35, phi: 0.95, r: 3200, look: [0, 240, 420] },
    { t: 36, theta: 0.62, phi: 0.88, r: 3400, look: [0, 260, 360] },
  ];

  function camAt(t) {
    let i = 0;
    while (i < camKeys.length - 1 && camKeys[i + 1].t < t) i++;
    const a = camKeys[i];
    const b = camKeys[Math.min(i + 1, camKeys.length - 1)];
    const u = a === b ? 0 : ramp(t, a.t, b.t);
    return {
      theta: lerp(a.theta, b.theta, u),
      phi: lerp(a.phi, b.phi, u),
      r: lerp(a.r, b.r, u),
      look: lerp3(a.look, b.look, u),
    };
  }

  function applyCam(c) {
    const phi = clamp(c.phi, 0.18, 1.45);
    const x = c.look[0] + c.r * Math.sin(phi) * Math.sin(c.theta);
    const y = c.look[1] + c.r * Math.cos(phi);
    const z = c.look[2] + c.r * Math.sin(phi) * Math.cos(c.theta);
    camera.position.set(x, y, z);
    camera.lookAt(c.look[0], c.look[1], c.look[2]);
  }

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    cam.user = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointerup", () => { dragging = false; });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    cam.theta -= (e.clientX - lastX) * 0.005;
    cam.phi = clamp(cam.phi - (e.clientY - lastY) * 0.004, 0.18, 1.45);
    lastX = e.clientX;
    lastY = e.clientY;
  });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    cam.user = true;
    cam.r = clamp(cam.r * (1 + e.deltaY * 0.001), 900, 7000);
  }, { passive: false });

  /* ----- playback ----- */

  const ui = {
    play: document.getElementById("play"),
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
    scrub: document.getElementById("scrub"),
    clock: document.getElementById("clock"),
    speed: document.getElementById("speed"),
    labelsOn: document.getElementById("labelsOn"),
    bootOn: document.getElementById("bootOn"),
    kicker: document.getElementById("kicker"),
    title: document.getElementById("title"),
    body: document.getElementById("body"),
    hint: document.getElementById("hint"),
    ticks: document.getElementById("ticks"),
  };

  CHAPTERS.forEach((ch) => {
    const i = document.createElement("i");
    i.style.left = (ch.t / DURATION * 100) + "%";
    ui.ticks.appendChild(i);
  });

  const bootParams = new URLSearchParams(location.search);
  let time = bootParams.has("t") ? clamp(parseFloat(bootParams.get("t")) || 0, 0, DURATION) : 0;
  let playing = bootParams.has("t")
    ? bootParams.get("play") === "1"
    : !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let speed = 1;
  let last = performance.now();
  let hintT = 0;

  function chapterAt(t) {
    let ch = CHAPTERS[0];
    for (const c of CHAPTERS) if (t + 0.01 >= c.t) ch = c;
    return ch;
  }

  function setCaption(t) {
    const ch = chapterAt(t);
    const idx = CHAPTERS.indexOf(ch) + 1;
    ui.kicker.textContent = ch.n + " / " + String(CHAPTERS.length).padStart(2, "0");
    ui.title.textContent = ch.title;
    ui.body.textContent = ch.body;
    document.querySelectorAll(".modes button").forEach((b) => {
      const jt = parseFloat(b.dataset.jump);
      b.classList.toggle("active", Math.abs(t - jt) < 1.6 || (jt === 0 && t < 2));
    });
    void idx;
  }

  function fmt(t) {
    const s = Math.floor(t);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  function jump(t, pause) {
    time = clamp(t, 0, DURATION);
    if (pause) playing = false;
    cam.user = false;
    syncPlay();
  }

  function syncPlay() {
    ui.play.classList.toggle("is-playing", playing);
    const pack = (window.VIEWER_I18N && window.VIEWER_I18N[viewerLang()]) || {};
    ui.play.setAttribute("aria-label", playing ? (pack.pause || "Pause") : (pack.play || "Play"));
  }

  ui.play.addEventListener("click", () => {
    playing = !playing;
    if (time >= DURATION - 0.05) time = 0;
    syncPlay();
  });
  ui.prev.addEventListener("click", () => {
    const ch = [...CHAPTERS].reverse().find((c) => c.t < time - 0.35);
    jump(ch ? ch.t : 0, false);
    playing = true;
    syncPlay();
  });
  ui.next.addEventListener("click", () => {
    const ch = CHAPTERS.find((c) => c.t > time + 0.35);
    jump(ch ? ch.t : DURATION, false);
    playing = true;
    syncPlay();
  });
  ui.scrub.addEventListener("input", () => {
    time = (ui.scrub.value / 1000) * DURATION;
    playing = false;
    syncPlay();
  });
  ui.speed.addEventListener("click", () => {
    speed = speed === 1 ? 1.75 : speed === 1.75 ? 0.6 : 1;
    ui.speed.textContent = speed.toString().replace(/\.00$/, "") + "×";
    if (speed === 1.75) ui.speed.textContent = "1.75×";
    if (speed === 0.6) ui.speed.textContent = "0.6×";
    if (speed === 1) ui.speed.textContent = "1×";
  });
  document.querySelectorAll(".modes button").forEach((b) => {
    b.addEventListener("click", () => jump(parseFloat(b.dataset.jump), b.dataset.pause === "true"));
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      ui.play.click();
    } else if (e.code === "ArrowRight") ui.next.click();
    else if (e.code === "ArrowLeft") ui.prev.click();
    else if (e.key === "1") jump(0, true);
    else if (e.key === "2") jump(15.8, true);
    else if (e.key === "3") jump(36.2, true);
  });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  const tmp = new T.Vector3();
  function projectLabel(el, mesh, show) {
    mesh.getWorldPosition(tmp);
    tmp.y += 40;
    tmp.project(camera);
    const x = (tmp.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (-tmp.y * 0.5 + 0.5) * canvas.clientHeight;
    const on = show && tmp.z > -1 && tmp.z < 1;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.opacity = on ? "1" : "0";
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (playing) {
      time += dt * speed;
      if (time >= DURATION) {
        time = DURATION;
        playing = false;
        syncPlay();
      }
    }

    const st = stateAt(time);
    const explodeAmt = 1 - staggerAssemble(time, 0, ASSEMBLE.length);
    Object.keys(meshes).forEach((id, i) => {
      const pose = st.poses[id];
      if (!pose) return;
      const floatZ = explodeAmt > 0.4 ? Math.sin(now * 0.0012 + i) * 10 * explodeAmt : 0;
      apply(meshes[id], pose, floatZ);
    });

    boot.visible = ui.bootOn.checked;
    boot.traverse((ch) => {
      if (ch.material && ch.material.opacity != null && ch !== boot) {
        ch.material.opacity = 0.08 + st.boot * 0.1;
      }
    });

    if (!cam.user) {
      const c = camAt(time);
      cam.theta = c.theta;
      cam.phi = c.phi;
      cam.r = c.r;
      applyCam({ theta: c.theta, phi: c.phi, r: c.r, look: c.look });
    } else {
      applyCam({ theta: cam.theta, phi: cam.phi, r: cam.r, look: camAt(time).look });
    }

    const showLabels = time < 14.5 || ui.labelsOn.checked;
    labels.forEach((lb) => projectLabel(lb.el, meshes[lb.id], showLabels));

    ui.scrub.value = String(Math.round((time / DURATION) * 1000));
    ui.clock.textContent = fmt(time);
    setCaption(time);

    hintT += dt;
    ui.hint.style.opacity = hintT < 6 ? String(0.85 - Math.max(0, hintT - 4) * 0.4) : "0";

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  syncPlay();
  setCaption(0);
  requestAnimationFrame(tick);
})();
