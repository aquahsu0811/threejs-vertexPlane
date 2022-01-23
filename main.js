import './style.css'
import gsap from 'gsap'
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


/* gui */
const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
}

gui.add(world.plane, 'width', 1, 400).onChange(generatePlane);

gui.add(world.plane, 'height', 1, 400).onChange(generatePlane);

gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);

gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);

function generatePlane(){
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments);
  const { array } = planeMesh.geometry.attributes.position;
  for(let i=0; i<array.length; i+=3)
  {
    const x = array[i];
    const y = array[i+1];
    const z = array[i+2];
    
    array[i+2] = z + Math.random();
    array[i+1] = y + Math.random() - 0.5;
    array[i] = x + (Math.random() - 0.5);
  }

  /* roycaster to plane vertex color */
  const colors = [];
  for(let i =0; i< planeMesh.geometry.attributes.position.count; i++){
    colors.push(0, .19,.4); //rgb 
  }
  planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute( new Float32Array(colors), 3)
  )

  /* vertice position randomization */
  const randomValues = [];

  for(let i=0; i<array.length; i++)
  {
    if(i%3==0)
    {
      const x = array[i];
      const y = array[i+1];
      const z = array[i+2];
      
      array[i+2] = z + (Math.random()-0.5)*3 ;
      array[i+1] = y + (Math.random() - 0.5)*2;
      array[i] = x + (Math.random() - 0.5);
    }
    randomValues.push(Math.random()-0.5);
}

planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;
planeMesh.geometry.attributes.position.randomValues = randomValues;

console.log(planeMesh.geometry.attributes.position);
}

/* init */

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({

});

renderer.setPixelRatio( devicePixelRatio);
renderer.setSize( innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement)


/* geometry */
const geometry = new THREE.PlaneGeometry( 
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments );

const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
});

const planeMesh = new THREE.Mesh(geometry, planeMaterial)
scene.add(planeMesh);
console.log(planeMesh.geometry.attributes.position);  

generatePlane();

/* light */
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 1, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)


/* mouse event */

const mouse = {
  x: undefined,
  y: undefined
}

// roycaster
addEventListener('mousemove', (event)=>{
  mouse.x = (event.clientX / innerWidth) *2 - 1;
  mouse.y = -(event.clientY / innerHeight) *2 + 1;
  //console.log(mouse);

})

camera.position.z = 50;

var frame =0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  frame += 0.01;
  const {array, originalPosition, randomValues } = planeMesh.geometry.attributes.position;
  for(let i =0; i <array.length; i+=3)
  {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i] ) *0.003;
    array[i+1] = originalPosition[i+1] + Math.cos(frame + randomValues[i+1] ) *0.003;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if(intersects.length >0)
  {
    //console.log(intersects[0].face.b);
    //console.log(intersects[0].object.geometry.attributes);
    const {color} = intersects[0].object.geometry.attributes;
    //intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 0);



    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    const initialColor = {
      r: 0,
      g: .19,
      b: .4
    }
    const hoverColor = {
      r: 0.1,
      g: .5,
      b: 1
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () =>{
            // vertice 1
        color.setX(intersects[0].face.a, hoverColor.r); //R
        color.setY(intersects[0].face.a, hoverColor.g); //G
        color.setZ(intersects[0].face.a, hoverColor.b); //B


        // vertice 2
        color.setX(intersects[0].face.b, hoverColor.r); //R
        color.setY(intersects[0].face.b, hoverColor.g); //G
        color.setZ(intersects[0].face.b, hoverColor.b); //B


        // vertice 3
        color.setX(intersects[0].face.c, hoverColor.r); //R
        color.setY(intersects[0].face.c, hoverColor.g); //G
        color.setZ(intersects[0].face.c, hoverColor.b); //B

        color.needsUpdate = true;
      }
    })
  }
}

animate();