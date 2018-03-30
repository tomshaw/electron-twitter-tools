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
          <v-subheader>General &nbsp;<a @click="handleChangeLink($event)" class="change">change</a></v-subheader>
          <v-list-tile v-for="(item, i) in items" :key="i">
            <v-list-tile-action>
              <v-icon color="pink">star</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title><a :href="item.name" class="change">{{item.name}}</a></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { LOCATION_WOEID_DEFAULT } from '@/config/constants'
  export default {
    name: 'trends-form',
    computed: {
      ...mapGetters({
        items: 'getTrendingPlace'
      })
    },
    data() {
      return {
        'woeid': LOCATION_WOEID_DEFAULT
      }
    },
    created () {

      // this.$store.dispatch('loadTrendsPlace', { id: this.woeid }).then((resp) => {
      //   console.log('loadTrendsPlace', this.items)
      // })

      this.$store.dispatch('loadTrendsClosest', { lat: 37.781157, long: -122.400612831116 }).then((resp) => {
        console.log('loadTrendsClosest', resp)
      })

      // 467 Results
      this.$store.dispatch('loadTrendsAvailable', {}).then((resp) => {
        console.log('loadTrendsAvailable', resp)
      })

      //console.log(this.$store.state.twitter.settings.trend_location)

        console.log(this.$settings.get('twitter.settings'))

      // let countries = this.$getCountries()
      // console.log(countries)

      // let cities = this.$getCities()
      // console.log(cities)
    },
    methods: {
      handleDialogButton() {
        this.$store.commit('TRENDS_MODAL_DIALOG', true)
      },
      handleChangeLink(event) {
        event.preventDefault()
        console.log('here...')
        this.$store.commit('TRENDS_MODAL_DIALOG', true)
      }
    }
  }
</script>

<style lang="scss" scoped>
a.change {
  text-decoration: none;
}
</style>
