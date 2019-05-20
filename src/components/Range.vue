<template>
  <div class="vue-range">
    <label>{{ label }}</label>

    <div class="vue-range--wrapper">
      <div
        class="vue-range--track"
        ref="track"
        @mousedown="dragStart"
        @touchstart="dragStart">

        <div v-if="minLabel || maxLabel" class="vue-range--labels">
          <label v-if="minLabel">{{ minLabel }}</label>
          <label v-if="maxLabel">{{ maxLabel }}</label>
        </div>

        <div class="vue-range--fill" :style="{ width: percentage }">
          <div class="vue-range--thumb" ref="thumb"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    minLabel: String,
    maxLabel: String,

    min: {
      type: [ Number, String ],
      default: 0
    },
    max: {
      type: [ Number, String ],
      default: 100
    },
    step: {
      type: [ Number, String ],
      default: 1
    },
    value: {
      type: [ Number, String ],
      default: 50
    }
  },

  data () {
    return {
      dragBound:    this.drag.bind(this),
      dragEndBound: this.dragEnd.bind(this),

      val: this.value
    };
  },

  computed: {
    nmin () {
      return +this.min;
    },

    nmax () {
      return Math.floor((this.max - this.nmin) / this.step) * this.step + this.nmin;
    },

    range () {
      return this.nmax - this.nmin;
    },

    percentage () {
      return (this.val - this.nmin) / this.range * 100 + '%';
    }
  },

  methods: {
    dragStart (e) {
      if (e.type == 'mousedown') {
        document.body.addEventListener('mousemove', this.dragBound);
        document.body.addEventListener('mouseup',   this.dragEndBound);
      } else {
        document.body.addEventListener('touchmove', this.dragBound);
        document.body.addEventListener('touchend',  this.dragEndBound);
      }

      if (e.target !== this.$refs.thumb) this.drag(e);
    },

    drag (e) {
      let { clientX: x } = e.changedTouches ? e.changedTouches[0] : e,
          bounds = this.$refs.track.getBoundingClientRect();

      x -= bounds.left;
      this.setValue(x / bounds.width * this.range + this.nmin);
      this.$emit('input', this.val);
    },

    dragEnd () {
      this.$emit('change', this.val);

      document.body.removeEventListener('mousemove', this.dragBound);
      document.body.removeEventListener('touchmove', this.dragBound);
      document.body.removeEventListener('mouseup',   this.dragEndBound);
      document.body.removeEventListener('touchend',  this.dragEndBound);
    },

    // https://github.com/ktsn/vue-range-slider/blob/master/src/utils.js
    setValue (value) {
      if (value < this.nmin) this.val = this.nmin;
      else if (value > this.nmax) this.val = this.nmax;
      else {
        let normalize = (value - this.nmin) / this.step,
            decimal   = Math.floor(normalize),
            fraction  = normalize - decimal;

        if (!fraction) this.val = value;
        else if (fraction < 0.5)
          this.val = this.step * decimal + this.nmin;
        else
          this.val = this.step * (decimal + 1) + this.nmin
      }
    }
  },

  watch: {
    value (newVal) {
      this.val = newVal;
    }
  }
}
</script>
