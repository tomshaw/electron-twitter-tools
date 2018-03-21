<template>
  <v-breadcrumbs justify-start class="breadcrumbs grey darken-3">
    <v-icon>home</v-icon>
    <v-breadcrumbs-item v-for="(item, i) in items" :key="i" :to="item.to" :disabled="item.disabled"> 
      {{ item.text }} 
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
  export default {
    name: 'breadcrumbs',
    props: ['page'],
    computed: {
      items () {
        return this.$store.getters.getTrailById(this.page)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .breadcrumbs {
    padding: 8px 12px;
    margin-bottom: 15px;
  }
</style>
