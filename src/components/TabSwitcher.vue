<template>
  <div class="tab-switcher">
    <div
      class="tab-switcher--tab"
      v-for="tab in tabs"
      :key="tab.name"
      :class="{ selected: current == tab }"
      
      @click="setTab(tab)">{{ tab.label }}</div>
  </div>
</template>

<script>
export default {
  props: [ 'currentTab', 'tabs' ],

  data () {
    return {
      current: this.currentTab
    }
  },

  methods: {
    setTab (tab) {
      this.current = tab;
      this.$emit('change', tab);
    }
  },

  watch: {
    'currentTab' (newVal) {
      this.current = newVal;
    }
  }
}
</script>
