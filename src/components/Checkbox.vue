<template>
  <div class="vue-checkbox">
    <input
      type="checkbox"
      hidden

      ref="input"
      :id="id"
      :checked="lchecked"
      
      @change="update" />

    <div
      class="vue-checkbox--icon material-icons"
      :class="{ checked: lchecked }">check</div>

    <label :for="id">{{ label }}</label>
  </div>
</template>

<script>
let lastID = 0;

export default {
  props: [ 'checked', 'label' ],

  data () {
    return {
      id: '',
      lchecked: this.checked
    }
  },

  created () {
    this.id = 'vue-checkbox-' + ++lastID;
  },

  methods: {
    update () {
      this.lchecked = this.$refs.input.checked;
      this.$emit('change', this.lchecked);
    }
  },

  watch: {
    'checked' (newVal) {
      this.lchecked = newVal;
    }
  }
}
</script>
