<template>
  <v-card>
    <v-toolbar dark>
      <v-list-tile-avatar>
        <img :src="profile.profile_image_url" :alt="profile.screen_name">
      </v-list-tile-avatar>
      <v-toolbar-title>{{profile.name}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :loading="loading" :disabled="loading" @click="handleRefresh">
        <v-icon dark>refresh</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list two-line dark>
      <template v-for="(item, i) in items">
        <v-subheader v-if="item.header" v-text="item.header" v-bind:key="i"></v-subheader>
        <v-divider v-else-if="item.divider" inset v-bind:key="i"></v-divider>
        <v-list-tile avatar v-else v-bind:key="item.title">
          <v-list-tile-avatar>
            <v-icon large color="blue darken-2">{{item.avatar}}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-card>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: 'profile-view',
    computed: {
      ...mapGetters({
        profile: 'getTwitterProfile'
      })
    },
    data () {
      return {
        items: [],
        loader: null,
        loading: false
      }
    },
    watch: {
      profile: function (data) {
        this.buildArray(data)
      },
      loader () {
        const loader = this.loader
        this[loader] = !this[loader]
        setTimeout(() => {
          this[loader] = false
        }, 3000)
        this.loader = null
      }
    },
    created () {
      this.buildArray(this.profile)
    },
    methods: {
      ...mapActions(['loadProfile']),
      handleRefresh() {
        this.loader = 'loading'
        setTimeout(() => {
          this.loadProfile().then(() => {
            this.$toastr('success', 'System profile updated successfully.', 'Success')
          })
        }, 1e3)
      },
      buildArray: function (data) {
        this.items = [{
            header: 'Profile Information'
          }, {
            avatar: 'people',
            title: 'Followers',
            subtitle: `<span class="grey--text text--lighten-2">Total followers:</span> ${data.followers_count}`
          }, {
            divider: true,
            inset: true
          }, {
            avatar: 'person',
            title: 'Friends',
            subtitle: `<span class="grey--text text--lighten-2">Total friends:</span> ${data.friends_count}`
          }, {
            divider: true,
            inset: true
          }, {
            avatar: 'chats',
            title: 'Tweets',
            subtitle: `<span class="grey--text text--lighten-2">Total tweets:</span> ${data.statuses_count}`
          }, {
            divider: true,
            inset: true
          }, {
            avatar: 'favorite',
            title: 'Favorites',
            subtitle: `<span class="grey--text text--lighten-2">Total favorites:</span> ${data.favourites_count}`
          }]
      }
    }
  }
</script>
