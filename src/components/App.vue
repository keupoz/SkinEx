<template>
  <div class="app" v-if="$app.ready">
    <Header />
    <Renderer />

    <TabSwitcher :currentTab="currentTab" :tabs="tabs" @change="currentTab = $event" />

    <Form v-show="currentTab.name == 'retriever'"
      placeholder = "Enter nickname"

      :lastError = "$app.lastRetrieveError"
      :loading   = "$app.loading"

      @submit="$app.retrieveSkin($event)" />
    
    <Editor v-show="currentTab.name == 'editor'" />
  </div>

  <Loader v-else />
</template>

<script>
import Loader from './Loader.vue'

import Header      from './Header.vue'
import Form        from './Form.vue'
import Editor      from './Editor.vue'
import Renderer    from './Renderer.vue'
import TabSwitcher from './TabSwitcher.vue'

export default {
  components: { Loader, Header, Renderer, TabSwitcher, Form, Editor },

  data () {
    let tabs = [
      { name: 'retriever', label: 'Skin retriever' },
      { name: 'editor',    label: 'Trigger pixels' }
    ];

    return {
      currentTab: tabs[0],
      tabs
    }
  }
}
</script>
