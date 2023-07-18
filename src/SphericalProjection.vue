<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
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
import { addAmbientLight } from "./light";
import { newWebGLRenderer } from "./renderer";
import { Shape, getLines, getPoints, getPlane } from "./shape";
import { CartesianPoint, GeographicPoint } from "../globe-rs";
import * as THREE from "three";

const sceneContainer = ref<HTMLDivElement | undefined>(undefined);

interface Props {
  backgroundColor: string;
  wireframeColor: string;
  widthSegments?: number;
  heightSegments?: number;
  mapUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: "#000000",
  wireframeColor: "#00ff00",
  widthSegments: 32,
  heightSegments: 32,
});

interface Events {
  (e: "click", payload: MouseEvent, point: GeographicPoint): void;
  (e: "dblclick", payload: MouseEvent, point: GeographicPoint): void;
}

const emits = defineEmits<Events>();

// Scene
const scene = new THREE.Scene();
addAmbientLight(scene);

// Camera
const camera = newPerspectiveCamera();

// Renderer
const renderer = newWebGLRenderer();
renderer.setClearColor(props.backgroundColor);

const onWindowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

// Create wireframe sphere
const wireframeSphere = newSphere(MIN_CAMERA_DISTANCE + 0.002);
const wireframeMaterial = newWireframeMaterial(props.wireframeColor);
const wireframeMesh = new THREE.Mesh(wireframeSphere, wireframeMaterial);
scene.add(wireframeMesh);

const updateWireframeSphere = () => {
  const scale = distanceScale(camera.position);
  //   const diff = MIN_CONTROL_DISTANCE - MIN_CAMERA_DISTANCE;
  //   wireframeMesh.scale.setScalar(1 + diff * scale);

  if (props.mapUrl) {
    wireframeMaterial.opacity = 0.5 * (1 - scale);
  } else {
    renderer;
    wireframeMaterial.opacity = scale;
  }
};

// Create background sphere
const backgroundSphere = newSphere();
const backgroundMaterial = props.mapUrl
  ? newMapMaterial(props.mapUrl)
  : newPlainMaterial(props.backgroundColor);

const backgroundMesh = new THREE.Mesh(backgroundSphere, backgroundMaterial);
scene.add(backgroundMesh);

// Manage click events
function getGeographicPoint(event: MouseEvent): GeographicPoint | undefined {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const object = wireframeMesh;
  const intersects = raycaster.intersectObject(object);
  if (intersects.length < 1) return;

  const point = object.worldToLocal(intersects[0].point.clone());
  const cartesian = new CartesianPoint(point.x, point.y, point.z);
  const geographic =
    GeographicPoint.from_cartesian(cartesian).with_altitude(SPHERE_RADIUS);

  return geographic;
}

function onDoubleClick(event: MouseEvent) {
  const geographic = getGeographicPoint(event);
  if (geographic) emits("dblclick", event, geographic);
}

function onClick(event: MouseEvent) {
  const geographic = getGeographicPoint(event);
  if (geographic) emits("click", event, geographic);
}

// Define component API
interface ShapeCtrl {
  removeFn: () => void;
}

const allShapes = new Map<Shape, ShapeCtrl>();

const addShape = async (shape: Shape) => {
  const [lines, points] = await Promise.all([
    getLines(shape),
    getPoints(shape),
  ]);

  allShapes.set(shape, {
    removeFn: () => {
      lines.forEach((line) => scene.remove(line));
      scene.remove(points);
    },
  });

  lines.forEach((line) => scene.add(line));
  scene.add(points);
};

const removeShape = async (shape: Shape) => {
  allShapes.get(shape)?.removeFn();
};

const updateShape = async (shape: Shape) => {
  await removeShape(shape);
  await addShape(shape);
};

defineExpose({
  addShape,
  removeShape,
  updateShape,
});

onMounted(() => {
  if (!sceneContainer.value) {
    console.error("scene container not found");
    return;
  }

  window.addEventListener("resize", onWindowResize);
  renderer.domElement.addEventListener("dblclick", onDoubleClick);
  renderer.domElement.addEventListener("click", onClick);

  sceneContainer.value.appendChild(renderer.domElement);

  // Trackball Controls for Camera
  // NOTE: needs renderer.domElement to be present in the DOM
  const controls = newTrackballControls(camera, renderer.domElement);

  // Renderer method
  const rendering = () => {
    requestAnimationFrame(rendering);

    controls.update();
    updateTrackballControls(controls, distanceScale(camera.position));
    updateWireframeSphere();

    renderer.render(scene, camera);
  };

  rendering();
});

onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  renderer.domElement.removeEventListener("dblclick", onDoubleClick);
});
</script>

<template>
  <div ref="sceneContainer"></div>
</template>

<style scoped lang="scss"></style>
