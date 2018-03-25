<template>
  <div>
    <v-navigation-drawer fixed :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" app>
      <v-list dense>

        <v-list-tile v-if="validated" class="user-info">
          <v-list-tile-avatar size="48">
            <img :src="profile.profile_image_url" :alt="profile.name">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="profile.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="profile.description"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader class="mt-3 grey--text text--darken-1">SYSTEM MANAGEMENT</v-subheader>

        <v-list-tile v-for="(item) in items" router exact :to="item.to" :key="item.to" v-if="item.on">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-subheader v-if="false" class="mt-3 grey--text text--darken-1">LATEST MENTIONS</v-subheader>

        <v-list-tile v-for="(item) in mentions" :key="item.picture" avatar v-if="item.active">
          <v-list-tile-avatar>
            <img :src="`https://randomuser.me/api/portraits/men/${item.image}.jpg`" :alt="item.text">
          </v-list-tile-avatar>
          <v-list-tile-title v-text="item.text"></v-list-tile-title>
        </v-list-tile>

        <v-subheader class="mt-3 grey--text text--darken-1">APPLICATION SETTINGS</v-subheader>

        <v-list-tile v-for="(item) in config" router exact :to="item.to" :key="item.to">
          <v-list-tile-action>
            <v-icon color="grey darken-1">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">{{ item.text }}</v-list-tile-title>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer temporary fixed right v-model="rightDrawer" app>
      <v-list>
        <v-list-tile @click.native.stop="$emit('toggleRightDrawer')">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'app-navigation',
    props: ['miniVariant', 'clipped', 'drawer', 'rightDrawer'],
    computed: {
      ...mapGetters({
        validated: 'getAccountValidated',
        profile: 'getTwitterProfile'
      })
    },
    data() {
      return {
        items: [{
          text: 'Welcome',
          icon: 'trending_up',
          to: '/status',
          on: true
        }, {
          text: 'My Friends',
          icon: 'people',
          to: '/user/friends',
          on: true
        }, {
          text: 'My Followers',
          icon: 'people_outline',
          to: '/user/followers',
          on: true
        }, {
          text: 'Twitter Lists',
          icon: 'list',
          to: '/lists',
          on: true
        }, {
          text: 'Status Expunge',
          icon: 'delete_sweep',
          to: '/expunge',
          on: true
        }, {
          text: 'Lookup Users',
          icon: 'recent_actors',
          to: '/lookup',
          on: true
        }, {
          text: 'Search Analytics',
          icon: 'zoom_in',
          to: '/search',
          on: true
        }],
        mentions: [{
          text: 'Joseph',
          image: 28,
          active: false
        }, {
          text: 'Apple',
          image: 38,
          active: false
        }, {
          text: 'Xbox Ahoy',
          image: 48,
          active: false
        }, {
          text: 'Nokia',
          image: 58,
          active: false
        }, {
          text: 'MKBHD',
          image: 78,
          active: false
        }],
        config: [{
          text: 'System Settings',
          icon: 'settings',
          to: '/settings'
        }]
      }
    },
    created() {}, 
    methods: {
      someMethod() {}
    }
  }
</script>

<style scoped>
.user-info {
  margin: 15px 0;
}
</style>
