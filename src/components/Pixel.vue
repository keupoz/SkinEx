<template>
  <VSelect v-if="pixel.type == 'COMMON'"
    :label="pixel.label"
    :value="pixel.current"
    :options="pixel.list"

    @change="pixel.set($event, true)" />

  <VSelect v-else-if="pixel.type == 'MASK'"
    :label="pixel.label"
    :value="pixel.selected"
    :options="pixel.list"
    :multiple="true"
    :max="3"

    @select="pixel.select($event.name, true)"
    @unselect="pixel.unselect($event.name, true)" />

  <VRange v-else-if="pixel.type == 'RANGE'"
    :label="pixel.label"
    :minLabel="min.label"
    :maxLabel="max.label"

    :min="min.extra"
    :max="max.extra"

    :value="pixel.current.extra"
    @input="pixel.set($event, true)" />

  <ColorWheel v-else-if="pixel.type == 'COLOR'"
    :label="pixel.label"
    :value="color"

    @start="colorChanging = true"
    @end="colorChanging = false"
    @input="pixel.set($event, true)" />
</template>

<script>
export default {
  props: [ 'pixel' ],

  data () {
    return {
      color: this.pixel.type == 'COLOR' ? this.pixel.getColor() : undefined,
      colorChanging: false
    };
  },

  computed: {
    min () {
      return this.pixel.type == 'RANGE' ? this.pixel.list[0] : null;
    },

    max () {
      return this.pixel.type == 'RANGE' ? this.pixel.list[this.pixel.list.length - 1] : null;
    }
  },

  watch: {
    'pixel.color.num' () {
      if (!this.colorChanging) this.color = this.pixel.getColor();
    }
  }
}
</script>
