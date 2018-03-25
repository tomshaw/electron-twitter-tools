<template>
  <v-card flat>
    <v-card-text>
      <v-dialog v-model="dialog" class="dialog-profile" max-width="500px"> 
        <v-layout>
          <v-flex xs12>
            <v-card>
              <v-card-media :src="userData.background" height="200px"></v-card-media>
              <v-card-media :src="userData.image" class="proimage" height="80px" width="80px"></v-card-media>
              <v-card-title primary-title>
                <div style="margin-bottom: 10px;">
                  <span class="grey--text">{{userData.name}} @{{userData.screen_name}}</span><br>
                  <span>{{userData.location_name}} {{userData.location_country}}</span><br>
                  <span v-if="userData.time_zone">{{userData.time_zone}}</span>
                  <p style="margin-top: 15px;">{{userData.description}}</p>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn small color="success">Follow</v-btn>
                <v-btn small color="warning">Block</v-btn>
                <v-btn small color="error">Mute</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-dialog>
      <div class="google-map" id="map"></div>
    </v-card-text>
  </v-card>
</template>

<script>
  /*global google*/
  import { mapGetters } from 'vuex'
  export default {
    name: 'search-geographic',
    props: ['active'],
    computed: {
      ...mapGetters({
        locations: 'getSearchLocations'
      })
    },
    data () {
      return {
        dialog: false,
        map: null,
        bounds: null,
        markers: [],
        userData: {
          name: '',
          screen_name: '',
          image: '',
          background: '',
          description: '',
          location_name: '',
          location_country: '',
          time_zone: ''
        }/*,
        mapOptions: {
          center: new google.maps.LatLng(45.4555729, 9.169236),
          zoom: 20,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: true,
          mapTypeControl: false,
          panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          scaleControl: false,
          streetViewControl: false,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          }
        }*/
      }
    },
    watch: {
      locations: function (data) {

        // https://stackoverflow.com/questions/46772291/referenceerror-google-is-not-defined-vue
        if (typeof google !== 'object' && typeof google.maps !== 'object') return

        if (!this.map) {
          this.init()
        }

        this.bounds = new google.maps.LatLngBounds()
        //this.init()
        //this.markers = []
        data.forEach(item => {
          if (!item.user) return

          const position = new google.maps.LatLng(item.latitude, item.longitude)

          const marker = new google.maps.Marker({ 
            // animation: google.maps.Animation.DROP,
            position,
            // icon: item.user.avatar,
            title: item.user.name,
            map: this.map
          })
          
          this.markers.unshift(marker)
          
          this.map.fitBounds(this.bounds.extend(position))

          google.maps.event.addListener(marker, 'click', () => {
            this.userData = {
              name: item.user.name,
              screen_name: item.user.screen_name,
              image: item.user.image,
              background: item.user.background,
              description: item.user.description,
              location_name: item.place.full_name,
              location_country: item.place.country,
              time_zone: item.place.time_zone
            }
            this.dialog = true
          })
        })

      }
    },
    created() {
      if (typeof google === 'object' && typeof google.maps === 'object') {
        google.maps.event.addDomListener(window, 'load', this.init)
      }
    },
    methods: {
      init() {
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: new google.maps.LatLng(41.850033, -87.6500523),
          disableDefaultUI: false,
          draggable: true,
          scrollwheel: false,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          navigationControl: true,
          scaleControl: true,
          zoom: 4
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.google-map {
  height: 500px;
  // width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: gray;
}
.proimage {
  width: 80px; 
  height: 80px; 
  position: absolute; 
  top: 125px;
  left: 5px;
  padding: 1px;
  border: 1px solid #000;
  background-color: #fff;

}
</style>
