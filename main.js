import './style.css'
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'

const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({

});

renderer.setPixelRatio( devicePixelRatio);
renderer.setSize( innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

//const boxGeometry = new THREE.BoxGeometry(1,1,1);
const geometry = new THREE.PlaneGeometry( 5, 5, 10, 10 );

const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ffff,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading
});

//const mesh = new THREE.Mesh(boxGeometry, material);
const planeMesh = new THREE.Mesh(geometry, planeMaterial)
scene.add(planeMesh);
console.log(planeMesh.geometry.attributes.position);  

const {array} = planeMesh.geometry.attributes.position;
for(let i=0; i<array.length; i+=3)
{
  const x = array[i];
  const y = array[i+1];
  const z = array[i+2];
  
  array[i+2] = z + Math.random();
}

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)


camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //mesh.rotation.x += 0.01;
  //mesh.rotation.y += 0.01;

  
}

animate();



