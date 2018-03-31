<template>
  <v-tabs dark slot="extension" slider-color="yellow" v-model="model">

    <v-tab href="#tab1">Home Timeline</v-tab>
    <v-tab href="#tab2">User Timeline</v-tab>
    <v-tab href="#tab3">User Favorites</v-tab>

    <v-tabs-items v-model="model">
      <v-tab-item id="tab1">
        <v-card flat>
          <v-expansion-panel focusable>
            <v-expansion-panel-content value="0">
              <v-card>
                <v-card-text class="grey">
                  <v-form>
                    <status-view :tweets="home" homeTimeline></status-view>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-tab-item>
      <v-tab-item id="tab2">
        <v-card flat>
          <v-expansion-panel focusable>
            <v-expansion-panel-content value="0">
              <v-card>
                <v-card-text class="grey">
                  <v-form>
                    <status-view :tweets="user" homeTimeline></status-view>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-tab-item>
      <v-tab-item id="tab3">
        <v-card flat>
          <v-expansion-panel focusable>
            <v-expansion-panel-content value="0">
              <v-card>
                <v-card-text class="grey">
                  <v-form>
                    <status-view :tweets="favs" homeTimeline></status-view>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
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
        home: 'getStatusHome',
        user: 'getStatusUser',
        favs: 'getStatusFavs'
      }),
      totalTweets() {
        return this.home.length
      }
    },
    data () {
      return {
        model: 'tab1'
      }
    },
    created () {
      this.$store.dispatch('loadStatusHome', {count: 20, include_entities: true}).then((resp) => {
        this.$store.dispatch('streamStatusHome')
      }).catch(error => {
        this.$toastr('error', error[0].message, 'Error Message')
      })
      let options = {screen_name: this.$account.screen_name}
      this.$store.dispatch('loadStatusUser', options).catch(error => {
        this.$toastr('error', error[0].message, 'Error Message')
      })
      this.$store.dispatch('loadStatusFavs', options).catch(error => {
        this.$toastr('error', error[0].message, 'Error Message')
      })
    }
  }
</script>
