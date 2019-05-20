<template>
  <div class="vue-colorwheel">
    <label>{{ label }}</label>

    <div class="vue-colorwheel--input">
      <input
        type="text"
        placeholder="Enter color here"

        autocomplete="off"
        spellcheck="false"

        v-model="color"
        @input="colorChange" />

      <div class="vue-colorwheel--preview" :style="{ background: picker.color.css }"></div>
    </div>

    <div class="vue-colorwheel--ouptut" ref="output"></div>
  </div>
</template>

<script>
import ColorWheel from 'colorwheel2/src/ColorWheel.js'

export default {
  props: [ 'label', 'value' ],

  data () {
    let picker = new ColorWheel(null, 256, (eventCode, eventName) => {
      if (eventCode == 3) return;
      if (eventName == 'rotateWheel' && this.picker.color.HSV[1] == 0) return;

      this.color = this.picker.color.getName();

      if (eventCode == 0) this.$emit('start');
      this.$emit('input', this.picker.color.num);
      if (eventCode == 2) this.$emit('end');
    });

    picker.setColor('num', this.value);

    let color = picker.color.getName();

    return { picker, color };
  },

  mounted () {
    this.$refs.output.appendChild(this.picker.domElement);
  },

  methods: {
    colorChange (e) {
      try {
        let value = e.target.value;

        this.picker.setColor('name', value);
        this.$emit('input', this.picker.color.num);
      } catch (e) {}
    }
  },

  watch: {
    value (newVal) {
      this.picker.setColor('num', newVal);
      this.color = this.picker.color.getName();
    }
  }
}
</script>
