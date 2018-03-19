<template>
  <v-toolbar fixed app :clipped-left="clipped">
    <v-toolbar-side-icon @click.native.stop="$emit('toggleDrawer')"></v-toolbar-side-icon>
    <v-btn icon @click.native.stop="$emit('toggleMiniInvariant')">
      <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
    </v-btn>
    <v-btn icon @click.native.stop="$emit('toggleClipped')">
      <v-icon>web</v-icon>
    </v-btn>
    <v-btn icon @click.native.stop="$emit('toggleFixed')">
      <v-icon>remove</v-icon>
    </v-btn>
    <v-toolbar-title v-text="title"></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click.native.stop="$emit('toggleRightDrawer')">
      <v-icon>menu</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
  export default {
    name: 'app-toolbar',
    props: ['miniVariant', 'clipped', 'title']
  }
</script>
