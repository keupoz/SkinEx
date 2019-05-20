<template>
  <div class="loader">
    <div v-if="$app.lastError" class="loader--error">{{ $app.lastError }}</div>
    <template v-else>
      <div class="loader--icon"></div>
      <div class="loader--message">Loading ...</div>
    </template>
  </div>
</template>
