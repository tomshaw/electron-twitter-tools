<template>
  <v-card>
    <v-toolbar dark>
      <v-icon>people</v-icon>
      <v-toolbar-title>Friends</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>check_circle</v-icon>
      </v-btn>
    </v-toolbar>
    <user-table :items="items" friends></user-table>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import UserTable from './UserTable'
  export default {
    name: 'user-friends',
    components: {
      'user-table': UserTable
    },
    computed: {
      ...mapGetters({
        items: 'getFriends'
      })
    },
    created () {
      this.$store.dispatch('loadFriends', { name: this.$account.screen_name }).then((resolved, rejected) => {
        if (resolved) {
          console.log('followers-resolved', resolved)
        } else if (rejected) {
          console.log('followers-rejected', rejected)
        }
      })
    }
  }
</script>
