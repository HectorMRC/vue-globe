import { MeshBasicMaterial, MeshLambertMaterial, TextureLoader } from "three";

const newWireframeMaterial = (color: string): MeshLambertMaterial => {
  const material = new MeshLambertMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    combine: 1,
  });

  return material;
};

const newPlainMaterial = (color: string): MeshBasicMaterial => {
  const material = new MeshBasicMaterial({
    color: color,
    transparent: true,
    combine: 1,
  });

  return material;
};

const newMapMaterial = (url: string): MeshBasicMaterial => {
  const material = new MeshBasicMaterial({
    map: new TextureLoader().load(url),
    combine: 1,
  });

  return material;
};

export { newWireframeMaterial, newPlainMaterial, newMapMaterial };
