import { PerspectiveCamera } from "three";

// Represents the ditance between the origin and the camera
const DEFAULT_CAMERA_DISTANCE = 5;

const MAX_CAMERA_DISTANCE = DEFAULT_CAMERA_DISTANCE;
const MIN_CAMERA_DISTANCE = 1;

const newPerspectiveCamera = (): PerspectiveCamera => {
  const camera = new PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    0.001,
    1200
  );

  camera.position.z = DEFAULT_CAMERA_DISTANCE;
  return camera;
};

interface Position {
  x: number;
  y: number;
  z: number;
}

const distanceRatio = (position: Position): number => {
  return (
    Math.sqrt(
      Math.pow(position.x, 2) +
        Math.pow(position.y, 2) +
        Math.pow(position.z, 2)
    ) / MAX_CAMERA_DISTANCE
  );
};

const distanceScale = (position: Position): number => {
  return Math.min(1, distanceRatio(position));
};

export {
  DEFAULT_CAMERA_DISTANCE,
  MAX_CAMERA_DISTANCE,
  MIN_CAMERA_DISTANCE,
  Position,
  newPerspectiveCamera,
  distanceRatio,
  distanceScale,
};
