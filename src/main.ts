import { App } from "vue";
import SphericalProjection from "./SphericalProjection.vue";

function include(app: App): App {
  return app.component("spherical-projection", SphericalProjection);
}

export default include;
export { SphericalProjection };
