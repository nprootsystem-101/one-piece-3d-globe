// ============================================================
//  ONE PIECE 3D WORLD GLOBE — Main Application
//  Three.js interactive globe with canonical OP geography
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================================
//  ISLAND & LOCATION DATA
//  Coordinates: lat (N+/S-), lon (E+/W-) mapped onto the OP globe
//  The Red Line runs along lon=0/180 (vertical great circle)
//  The Grand Line runs along lat=0 (equator, horizontal)
// ============================================================

const ISLAND_DATA = [
  // ── REVERSE MOUNTAIN & TWIN CAPE ──
  { name: "Reverse Mountain", nameJP: "リヴァース・マウンテン", lat: 0, lon: 0, region: "redline", type: "landmark",
    desc: "The only entrance to the Grand Line. Water from all four Blues flows upward and converges at the peak before pouring into the Grand Line." },
  { name: "Twin Cape", nameJP: "双子岬", lat: 2, lon: 3, region: "paradise", type: "island",
    desc: "The lighthouse at the entrance of the Grand Line. Home of Crocus and Laboon." },

  // ── GRAND LINE — PARADISE (1st half) ──
  { name: "Whiskey Peak", nameJP: "ウイスキーピーク", lat: 1, lon: 12, region: "paradise", type: "island",
    desc: "A cactus-shaped island populated by bounty hunters of Baroque Works." },
  { name: "Little Garden", nameJP: "リトルガーデン", lat: -1, lon: 22, region: "paradise", type: "island",
    desc: "A prehistoric island where giants Dorry and Brogy have dueled for 100 years." },
  { name: "Drum Island", nameJP: "ドラム島", lat: 4, lon: 32, region: "paradise", type: "island",
    desc: "A winter island and birthplace of Tony Tony Chopper. Now known as Sakura Kingdom." },
  { name: "Alabasta", nameJP: "アラバスタ", lat: -2, lon: 42, region: "paradise", type: "island",
    desc: "A vast desert kingdom ruled by the Nefertari family. Site of the Alabasta Arc." },
  { name: "Jaya", nameJP: "ジャヤ", lat: 1, lon: 52, region: "paradise", type: "island",
    desc: "An island split apart 400 years ago. Part became Skypiea. Home of Mock Town." },
  { name: "Skypiea", nameJP: "スカイピア", lat: 3, lon: 54, region: "paradise", type: "sky",
    desc: "A sky island 10,000 meters above the sea. Formerly ruled by God Enel." },
  { name: "Long Ring Long Land", nameJP: "ロングリングロングランド", lat: -1, lon: 62, region: "paradise", type: "island",
    desc: "A strange island where everything is elongated. Site of the Davy Back Fight." },
  { name: "Water 7", nameJP: "ウォーターセブン", lat: 2, lon: 72, region: "paradise", type: "island",
    desc: "The City of Water — a shipbuilding capital and home of the Galley-La Company." },
  { name: "Enies Lobby", nameJP: "エニエス・ロビー", lat: 3, lon: 76, region: "paradise", type: "landmark",
    desc: "The Judicial Island of the World Government. Also known as the Island of No Night." },
  { name: "Thriller Bark", nameJP: "スリラーバーク", lat: -3, lon: 85, region: "paradise", type: "island",
    desc: "The world's largest pirate ship, operated by Gecko Moria in the Florian Triangle." },
  { name: "Sabaody Archipelago", nameJP: "シャボンディ諸島", lat: 1, lon: 95, region: "paradise", type: "island",
    desc: "An archipelago of giant Yarukiman Mangroves near the Red Line. Gateway to the New World." },

  // ── MARY GEOISE / FISHMAN ISLAND ──
  { name: "Mary Geoise", nameJP: "マリージョア", lat: 0, lon: 180, region: "redline", type: "landmark",
    desc: "The Holy Land atop the Red Line. Seat of the World Government and the Celestial Dragons." },
  { name: "Fishman Island", nameJP: "魚人島", lat: 0, lon: -178, region: "paradise", type: "underwater",
    desc: "Located 10,000m under the sea beneath Mary Geoise. Kingdom of the fishmen and merfolk." },

  // ── GRAND LINE — NEW WORLD (2nd half) ──
  { name: "Punk Hazard", nameJP: "パンクハザード", lat: -2, lon: -170, region: "newworld", type: "island",
    desc: "A devastated island — half fire, half ice. Former research facility of Vegapunk and Caesar Clown." },
  { name: "Dressrosa", nameJP: "ドレスローザ", lat: 2, lon: -158, region: "newworld", type: "island",
    desc: "The Kingdom of Passion, formerly ruled by Donquixote Doflamingo. Known for its living toys." },
  { name: "Zou", nameJP: "ゾウ", lat: 4, lon: -148, region: "newworld", type: "island",
    desc: "A kingdom located on the back of the giant elephant Zunesha, walking the seas for 1000 years." },
  { name: "Whole Cake Island", nameJP: "ホールケーキアイランド", lat: -3, lon: -138, region: "newworld", type: "island",
    desc: "The main island of Totto Land, Big Mom's territory. An edible island made of sweets." },
  { name: "Wano Country", nameJP: "ワノ国", lat: 3, lon: -125, region: "newworld", type: "island",
    desc: "An isolated country inspired by feudal Japan. Formerly under Kaido's rule. Home of samurai." },
  { name: "Egghead", nameJP: "エッグヘッド", lat: -1, lon: -112, region: "newworld", type: "island",
    desc: "The Island of the Future — Dr. Vegapunk's research laboratory. Most technologically advanced place." },
  { name: "Elbaf", nameJP: "エルバフ", lat: 2, lon: -100, region: "newworld", type: "island",
    desc: "The Kingdom of Giants — the strongest nation in the world. A land of warriors." },
  { name: "Hachinosu", nameJP: "海賊島", lat: -4, lon: -90, region: "newworld", type: "island",
    desc: "Pirate Island — formerly Blackbeard's base and stronghold of the Cross Guild." },
  { name: "Laugh Tale", nameJP: "ラフテル", lat: 0, lon: -40, region: "newworld", type: "legendary",
    desc: "The final island of the Grand Line. Only reached by Gol D. Roger. Location of the One Piece." },
  { name: "Lodestar Island", nameJP: "ロードスター島", lat: 1, lon: -55, region: "newworld", type: "island",
    desc: "The final island reachable by following a Log Pose on the Grand Line." },

  // ── EAST BLUE ──
  { name: "Dawn Island", nameJP: "ドーン島", lat: 30, lon: 35, region: "eastblue", type: "island",
    desc: "Home of Foosha Village and Mt. Colubo. Birthplace of Monkey D. Luffy." },
  { name: "Shells Town", nameJP: "シェルズタウン", lat: 22, lon: 50, region: "eastblue", type: "island",
    desc: "Location of the Marine 153rd Branch. Where Luffy met Roronoa Zoro." },
  { name: "Orange Town", nameJP: "オレンジの町", lat: 25, lon: 60, region: "eastblue", type: "island",
    desc: "A small town terrorized by Buggy the Clown." },
  { name: "Baratie", nameJP: "バラティエ", lat: 18, lon: 70, region: "eastblue", type: "island",
    desc: "The floating sea restaurant where Luffy recruited Sanji." },
  { name: "Conomi Islands", nameJP: "コノミ諸島", lat: 28, lon: 75, region: "eastblue", type: "island",
    desc: "Home of Cocoyasi Village and Nami's birthplace. Formerly under Arlong's rule." },
  { name: "Loguetown", nameJP: "ローグタウン", lat: 15, lon: 6, region: "eastblue", type: "island",
    desc: "The Town of the Beginning and the End. Where Gold Roger was born and executed." },

  // ── WEST BLUE ──
  { name: "Ohara", nameJP: "オハラ", lat: 30, lon: -35, region: "westblue", type: "island",
    desc: "An island of scholars destroyed by a Buster Call. Birthplace of Nico Robin." },
  { name: "Ilusia Kingdom", nameJP: "イルシア王国", lat: 38, lon: -55, region: "westblue", type: "island",
    desc: "A kingdom in West Blue and member of the World Government." },
  { name: "Thriller Bark Origin", nameJP: "ウエストブルー", lat: 25, lon: -60, region: "westblue", type: "island",
    desc: "The West Blue homeland where Thriller Bark originally came from." },

  // ── NORTH BLUE ──
  { name: "Lvneel Kingdom", nameJP: "ルブニール王国", lat: -30, lon: -35, region: "northblue", type: "island",
    desc: "A northern kingdom. Home of Mont Blanc Noland, the famous botanical explorer." },
  { name: "Flevance", nameJP: "フレバンス", lat: -35, lon: -50, region: "northblue", type: "island",
    desc: "The White City — destroyed by Amber Lead poisoning. Birthplace of Trafalgar Law." },
  { name: "Swallow Island", nameJP: "スワロー島", lat: -25, lon: -70, region: "northblue", type: "island",
    desc: "An island where the Heart Pirates were formed by Trafalgar Law." },
  { name: "Minion Island", nameJP: "ミニオン島", lat: -28, lon: -65, region: "northblue", type: "island",
    desc: "Location of the Ope Ope no Mi incident with Corazón and Doflamingo." },
  { name: "Germa Kingdom", nameJP: "ジェルマ王国", lat: -32, lon: -45, region: "northblue", type: "island",
    desc: "A mobile seafaring kingdom ruled by the Vinsmoke family, Sanji's origin." },

  // ── SOUTH BLUE ──
  { name: "Briss Kingdom", nameJP: "ブリス王国", lat: -30, lon: 40, region: "southblue", type: "island",
    desc: "A kingdom in South Blue." },
  { name: "Karate Island", nameJP: "カラテ島", lat: -35, lon: 55, region: "southblue", type: "island",
    desc: "An island known for its martial arts culture in South Blue." },
  { name: "Torino Kingdom", nameJP: "トリノ王国", lat: -25, lon: 65, region: "southblue", type: "island",
    desc: "A kingdom with advanced botanical knowledge. Where Chopper trained during the timeskip." },
  { name: "Centaurea", nameJP: "ケンタウレア", lat: -38, lon: 70, region: "southblue", type: "island",
    desc: "An island in South Blue." },
  { name: "Baterilla", nameJP: "バテリラ", lat: -22, lon: 50, region: "southblue", type: "island",
    desc: "Birthplace of Portgas D. Ace. Where Rouge gave birth to him." },

  // ── SPECIAL LOCATIONS ──
  { name: "Impel Down", nameJP: "インペルダウン", lat: -2, lon: 98, region: "paradise", type: "landmark",
    desc: "The great underwater prison of the World Government. Contains six levels of hell." },
  { name: "Marineford", nameJP: "マリンフォード", lat: 2, lon: 100, region: "paradise", type: "landmark",
    desc: "Former Marine Headquarters. Site of the Paramount War — the greatest battle in history." },
  { name: "Kamabakka Kingdom", nameJP: "カマバッカ王国", lat: -4, lon: 88, region: "paradise", type: "island",
    desc: "Ivankov's kingdom. Where Sanji trained during the two-year timeskip." },
  { name: "Baltigo", nameJP: "バルティゴ", lat: 5, lon: -80, region: "newworld", type: "island",
    desc: "Former headquarters of the Revolutionary Army, led by Monkey D. Dragon." },
  { name: "God Valley", nameJP: "ゴッドバレー", lat: -1, lon: -70, region: "newworld", type: "legendary",
    desc: "A mysterious island erased from history. Site of the battle between Rocks Pirates, Garp, and Roger." },
];

// Region colors for markers/labels
const REGION_COLORS = {
  redline:   0xC0392B,
  paradise:  0xFFD700,
  newworld:  0xFF6B35,
  eastblue:  0x2980B9,
  westblue:  0x8E44AD,
  northblue: 0x16A085,
  southblue: 0xE67E22,
};

const REGION_LABELS = {
  eastblue:  "East Blue",
  westblue:  "West Blue",
  northblue: "North Blue",
  southblue: "South Blue",
  paradise:  "Paradise",
  newworld:  "New World",
  redline:   "Red Line",
};

// ============================================================
//  HELPERS
// ============================================================

/** Convert lat/lon (degrees) to 3D position on sphere of given radius */
function latLonToVec3(lat, lon, radius) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
     (radius * Math.cos(phi)),
     (radius * Math.sin(phi) * Math.sin(theta))
  );
}

/** Create a ring of points on the sphere (great circle) */
function createGreatCirclePoints(axis, radius, segments = 256) {
  const points = [];
  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, axis.clone().normalize());
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const p = new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
    p.applyQuaternion(quat);
    points.push(p);
  }
  return points;
}

/** Smooth lerp for camera transitions */
function smoothStep(t) {
  return t * t * (3 - 2 * t);
}

// ============================================================
//  MAIN APPLICATION CLASS
// ============================================================

class OnePieceGlobe {
  constructor() {
    this.GLOBE_RADIUS = 5;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();

    // Groups
    this.globeGroup = new THREE.Group();
    this.islandMarkers = [];
    this.islandMeshes = [];
    this.labelSprites = [];
    this.hoveredIsland = null;
    this.selectedIsland = null;

    // Camera animation
    this.cameraAnimating = false;
    this.cameraStart = new THREE.Vector3();
    this.cameraEnd = new THREE.Vector3();
    this.cameraProgress = 0;
    this.cameraDuration = 1.5;

    // Auto-rotate
    this.autoRotate = true;

    // Init
    this.init();
    this.buildGlobe();
    this.buildRedLine();
    this.buildGrandLine();
    this.buildCalmBelt();
    this.buildIslands();
    this.buildRegionLabels();
    this.buildAtmosphere();
    this.buildStarfield();
    this.setupLighting();
    this.setupEventListeners();
    this.setupSearch();
    this.hideLoadingScreen();
    this.animate();
  }

  // ----------------------------------------------------------
  //  INIT SCENE
  // ----------------------------------------------------------
  init() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 14);

    // Renderer
    const canvas = document.getElementById('globe-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 6.5;
    this.controls.maxDistance = 30;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = 0.5;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.3;

    // Add globe group to scene
    this.scene.add(this.globeGroup);

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  // ----------------------------------------------------------
  //  GLOBE — Ocean Sphere
  // ----------------------------------------------------------
  buildGlobe() {
    const R = this.GLOBE_RADIUS;

    // Ocean sphere with custom shader
    const oceanGeo = new THREE.SphereGeometry(R, 128, 128);
    const oceanMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x0a1628) },
        uColor2: { value: new THREE.Color(0x1a3a5c) },
        uColor3: { value: new THREE.Color(0x0f2845) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        // Simple noise function
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          // Base ocean gradient based on latitude
          float lat = vUv.y;
          vec3 baseColor = mix(uColor1, uColor2, smoothstep(0.3, 0.7, lat));

          // Animated wave pattern
          float n = noise(vUv * 30.0 + uTime * 0.05);
          float n2 = noise(vUv * 60.0 - uTime * 0.03);
          float wave = n * 0.5 + n2 * 0.3;

          vec3 finalColor = mix(baseColor, uColor3, wave * 0.3);

          // Subtle fresnel highlight for depth
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
          fresnel = pow(fresnel, 3.0) * 0.15;
          finalColor += vec3(0.1, 0.2, 0.4) * fresnel;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    this.oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    this.globeGroup.add(this.oceanMesh);

    // Grid lines for visual reference (subtle lat/lon grid)
    this.buildGridLines();
  }

  buildGridLines() {
    const R = this.GLOBE_RADIUS + 0.005;
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x1a3a5c,
      transparent: true,
      opacity: 0.15,
    });

    // Latitude lines every 30 degrees
    for (let lat = -60; lat <= 60; lat += 30) {
      if (lat === 0) continue; // Grand Line will be there
      const phi = (90 - lat) * (Math.PI / 180);
      const r = R * Math.sin(phi);
      const y = R * Math.cos(phi);
      const points = [];
      for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      this.globeGroup.add(new THREE.Line(geo, gridMat));
    }

    // Longitude lines every 30 degrees
    for (let lon = 0; lon < 360; lon += 30) {
      if (lon === 0 || lon === 180) continue; // Red Line will be there
      const points = [];
      for (let i = 0; i <= 128; i++) {
        const phi = (i / 128) * Math.PI;
        const theta = lon * (Math.PI / 180);
        points.push(new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(theta),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(theta)
        ));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      this.globeGroup.add(new THREE.Line(geo, gridMat));
    }
  }

  // ----------------------------------------------------------
  //  RED LINE — Massive ring continent (vertical great circle)
  // ----------------------------------------------------------
  buildRedLine() {
    const R = this.GLOBE_RADIUS;
    const segments = 512;
    const width = 0.12; // angular width in radians
    const height = 0.2;  // how high it sticks out

    // Build a ribbon following lon=0 / lon=180 great circle
    const positions = [];
    const normals = [];
    const indices = [];
    const uvs = [];
    const colors = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const phi = t * Math.PI * 2; // Full circle

      // Center point on the great circle (lon=0 plane → XY plane)
      const cx = Math.cos(phi);
      const cy = Math.sin(phi);

      // Normal pointing outward
      const nx = cx;
      const ny = cy;

      // Create vertices for the ribbon width (perpendicular to the great circle)
      for (let j = 0; j <= 4; j++) {
        const s = (j / 4) * 2 - 1; // -1 to 1
        const offset = s * width;
        const elevation = (1 - Math.abs(s)) * height;

        // Position: on the great circle plane (XY), offset in Z
        const r = R + elevation;
        const px = cx * r;
        const py = cy * r;
        const pz = offset * R;

        positions.push(px, py, pz);
        normals.push(nx, ny, 0);
        uvs.push(t, (j / 4));

        // Color variation — darker in center, lighter at edges
        const darkness = 0.6 + 0.4 * (1 - Math.abs(s));
        // Add noise-like variation
        const noise = 0.85 + 0.15 * Math.sin(phi * 17.3 + s * 5.0);
        const r_col = (0x8B / 255) * darkness * noise;
        const g_col = (0x1A / 255) * darkness * noise;
        const b_col = (0x1A / 255) * darkness * noise;
        colors.push(r_col, g_col, b_col);
      }
    }

    // Build indices for triangle strip
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < 4; j++) {
        const a = i * 5 + j;
        const b = a + 1;
        const c = a + 5;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const redLineMesh = new THREE.Mesh(geo, mat);
    redLineMesh.name = 'RedLine';
    this.globeGroup.add(redLineMesh);

    // Add glow line along the top ridge
    const glowPoints = [];
    for (let i = 0; i <= 256; i++) {
      const phi = (i / 256) * Math.PI * 2;
      const r = R + height;
      glowPoints.push(new THREE.Vector3(Math.cos(phi) * r, Math.sin(phi) * r, 0));
    }
    const glowGeo = new THREE.BufferGeometry().setFromPoints(glowPoints);
    const glowMat = new THREE.LineBasicMaterial({
      color: 0xC0392B,
      transparent: true,
      opacity: 0.4,
    });
    this.globeGroup.add(new THREE.Line(glowGeo, glowMat));
  }

  // ----------------------------------------------------------
  //  GRAND LINE — Glowing golden equatorial ring
  // ----------------------------------------------------------
  buildGrandLine() {
    const R = this.GLOBE_RADIUS + 0.015;

    // Main golden line (thicker)
    const mainPoints = [];
    for (let i = 0; i <= 512; i++) {
      const theta = (i / 512) * Math.PI * 2;
      mainPoints.push(new THREE.Vector3(
        Math.cos(theta) * R,
        0,
        Math.sin(theta) * R
      ));
    }
    const mainGeo = new THREE.BufferGeometry().setFromPoints(mainPoints);
    const mainMat = new THREE.LineBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.9,
    });
    this.globeGroup.add(new THREE.Line(mainGeo, mainMat));

    // Outer glow ring
    const glowR = R + 0.005;
    const glowPoints = [];
    for (let i = 0; i <= 512; i++) {
      const theta = (i / 512) * Math.PI * 2;
      glowPoints.push(new THREE.Vector3(
        Math.cos(theta) * glowR,
        0,
        Math.sin(theta) * glowR
      ));
    }
    const glowGeo = new THREE.BufferGeometry().setFromPoints(glowPoints);
    const glowMat = new THREE.LineBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.25,
    });
    this.globeGroup.add(new THREE.Line(glowGeo, glowMat));

    // Build a thin ribbon to make it more visible
    const ribbonGeo = new THREE.TorusGeometry(R, 0.025, 8, 256);
    const ribbonMat = new THREE.MeshBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.35,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.rotation.x = Math.PI / 2;
    this.globeGroup.add(ribbon);
  }

  // ----------------------------------------------------------
  //  CALM BELT — Two semi-transparent bands flanking Grand Line
  // ----------------------------------------------------------
  buildCalmBelt() {
    const R = this.GLOBE_RADIUS + 0.003;
    const bandAngle = 8; // degrees from equator

    const bandMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x1a2a3a) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          // Diagonal stripe pattern for Calm Belt
          float stripes = sin((vUv.x + vUv.y) * 100.0 + uTime * 0.5) * 0.5 + 0.5;
          stripes = smoothstep(0.3, 0.7, stripes);
          float alpha = 0.25 + stripes * 0.1;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // North Calm Belt
    const northBandGeo = new THREE.RingGeometry(
      R * Math.cos((bandAngle + 5) * Math.PI / 180),
      R * Math.cos(bandAngle * Math.PI / 180),
      128, 1
    );
    const northBand = new THREE.Mesh(northBandGeo, bandMat.clone());
    const northY = R * Math.sin((bandAngle + 2.5) * Math.PI / 180);
    // Instead of RingGeometry, use torus segments for proper wrapping
    this.buildCalmBeltTorus(bandAngle, bandAngle + 5, 0x1a2a3a);
    this.buildCalmBeltTorus(-(bandAngle + 5), -bandAngle, 0x1a2a3a);
  }

  buildCalmBeltTorus(latStart, latEnd, color) {
    const R = this.GLOBE_RADIUS + 0.004;
    const segments = 256;
    const rings = 8;
    const positions = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      for (let j = 0; j <= rings; j++) {
        const lat = latStart + (j / rings) * (latEnd - latStart);
        const phi = (90 - lat) * (Math.PI / 180);
        positions.push(
          R * Math.sin(phi) * Math.cos(theta),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(theta)
        );
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < rings; j++) {
        const a = i * (rings + 1) + j;
        const b = a + 1;
        const c = a + (rings + 1);
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.globeGroup.add(new THREE.Mesh(geo, mat));

    // Edge lines
    for (const lat of [latStart, latEnd]) {
      const pts = [];
      for (let i = 0; i <= 256; i++) {
        const theta = (i / 256) * Math.PI * 2;
        const phi = (90 - lat) * (Math.PI / 180);
        pts.push(new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(theta),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(theta)
        ));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x2a4a6a,
        transparent: true,
        opacity: 0.35,
      });
      this.globeGroup.add(new THREE.Line(lineGeo, lineMat));
    }
  }

  // ----------------------------------------------------------
  //  ISLANDS — 3D Markers
  // ----------------------------------------------------------
  buildIslands() {
    const R = this.GLOBE_RADIUS;

    ISLAND_DATA.forEach((island, idx) => {
      const pos = latLonToVec3(island.lat, island.lon, R + 0.05);
      const color = REGION_COLORS[island.region] || 0x2ECC71;

      // Marker geometry — different shapes for different types
      let markerGeo, markerMat;

      if (island.type === 'landmark') {
        // Diamond shape for landmarks
        markerGeo = new THREE.OctahedronGeometry(0.07, 0);
        markerMat = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.5,
          metalness: 0.3,
          roughness: 0.4,
        });
      } else if (island.type === 'legendary') {
        // Star shape for legendary places
        markerGeo = new THREE.IcosahedronGeometry(0.08, 0);
        markerMat = new THREE.MeshStandardMaterial({
          color: 0xFFD700,
          emissive: 0xFFD700,
          emissiveIntensity: 0.7,
          metalness: 0.5,
          roughness: 0.3,
        });
      } else if (island.type === 'sky') {
        // Elevated marker for sky islands
        markerGeo = new THREE.TetrahedronGeometry(0.06, 0);
        markerMat = new THREE.MeshStandardMaterial({
          color: 0x87CEEB,
          emissive: 0x87CEEB,
          emissiveIntensity: 0.4,
          metalness: 0.2,
          roughness: 0.5,
        });
      } else if (island.type === 'underwater') {
        // Sphere for underwater
        markerGeo = new THREE.SphereGeometry(0.06, 12, 12);
        markerMat = new THREE.MeshStandardMaterial({
          color: 0x00CED1,
          emissive: 0x00CED1,
          emissiveIntensity: 0.5,
          metalness: 0.2,
          roughness: 0.4,
          transparent: true,
          opacity: 0.85,
        });
      } else {
        // Default: small dome for regular islands
        markerGeo = new THREE.SphereGeometry(0.05, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        markerMat = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.3,
          metalness: 0.1,
          roughness: 0.6,
        });
      }

      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.lookAt(new THREE.Vector3(0, 0, 0));
      marker.rotateX(Math.PI / 2);
      marker.userData = { islandIndex: idx, ...island };

      this.globeGroup.add(marker);
      this.islandMarkers.push(marker);
      this.islandMeshes.push(marker);

      // Glow ring around marker
      const ringGeo = new THREE.RingGeometry(0.06, 0.09, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      this.globeGroup.add(ring);

      // Vertical pin line from surface to marker
      const pinStart = latLonToVec3(island.lat, island.lon, R);
      const pinGeo = new THREE.BufferGeometry().setFromPoints([pinStart, pos]);
      const pinMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.35,
      });
      this.globeGroup.add(new THREE.Line(pinGeo, pinMat));
    });
  }

  // ----------------------------------------------------------
  //  REGION LABELS — Sprite text for each Blue/Grand Line zone
  // ----------------------------------------------------------
  buildRegionLabels() {
    const labelPositions = {
      "EAST BLUE":  { lat: 25, lon: 50 },
      "WEST BLUE":  { lat: 25, lon: -50 },
      "NORTH BLUE": { lat: -30, lon: -50 },
      "SOUTH BLUE": { lat: -30, lon: 50 },
      "PARADISE":   { lat: -8, lon: 50 },
      "NEW WORLD":  { lat: -8, lon: -130 },
    };

    Object.entries(labelPositions).forEach(([text, { lat, lon }]) => {
      const sprite = this.createTextSprite(text, {
        fontSize: 42,
        fontFamily: 'Pirata One, cursive',
        color: 'rgba(255, 255, 255, 0.35)',
        strokeColor: 'rgba(0, 0, 0, 0.3)',
        strokeWidth: 2,
      });
      const pos = latLonToVec3(lat, lon, this.GLOBE_RADIUS + 0.3);
      sprite.position.copy(pos);
      sprite.scale.set(2.0, 0.5, 1);
      this.globeGroup.add(sprite);
      this.labelSprites.push(sprite);
    });
  }

  createTextSprite(text, options = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    const fontSize = options.fontSize || 36;
    const fontFamily = options.fontFamily || 'Inter, sans-serif';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Stroke
    if (options.strokeColor) {
      ctx.strokeStyle = options.strokeColor;
      ctx.lineWidth = options.strokeWidth || 3;
      ctx.strokeText(text, 256, 64);
    }

    // Fill
    ctx.fillStyle = options.color || 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      sizeAttenuation: true,
    });

    return new THREE.Sprite(mat);
  }

  // ----------------------------------------------------------
  //  ATMOSPHERE — Fresnel glow
  // ----------------------------------------------------------
  buildAtmosphere() {
    const R = this.GLOBE_RADIUS;
    const atmoGeo = new THREE.SphereGeometry(R * 1.08, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x3a7bd5) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
          fresnel = pow(fresnel, 3.5);
          gl_FragColor = vec4(uColor, fresnel * 0.5);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    });

    this.globeGroup.add(new THREE.Mesh(atmoGeo, atmoMat));
  }

  // ----------------------------------------------------------
  //  STARFIELD
  // ----------------------------------------------------------
  buildStarfield() {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    this.scene.add(new THREE.Points(geo, mat));
  }

  // ----------------------------------------------------------
  //  LIGHTING
  // ----------------------------------------------------------
  setupLighting() {
    // Ambient
    const ambient = new THREE.AmbientLight(0x4488cc, 0.6);
    this.scene.add(ambient);

    // Main directional (sun)
    const sun = new THREE.DirectionalLight(0xffeedd, 1.2);
    sun.position.set(10, 8, 5);
    this.scene.add(sun);

    // Fill light
    const fill = new THREE.DirectionalLight(0x3366aa, 0.4);
    fill.position.set(-5, -3, -8);
    this.scene.add(fill);

    // Point light at Grand Line for golden glow
    const grandLineLight = new THREE.PointLight(0xFFD700, 0.5, 15);
    grandLineLight.position.set(0, 0, 0);
    this.scene.add(grandLineLight);
  }

  // ----------------------------------------------------------
  //  EVENT LISTENERS
  // ----------------------------------------------------------
  setupEventListeners() {
    const canvas = this.renderer.domElement;

    // Mouse move — hover detection
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Click — select island
    canvas.addEventListener('click', (e) => this.onMouseClick(e));

    // Control buttons
    document.getElementById('btn-rotate')?.addEventListener('click', () => this.toggleAutoRotate());
    document.getElementById('btn-reset')?.addEventListener('click', () => this.resetCamera());
    document.getElementById('btn-sidebar')?.addEventListener('click', () => this.toggleSidebar());
    document.getElementById('zoom-in')?.addEventListener('click', () => this.zoom(-1));
    document.getElementById('zoom-out')?.addEventListener('click', () => this.zoom(1));
    document.getElementById('zoom-reset')?.addEventListener('click', () => this.resetCamera());

    // Region chips
    document.querySelectorAll('.region-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const region = e.target.dataset.region;
        this.focusRegion(region);
        // Toggle active state
        document.querySelectorAll('.region-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Info close
    document.getElementById('info-close')?.addEventListener('click', () => this.hideIslandInfo());
  }

  onMouseMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast to islands
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.islandMeshes);

    const tooltip = document.getElementById('hover-tooltip');

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (obj.userData.name) {
        // Highlight
        if (this.hoveredIsland !== obj) {
          this.unhoverIsland();
          this.hoveredIsland = obj;
          obj.scale.set(1.5, 1.5, 1.5);
          this.renderer.domElement.style.cursor = 'pointer';
        }
        // Tooltip
        if (tooltip) {
          tooltip.textContent = obj.userData.name;
          tooltip.style.left = e.clientX + 14 + 'px';
          tooltip.style.top = e.clientY - 14 + 'px';
          tooltip.classList.add('visible');
        }
      }
    } else {
      this.unhoverIsland();
      if (tooltip) tooltip.classList.remove('visible');
      this.renderer.domElement.style.cursor = 'default';
    }
  }

  unhoverIsland() {
    if (this.hoveredIsland) {
      this.hoveredIsland.scale.set(1, 1, 1);
      this.hoveredIsland = null;
    }
  }

  onMouseClick(e) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.islandMeshes);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (obj.userData.name) {
        this.selectIsland(obj.userData.islandIndex);
      }
    }
  }

  // ----------------------------------------------------------
  //  ISLAND SELECTION & INFO POPUP
  // ----------------------------------------------------------
  selectIsland(index) {
    const island = ISLAND_DATA[index];
    if (!island) return;

    this.selectedIsland = index;

    // Update info panel
    const infoEl = document.getElementById('island-info');
    if (infoEl) {
      document.getElementById('info-name').textContent = island.name;
      document.getElementById('info-name-jp').textContent = island.nameJP || '';
      document.getElementById('info-region-text').textContent = REGION_LABELS[island.region] || island.region;
      document.getElementById('info-description').textContent = island.desc;

      const regionDot = document.getElementById('info-region-dot');
      if (regionDot) {
        const color = REGION_COLORS[island.region] || 0x2ECC71;
        regionDot.style.backgroundColor = '#' + color.toString(16).padStart(6, '0');
      }

      infoEl.classList.add('visible');
    }

    // Fly camera to the island
    this.flyToIsland(index);
  }

  hideIslandInfo() {
    const infoEl = document.getElementById('island-info');
    if (infoEl) infoEl.classList.remove('visible');
    this.selectedIsland = null;
  }

  // ----------------------------------------------------------
  //  CAMERA ANIMATIONS
  // ----------------------------------------------------------
  flyToIsland(index) {
    const island = ISLAND_DATA[index];
    if (!island) return;

    const targetPos = latLonToVec3(island.lat, island.lon, this.GLOBE_RADIUS);
    const cameraDistance = 9;

    // Camera target: same direction but further out
    const dir = targetPos.clone().normalize();
    const cameraTarget = dir.multiplyScalar(cameraDistance);

    this.cameraStart.copy(this.camera.position);
    this.cameraEnd.copy(cameraTarget);
    this.cameraProgress = 0;
    this.cameraAnimating = true;

    // Temporarily disable auto-rotate during animation
    this.controls.autoRotate = false;
  }

  resetCamera() {
    this.cameraStart.copy(this.camera.position);
    this.cameraEnd.set(0, 3, 14);
    this.cameraProgress = 0;
    this.cameraAnimating = true;
    this.hideIslandInfo();
  }

  updateCameraAnimation(delta) {
    if (!this.cameraAnimating) return;

    this.cameraProgress += delta / this.cameraDuration;
    if (this.cameraProgress >= 1) {
      this.cameraProgress = 1;
      this.cameraAnimating = false;
      if (this.autoRotate) {
        this.controls.autoRotate = true;
      }
    }

    const t = smoothStep(this.cameraProgress);
    this.camera.position.lerpVectors(this.cameraStart, this.cameraEnd, t);
    this.camera.lookAt(0, 0, 0);
  }

  // ----------------------------------------------------------
  //  CONTROLS
  // ----------------------------------------------------------
  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    this.controls.autoRotate = this.autoRotate;
    const btn = document.getElementById('btn-rotate');
    if (btn) btn.classList.toggle('active', this.autoRotate);
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('collapsed');
  }

  zoom(direction) {
    const factor = direction > 0 ? 1.2 : 0.8;
    const dist = this.camera.position.length();
    const newDist = Math.max(this.controls.minDistance, Math.min(this.controls.maxDistance, dist * factor));
    const dir = this.camera.position.clone().normalize();
    this.camera.position.copy(dir.multiplyScalar(newDist));
  }

  focusRegion(region) {
    const regionCameraMap = {
      all:       { lat: 15, lon: 30, dist: 14 },
      eastblue:  { lat: 25, lon: 50, dist: 10 },
      westblue:  { lat: 25, lon: -50, dist: 10 },
      northblue: { lat: -30, lon: -50, dist: 10 },
      southblue: { lat: -30, lon: 50, dist: 10 },
      paradise:  { lat: 0, lon: 50, dist: 10 },
      newworld:  { lat: 0, lon: -130, dist: 10 },
    };

    const target = regionCameraMap[region] || regionCameraMap.all;
    const pos = latLonToVec3(target.lat, target.lon, target.dist);

    this.cameraStart.copy(this.camera.position);
    this.cameraEnd.copy(pos);
    this.cameraProgress = 0;
    this.cameraAnimating = true;
    this.controls.autoRotate = false;
  }

  // ----------------------------------------------------------
  //  SEARCH
  // ----------------------------------------------------------
  setupSearch() {
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    if (!input || !results) return;

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length < 1) {
        results.classList.remove('active');
        return;
      }

      const matches = ISLAND_DATA
        .map((island, idx) => ({ ...island, idx }))
        .filter(island =>
          island.name.toLowerCase().includes(query) ||
          (island.nameJP && island.nameJP.includes(query)) ||
          (island.region && island.region.toLowerCase().includes(query))
        )
        .slice(0, 10);

      if (matches.length === 0) {
        results.classList.remove('active');
        return;
      }

      results.innerHTML = matches.map(island => {
        const color = REGION_COLORS[island.region] || 0x2ECC71;
        const hexColor = '#' + color.toString(16).padStart(6, '0');
        return `<div class="search-result-item" data-index="${island.idx}">
          <span class="dot" style="background:${hexColor}"></span>
          <span class="name">${island.name}</span>
          <span class="region">${REGION_LABELS[island.region] || ''}</span>
        </div>`;
      }).join('');

      results.classList.add('active');

      // Click handler for results
      results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const idx = parseInt(item.dataset.index);
          this.selectIsland(idx);
          results.classList.remove('active');
          input.value = ISLAND_DATA[idx].name;
        });
      });
    });

    // Close results on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#search-container')) {
        results.classList.remove('active');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        results.classList.remove('active');
        input.blur();
      }
    });
  }

  // ----------------------------------------------------------
  //  LOADING SCREEN
  // ----------------------------------------------------------
  hideLoadingScreen() {
    setTimeout(() => {
      const screen = document.getElementById('loading-screen');
      if (screen) screen.classList.add('fade-out');
    }, 1500);
  }

  // ----------------------------------------------------------
  //  RESIZE
  // ----------------------------------------------------------
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ----------------------------------------------------------
  //  ANIMATION LOOP
  // ----------------------------------------------------------
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Update ocean shader time
    if (this.oceanMesh && this.oceanMesh.material.uniforms) {
      this.oceanMesh.material.uniforms.uTime.value = elapsed;
    }

    // Update camera animation
    this.updateCameraAnimation(delta);

    // Animate island markers (subtle floating)
    this.islandMarkers.forEach((marker, i) => {
      const baseScale = (this.hoveredIsland === marker) ? 1.5 : 1;
      const pulse = 1 + Math.sin(elapsed * 2 + i * 0.5) * 0.05;
      marker.scale.setScalar(baseScale * pulse);
    });

    // Update label opacity based on distance
    this.labelSprites.forEach(sprite => {
      const dist = sprite.position.distanceTo(this.camera.position);
      const opacity = THREE.MathUtils.clamp(1 - (dist - 10) / 15, 0.1, 0.6);
      sprite.material.opacity = opacity;
    });

    // Update controls
    this.controls.update();

    // Position info popup near selected island (screen projection)
    if (this.selectedIsland !== null) {
      const island = ISLAND_DATA[this.selectedIsland];
      if (island) {
        const pos3D = latLonToVec3(island.lat, island.lon, this.GLOBE_RADIUS + 0.1);
        const screenPos = pos3D.clone().project(this.camera);

        // Check if island is facing camera (not on back side)
        const camDir = new THREE.Vector3();
        this.camera.getWorldDirection(camDir);
        const toIsland = pos3D.clone().normalize();
        const dot = camDir.dot(toIsland);

        const infoEl = document.getElementById('island-info');
        if (dot < 0.2 && infoEl) {
          const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
          infoEl.style.left = x + 'px';
          infoEl.style.top = y + 'px';
        }
      }
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  }
}

// ============================================================
//  BOOT
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  try {
    window.globe = new OnePieceGlobe();
  } catch (err) {
    console.error('Globe initialization failed:', err);
    // Force hide loading screen on error
    const ls = document.getElementById('loading-screen');
    if (ls) ls.classList.add('fade-out');
  }
});
