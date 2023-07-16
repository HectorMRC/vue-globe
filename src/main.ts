import { App } from "vue";
import SphericalProjection from "./SphericalProjection.vue";
import init from "../globe-rs/globe_rs";

await init();

function include(app: App): App {
  return app.component("spherical-projection", SphericalProjection);
}

export default include;
export { SphericalProjection };
