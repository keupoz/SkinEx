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

      <IconButton :class="{ loading, error }" :icon="icon" />
    </form>
    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  props: [ 'lastError', 'loading', 'placeholder' ],

  data () {
    return {
      focused: false,
      value: '',
      error: '',
      timer: undefined
    };
  },

  computed: {
    icon () {
      if (this.loading) return 'sync';
      else if (this.error) return 'error_outline';
      else if (this.focused) return 'check'
      else if (this.value) return 'refresh';
      else return 'block';
    }
  },

  methods: {
    submit () {
      this.value = this.value.replace(/\s*/g, '');

      if (!this.value) return;

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
      this.error = '';

      this.$emit('submit', this.value);
    }
  },

  watch: {
    'lastError' (newVal) {
      this.error = newVal;
      this.timer = setTimeout(() => this.error = '', 5000);
    }
  }
}
</script>
