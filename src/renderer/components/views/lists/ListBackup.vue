<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>Saved Lists</v-toolbar-title>
        </v-toolbar>
        <tasks-view id="restore"></tasks-view>
        <v-list>
          <list-backup-table v-bind:lists="lists"></list-backup-table>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Tasks from '@/components/shared/Blocks/TaskView'
  import ListBackupTable from './ListBackupTable'
  export default {
    name: 'list-backup',
    components: {
      'tasks-view': Tasks,
      'list-backup-table': ListBackupTable
    },
    computed: {
      ...mapGetters({
        lists: 'getSavedLists'
      })
    },
    created() {
      this.$store.dispatch('loadSavedLists')
    }
  }
</script>
