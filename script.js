// === Background Stars ===
function createStars() {
  const container = document.querySelector("body");
  for (let i = 0; i < 1000; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.width = ".1px";
    star.style.height = ".1px";
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.position = "absolute";
    star.style.background = "white";
    container.appendChild(star);
  }
}
createStars();

/*function addStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 10000;

  const positions = [];
  for (let i = 0; i < starCount; i++) {
    positions.push(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000
    );
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
}

addStars(); // Call this after creating the scene*/

// === Scene Setup ===
/*const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 80;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);*/

// === Controls ===
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// === Textures ===
const loader = new THREE.TextureLoader();
scene.background = loader.load('textures/stars.jpg');

// === Sun ===
const sunTexture = loader.load('textures/sun.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshBasicMaterial({ map: sunTexture })
);
scene.add(sun);

// === Light ===
const light = new THREE.PointLight(0xffffff, 2, 300);
scene.add(light);



// === Planet Data ===
const planetData = [
  { name: 'Mercury', size: 1, distance: 15, texture: 'mercury.jpg', speed: 0.12},
  { name: 'Venus', size: 1.5, distance: 20, texture: 'venus.jpg', speed: 0.03 },
  { name: 'Earth', size: 2, distance: 26, texture: 'earth.jpg', speed: 0.025 },
  { name: 'Mars', size: 1.6, distance: 32, texture: 'mars.jpg', speed: 0.02 },
  { name: 'Jupiter', size: 3.5, distance: 40, texture: 'jupiter.jpg', speed: 0.015 },
  { name: 'Saturn', size: 3, distance: 48, texture: 'saturn.jpg', speed: 0.013 },
  { name: 'Uranus', size: 2.5, distance: 55, texture: 'uranus.jpg', speed: 0.011 },
  { name: 'Neptune', size: 2.3, distance: 62, texture: 'neptune.jpg', speed: 0.01 }
];

const planets = [];
const speedSettings = {};
const controlsDiv = document.getElementById('speedControls');


// === Planets & Orbits ===
planetData.forEach((data) => {
  const texture = loader.load(`textures/${data.texture}`);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(data.size, 32, 32), material);

  const orbit = new THREE.Object3D();
  orbit.add(sphere);
  sphere.position.x = data.distance;
  scene.add(orbit);

  


  // Visible orbit ring
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  planets.push({ orbit, mesh: sphere, name: data.name });
  speedSettings[data.name] = data.speed;

  // Speed control slider
  const label = document.createElement('label');
  label.innerHTML = `
    ${data.name}: 
    <input type="range" min="0" max="2.0" step="0.01" value="${data.speed}" id="${data.name}Slider">
  `;
  controlsDiv.appendChild(label);

  document.getElementById(`${data.name}Slider`).addEventListener('input', (e) => {
    speedSettings[data.name] = parseFloat(e.target.value);
  });
});

// === Pause/Resume ===
let isPaused = false;
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

// === Animate ===
function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    planets.forEach((planet) => {
      planet.orbit.rotation.y += speedSettings[planet.name];
      planet.mesh.rotation.y += 0.01;
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
