<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>    
        <v-toolbar dark color="teal">
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title class="white--text">Saved Lists</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon :loading="loading" :disabled="loading" @click="handleRefresh">
            <v-icon dark>refresh</v-icon>
          </v-btn>
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
    watch: {
      loader () {
        const loader = this.loader
        this[loader] = !this[loader]
        setTimeout(() => {
          this[loader] = false
        }, 3000)
        this.loader = null
      }
    },
    data () {
      return {
        loader: null,
        loading: false
      }
    },
    created() {
      this.handleRefresh()
    },
    methods: {
      handleRefresh() {
        this.loader = 'loading'
        this.$store.dispatch('loadSavedLists').then((response) => {
          this.$toastr('success', 'Refreshing saved lists.', 'Success')
        })
      }
    }
  }
</script>
