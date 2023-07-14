<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import {
  MIN_CONTROL_DISTANCE,
  newTrackballControls,
  updateTrackballControls,
} from "./controls";
import {
  MIN_CAMERA_DISTANCE,
  distanceScale,
  newPerspectiveCamera,
} from "./camera";
import { SPHERE_RADIUS, newSphere } from "./geometry";
import {
  newMapMaterial,
  newPlainMaterial,
  newWireframeMaterial,
} from "./material";

const sceneContainer = ref<HTMLDivElement | undefined>(undefined);

interface Props {
  backgroundColor: string;
  wireframeColor: string;
  widthSegments?: number;
  heightSegments?: number;
  radius?: number;
  mapUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: "#000000",
  wireframeColor: "#00ff00",
  widthSegments: 32,
  heightSegments: 32,
  radius: 1,
});

// Scene
const scene = new THREE.Scene();
const camera = newPerspectiveCamera();

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(props.backgroundColor);
renderer.setSize(window.innerWidth, window.innerHeight);

// Make Canvas Responsive
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Create wireframe sphere
const sphere_1 = newSphere(SPHERE_RADIUS);
const wireframe = newWireframeMaterial(props.wireframeColor);
const mesh_1 = new THREE.Mesh(sphere_1, wireframe);
scene.add(mesh_1);

const updateWireframeSphere = () => {
  const scale = distanceScale(camera.position);
  const diff = MIN_CONTROL_DISTANCE - MIN_CAMERA_DISTANCE;
  mesh_1.scale.setScalar(1 + diff * scale);

  if (props.mapUrl) {
    wireframe.opacity = 0.5 * (1 - scale);
  } else {
    wireframe.opacity = scale;
  }
};

// Create plain sphere
const sphere_2 = newSphere();
const plain = props.mapUrl
  ? newMapMaterial(props.mapUrl)
  : newPlainMaterial(props.backgroundColor);

const mesh_2 = new THREE.Mesh(sphere_2, plain);
mesh_2.rotateY(-Math.PI / 2); // align meridians
scene.add(mesh_2);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

onMounted(() => {
  if (!sceneContainer.value) {
    console.error("scene container not found");
    return;
  }

  // Inject renderer.domElement into the DOM
  sceneContainer.value.appendChild(renderer.domElement);

  // Trackball Controls for Camera
  // NOTE: needs renderer.domElement to be present in the DOM
  const controls = newTrackballControls(camera, renderer.domElement);

  // Renderer method
  const rendering = function () {
    requestAnimationFrame(rendering);

    controls.update();
    updateTrackballControls(controls, distanceScale(camera.position));
    updateWireframeSphere();

    renderer.render(scene, camera);
  };

  rendering();
});
</script>

<template>
  <div ref="sceneContainer"></div>
</template>

<style scoped lang="scss"></style>
