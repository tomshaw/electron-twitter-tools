<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar dark color="teal">
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title class="white--text">Active Lists</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon :loading="loading" :disabled="loading" @click="handleRefresh">
            <v-icon dark>refresh</v-icon>
          </v-btn>
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
    created () {
      this.handleRefresh()
    },
    methods: {
      handleRefresh() {
        this.loader = 'loading'
        this.$store.dispatch('loadActiveLists').then((response) => {
          this.$toastr('success', 'Refreshing active lists.', 'Success')
        })
      }
    }
  }
</script>
