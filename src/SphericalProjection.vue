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
import { Mesh, Points, Raycaster, Scene, Vector2 } from "three";
import { Shape, ShapeMaterial } from "./shape";
import { CartesianPoint, GeographicPoint } from "../globe-rs";

const sceneContainer = ref<HTMLDivElement | undefined>(undefined);

interface Props {
  shapes: Array<Shape>;
  backgroundColor: string;
  wireframeColor: string;
  widthSegments?: number;
  heightSegments?: number;
  shapeMaterial?: ShapeMaterial;
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

interface Events {
  (e: "update:shapes", payload: Array<Shape>): void;
}

const emits = defineEmits<Events>();

// Scene
const scene = new Scene();
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
const wireframeSphere = newSphere();
const wireframeMaterial = newWireframeMaterial(props.wireframeColor);
const wireframeMesh = new Mesh(wireframeSphere, wireframeMaterial);
scene.add(wireframeMesh);

const updateWireframeSphere = () => {
  const scale = distanceScale(camera.position);
  const diff = MIN_CONTROL_DISTANCE - MIN_CAMERA_DISTANCE;
  wireframeMesh.scale.setScalar(1 + diff * scale);

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

const backgroundMesh = new Mesh(backgroundSphere, backgroundMaterial);
scene.add(backgroundMesh);

// Manage double click events
const object = wireframeMesh;
const mouse = new Vector2();
const raycaster = new Raycaster();
const points = ref<Points | undefined>(undefined);

function onDoubleClick(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(object);
  if (intersects.length < 1) return;

  const point = object.worldToLocal(intersects[0].point.clone());

  // Normalize cartesian coordinates
  const cartesian = new CartesianPoint(point.x, point.y, point.z);
  const geographic = GeographicPoint.from_cartesian(cartesian);
  geographic.set_altitude(MIN_CAMERA_DISTANCE);

  // Register new point into the shapes model
  const shapes = props.shapes;
  if (shapes.length == 0) {
    shapes.push(new Shape());
  }

  shapes[0].rawPoints.push(geographic);
  shapes[0].draw(scene, props.shapeMaterial);

  emits("update:shapes", shapes);
}

onMounted(() => {
  if (!sceneContainer.value) {
    console.error("scene container not found");
    return;
  }

  window.addEventListener("resize", onWindowResize);
  renderer.domElement.addEventListener("dblclick", onDoubleClick);

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
./pointer ./shape
