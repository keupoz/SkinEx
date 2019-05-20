<template>
  <div class="form">
    <form @submit.prevent="submit">
      <input
        :class = "{ empty: !value }"

        type    = "text"
        v-model = "value"

        autocomplete = "off"
        spellcheck   = "false"
        :placeholder = "placeholder"

        @focus = "focused = true"
        @blur  = "focused = false" />

      <IconButton :icon="focused ? 'check' : value ? 'refresh' : 'block'" />
    </form>
  </div>
</template>

<script>
export default {
  props: [ 'placeholder' ],

  data () {
    return {
      focused: false,
      value: ''
    };
  },

  methods: {
    submit () {
      this.value = this.value.replace(/\s*/g, '');

      if (!this.value) return;

      this.$emit('submit', this.value);
    }
  }
}
</script>
