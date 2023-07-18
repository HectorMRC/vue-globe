import { Camera } from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { MAX_CAMERA_DISTANCE, MIN_CAMERA_DISTANCE } from "./camera";

const MIN_CONTROL_DISTANCE = MIN_CAMERA_DISTANCE + 0.004;

const newTrackballControls = (
  camera: Camera,
  element: HTMLElement
): TrackballControls => {
  const controls = new TrackballControls(camera, element);
  controls.noPan = true;
  controls.minDistance = MIN_CONTROL_DISTANCE;
  controls.maxDistance = MAX_CAMERA_DISTANCE;

  return controls;
};

const updateTrackballControls = (
  controls: TrackballControls,
  scale: number
) => {
  const speed = 1 - Math.sqrt(1 - Math.pow(scale, 2));
  controls.rotateSpeed = speed - 0.02;
  controls.zoomSpeed = speed - 0.01;
};

export { MIN_CONTROL_DISTANCE, newTrackballControls, updateTrackballControls };
