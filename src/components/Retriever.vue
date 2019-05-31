<template>
  <div class="retriever">
    <form @submit.prevent="submit">
      <input
        :class = "{ empty: !nickname }"

        type    = "text"
        v-model = "nickname"

        autocomplete = "off"
        spellcheck   = "false"
        :placeholder = "placeholder"

        @focus = "focused = true"
        @blur  = "focused = false" />

      <IconButton :class="{ loading, error }" :icon="icon" />
    </form>
    <VCheckbox label="Recursive" :checked="false" @change="recursive = $event" />
    <div class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  props: [ 'lastError', 'loading', 'placeholder' ],

  data () {
    return {
      focused: false,
      nickname: '',
      recursive: false,

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
      this.nickname = this.nickname.replace(/\s*/g, '');

      if (!this.nickname) return;

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
      this.error = '';

      this.$app.retrieveSkin(this.nickname, this.recursive);
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
