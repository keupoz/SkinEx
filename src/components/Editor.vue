<template>
  <div class="editor">
    <Pixel :pixel="controlPixel" />

    <div v-show="controlPixel.shouldPixelsRender">
      <Pixel v-for="pixel in pixelsList" :key="pixel.name" :pixel="pixel" />
    </div>
  </div>
</template>

<script>
import Pixel from './Pixel.vue'

export default {
  components: { Pixel },

  data () {
    let { controlPixel, pixelsList } = this.$app.pixels;
    pixelsList = pixelsList.slice();
    pixelsList.splice(pixelsList.indexOf(controlPixel), 1);
    return { controlPixel, pixelsList };
  }
}
</script>
