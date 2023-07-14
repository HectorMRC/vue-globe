import { AmbientLight, Scene } from "three";

const addAmbientLight = (scene: Scene) => {
  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
};

export { addAmbientLight };
