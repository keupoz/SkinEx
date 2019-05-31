<template>
  <div class="app" v-if="$app.ready">
    <Header />
    <Renderer />
    <Form
      placeholder = "Enter nickname"

      :lastError = "$app.lastRetrieveError"
      :loading   = "$app.loading"

      @submit="$app.retrieveSkin($event)" />
    <Editor />
  </div>

  <Loader v-else />
</template>

<script>
import Loader from './Loader.vue'

import Header   from './Header.vue'
import Form     from './Form.vue'
import Editor   from './Editor.vue'
import Renderer from './Renderer.vue'

export default {
  components: { Loader, Header, Form, Renderer, Editor }
}
</script>
