<template>
  <v-card>
    <v-toolbar dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>User Timeline</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>check_circle</v-icon>
      </v-btn>
    </v-toolbar>
    <status-view :tweets="tweets" userTimeline></status-view>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import StatusView from './StatusView'
  export default {
    name: 'status-home',
    components: {
      'status-view': StatusView
    },
    computed: {
      ...mapGetters({
        tweets: 'getStatusUser'
      }),
      totalTweets() {
        return this.tweets.length
      }
    },
    created () {
      this.$store.dispatch('loadStatusUser')
    }
  }
</script>
