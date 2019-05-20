<template>
  <div class="header">
    <span class="app-name" :data-version="$app.version">{{ $app.name }}</span>
    <IconButton icon="folder" @click.native="$app.file.open" />
    <IconButton icon="save"   @click.native="$app.file.save" />
  </div>
</template>
