import {
  LineBasicMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PointsMaterial,
  TextureLoader,
} from "three";

const newWireframeMaterial = (color: string): MeshLambertMaterial => {
  return new MeshLambertMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    combine: 1,
  });
};

const newPlainMaterial = (color: string): MeshBasicMaterial => {
  return new MeshBasicMaterial({
    color: color,
    transparent: true,
    combine: 1,
  });
};

const newMapMaterial = (url: string): MeshBasicMaterial => {
  return new MeshBasicMaterial({
    map: new TextureLoader().load(url),
    combine: 1,
  });
};

const newLineBasicMaterial = (color = "#ff00ff"): LineBasicMaterial => {
  return new LineBasicMaterial({
    color: color,
  });
};

const newPointsMaterial = (color = "#ff00ff", size = 10): PointsMaterial => {
  return new PointsMaterial({
    sizeAttenuation: false,
    color: color,
    size: size,
  });
};

export {
  newWireframeMaterial,
  newPlainMaterial,
  newMapMaterial,
  newLineBasicMaterial,
  newPointsMaterial,
};
