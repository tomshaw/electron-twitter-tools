<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar color="teal" dark>
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title>Trending</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="handleDialogButton">
            <v-icon>search</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list subheader>
          <v-subheader>General &nbsp;<a href="#change" style="text-decoration:none;">change</a></v-subheader>
          <v-list-tile v-for="(item, i) in items" :key="i">
            <v-list-tile-action>
              <v-icon color="pink">star</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.name}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'trends-form',
    computed: {
      ...mapGetters({
        items: 'getTrendingPlace'
      })
    },
    data() {
      return {
        'woeid': 2477058
      }
    },
    created () {
      this.$store.dispatch('loadTrendsPlace', { id: this.woeid })
    },
    methods: {
      handleDialogButton() {
        this.$store.commit('TRENDS_MODAL_DIALOG', true)
      }
    }
  }
</script>
