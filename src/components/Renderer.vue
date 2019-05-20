<template>
  <div class="renderer">
    <div class="renderer--wrapper" :class="{ fullscreen }" ref="output"></div>
    <IconButton :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'" @click.native="toggleFullscreen" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      fullscreen: false
    };
  },

  methods: {
    toggleFullscreen () {
      this.fullscreen = !this.fullscreen;
      this.$nextTick(function () {
        this.$app.renderer.updateSize();
      });
    }
  },

  mounted () {
    this.$refs.output.appendChild(this.$app.renderer.canvas);
    this.$app.renderer.updateSize();
  }
}
</script>
