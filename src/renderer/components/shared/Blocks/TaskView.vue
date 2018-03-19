<template>
  <v-list v-if="tasks.done >= 0 && id == tasks.id">
    <template>
      <v-list-tile>
        <v-list-tile-content>
          <v-progress-linear :value="tasks.percent" color="pink lighten-1" background-color="pink lighten-3"></v-progress-linear>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </template>
  </v-list>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'progress-view',
    props: ['id'],
    computed: {
      ...mapGetters({
        tasks: 'getTaskProgress'
      })
    }
  }
</script>
