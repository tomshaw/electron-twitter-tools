<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>Active Lists</v-toolbar-title>
        </v-toolbar>
        <tasks-view id="save"></tasks-view>
        <v-list>
          <list-online-table v-bind:lists="lists"></list-online-table>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Tasks from '@/components/shared/Blocks/TaskView'
  import ListOnlineTable from './ListOnlineTable'
  export default {
    name: 'list-online',
    components: {
      'tasks-view': Tasks,
      'list-online-table': ListOnlineTable
    },
    computed: {
      ...mapGetters({
        lists: 'getActiveLists'
      })
    },
    created () {
      this.$store.dispatch('loadActiveLists')
    }
  }
</script>
