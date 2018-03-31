<template>
  <v-card>
    <v-toolbar dark>
      <v-icon>people</v-icon>
      <v-toolbar-title>Followers</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :loading="loading" :disabled="loading" @click="handleRefresh">
        <v-icon dark>refresh</v-icon>
      </v-btn>
    </v-toolbar>
    <user-table :items="items" followers></user-table>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import UserTable from './UserTable'
  export default {
    name: 'user-followers',
    components: {
      'user-table': UserTable
    },
    computed: {
      ...mapGetters({
        items: 'getFollowers'
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
        this.$store.dispatch('loadFollowers', { name: this.$account.screen_name }).then(resp => {
          this.$toastr('success', `A total of ${resp.users.length} followers loaded successfully.`, 'Success Message')
        }).catch(error => {
          this.$toastr('error', error[0].message, 'Error Message')
        })
      }
    }
  }
</script>
