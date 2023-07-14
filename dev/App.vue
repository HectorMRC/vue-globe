<script setup lang="ts">
import { ref } from "vue";
import map from "./assets/earthmap.jpg";

const backgroundColor = ref(
  getComputedStyle(document.documentElement).getPropertyValue(
    "--color-bg-primary"
  )
);

const wireframeColor = ref(
  getComputedStyle(document.documentElement).getPropertyValue("--color-border")
);
</script>

<template>
  <div id="app">
    <spherical-projection
      :background-color="backgroundColor"
      :wireframe-color="wireframeColor"
    />
    <!-- <spherical-projection
      light-position="front"
      :background-color="backgroundColor"
      :wireframe-color="wireframeColor"
      :map-url="map"
    /> -->
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
</style>
