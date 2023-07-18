import { SphereGeometry } from "three";

const SPHERE_RADIUS = 1;
const SPHERE_SEGMENTS = 32;

const newSphere = (radius = SPHERE_RADIUS): SphereGeometry => {
  return new SphereGeometry(radius, SPHERE_SEGMENTS, SPHERE_SEGMENTS);
};

export { SPHERE_RADIUS, SPHERE_SEGMENTS, newSphere };
