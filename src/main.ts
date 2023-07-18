import { App } from "vue";
import SphericalProjection from "./SphericalProjection.vue";
import init from "../globe-rs/globe_rs";
import { Shape } from "./shape";

await init();

interface ProjectionCtrl {
  addShape: (shape: Shape) => void;
  removeShape: (shape: Shape) => void;
  updateShape: (shape: Shape) => void;
}

function include(app: App): App {
  return app.component("spherical-projection", SphericalProjection);
}

export default include;
export { SphericalProjection, ProjectionCtrl };
