<template>
  <v-card>
    <v-toolbar dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Favorites</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>check_circle</v-icon>
      </v-btn>
    </v-toolbar>
    <status-view :tweets="tweets" favsTimeline></status-view>
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
        tweets: 'getStatusFavs'
      }),
      totalTweets() {
        return this.tweets.length
      }
    },
    created () {
      this.$store.dispatch('loadStatusFavs')
    }
  }
</script>
