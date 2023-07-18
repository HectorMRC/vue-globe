<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import earthmap from "./assets/earthmap.jpg";
import { Shape } from "../src/shape";
import { GeographicPoint } from "../globe-rs/globe_rs";
import { SPHERE_RADIUS } from "../src/geometry";
import { ProjectionCtrl } from "../src/main";

const projection = ref<ProjectionCtrl | undefined>(undefined);
const shape: Shape = { points: [], is_solid: true };

const show_map = ref(false);
const map = computed((): any => {
  if (show_map.value) return earthmap;
  else return undefined;
});

const onDoubleClick = (_payload: MouseEvent, point: GeographicPoint) => {
  point.set_altitude(SPHERE_RADIUS);

  shape.points.push(point);
  projection.value?.updateShape(shape);
};

const backgroundColor = ref(
  getComputedStyle(document.documentElement).getPropertyValue(
    "--color-bg-primary"
  )
);

const wireframeColor = ref(
  getComputedStyle(document.documentElement).getPropertyValue("--color-border")
);

onMounted(() => {
  projection.value?.addShape(shape);
});
</script>

<template>
  <div id="app">
    <spherical-projection
      ref="projection"
      class="background"
      :background-color="backgroundColor"
      :wireframe-color="wireframeColor"
      :map-url="map"
      @dblclick="onDoubleClick"
    />
  </div>
</template>

<style lang="scss">
@import "fibonacci-styles";

* {
  @extend .theme-dark;

  margin: 0;
  padding: 0;
  font-family: "Raleway", Helvetica, Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.background {
  position: absolute;
}
</style>
