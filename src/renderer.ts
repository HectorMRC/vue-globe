import { WebGLRenderer } from "three";

const newWebGLRenderer = () => {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
};

export { newWebGLRenderer };
