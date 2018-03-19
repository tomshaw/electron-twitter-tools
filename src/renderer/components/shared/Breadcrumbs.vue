<template>
  <v-breadcrumbs justify-end>
    <v-icon slot="divider">chevron_right</v-icon>
    <v-breadcrumbs-item v-for="(item, i) in items" :key="i" router :to="item.to" exact :disabled="item.disabled"> 
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