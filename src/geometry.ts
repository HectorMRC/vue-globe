import { SphereGeometry } from "three";

const SPHERE_RADIUS = 1;
const SPHERE_WIDTH_SEGMENTS = 32;
const SPHERE_HEIGHT_SEGMENTS = 32;

const newSphere = (radius = SPHERE_RADIUS): SphereGeometry => {
  const geometry = new SphereGeometry(
    radius,
    SPHERE_WIDTH_SEGMENTS,
    SPHERE_HEIGHT_SEGMENTS
  );

  return geometry;
};

export {
  SPHERE_RADIUS,
  SPHERE_WIDTH_SEGMENTS,
  SPHERE_HEIGHT_SEGMENTS,
  newSphere,
};
