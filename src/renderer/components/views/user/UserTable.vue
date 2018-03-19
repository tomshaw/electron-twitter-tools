<template>
  <v-data-table :headers="headers" :items="items" hide-actions item-key="id">
    <template slot="items" slot-scope="props">
      <tr @click="props.expanded = !props.expanded">
        <td class="text-xs-left"> <img class="profile-image" :src="props.item.profile_image_url" :alt="props.item.name"></td>
        <td class="text-xs-left"><h3>{{props.item.name}}</h3></td>
        <td><v-switch v-model="props.item.following" :input-value="props.item.following" @click.native="buttonFollow(props.item, $event)" hide-details></v-switch></td>
        <td class="text-xs-left">{{props.item.friends_count}}</td>
        <td class="text-xs-left">{{props.item.followers_count}}</td>
        <td class="text-xs-left">{{props.item.favourites_count}}</td>
        <td class="text-xs-left">{{props.item.statuses_count}}</td>
        <td class="text-xs-left">
          <v-icon color="yellow darken-2" v-if="props.item.verified">star_border</v-icon>
          <v-icon color="grey lighten-1" v-else>star</v-icon>
        </td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <v-layout row>
        <v-flex xs12>
          <v-card>
            <v-list two-line>
              <template>
                <v-list-tile avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{props.item.name}} <span v-if="props.item.location"> - {{props.item.location}}</span> </v-list-tile-title>
                    <v-list-tile-sub-title style="max-width: 600px;">{{ props.item.description }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>
                      Translator: <span class="blue--text">{{props.item.is_translator}}</span>
                      Time Zone: <span class="blue--text">{{props.item.time_zone}}</span>
                      Geo Enabled: <span class="blue--text">{{props.item.geo_enabled}}</span>
                      Protected: <span class="blue--text">{{props.item.protected}}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-list-tile-action-text style="margin-right: 15px;">{{ props.item.created_at }}</v-list-tile-action-text>
                    <v-card-text>
                      <div class="inline">
                        <v-btn @click.native="buttonFollow(props.item, $event)" v-if="props.item.following" small color="error">Unfollow</v-btn>
                        <v-btn @click.native="buttonFollow(props.item, $event)" v-else small color="primary">Follow</v-btn>
                      </div>
                      <div class="inline">
                        <v-btn @click.native="buttonMute(props.item, $event)" v-if="props.item.muting" small color="primary">Unmute</v-btn>
                        <v-btn @click.native="buttonMute(props.item, $event)" v-else small color="primary">Mute</v-btn>
                      </div>
                      <div class="inline">
                        <v-btn @click.native="buttonBlock(props.item, $event)" small color="green">Block</v-btn>
                      </div>
                      <div class="inline">
                        <v-btn @click.native="buttonKick(props.item, $event)" small color="green">Kick</v-btn>
                      </div>
                    </v-card-text>
                  </v-list-tile-action>

                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </template>
  </v-data-table>
</template>

<script>
  import { mapActions } from 'vuex'
  import Twitter from '@/library/twitter'
  export default {
    name: 'follower-table',
    props: {
      items: {},
      friends: {
        type: Boolean,
        default: false
      },
      followers: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        headers: [
          { text: 'Avatar', align: 'left', sortable: false, value: 'profile_image_url' },
          { text: 'Screen Name', align: 'left', value: 'screen_name' },
          { text: 'Following', align: 'left', value: 'following' },
          { text: 'Friends', align: 'left', value: 'friends_count' },
          { text: 'Followers', align: 'left', value: 'followers_count' },
          { text: 'Favorites', align: 'left', value: 'favourites_count' },
          { text: 'Statuses', align: 'left', value: 'statuses_count' },
          { text: 'Verified', align: 'left', value: 'verified' }
        ]
      }
    },
    created() {
      this.client = new Twitter(this.$settings.get('twitter.tokens'))
      this.account = this.$settings.get('twitter.profile')
    },
    methods: {
      ...mapActions({
        loadFriends: 'loadFriends',
        loadFollowers: 'loadFollowers',
        friendshipCreate: 'friendshipCreate',
        friendshipDestroy: 'friendshipDestroy'
      }),
      gridReload() {
        if (this.friends) {
          this.loadFriends()
        } else if (this.followers) {
          this.loadFollowers()
        }
      }, 
      buttonFollow: function (user, event) {
        if (user.following) {
          this.friendshipDestroy(user.id_str)
        } else {
          this.friendshipCreate(user.id_str)
        }
        this.gridReload()
      },
      buttonMute: function (user, event) {
        const options = { name: this.account.screen_name, user_id: user.id_str }
        if (user.muting) {
          this.client.mutesDestroy(options, response => {
            this.gridReload()
          })
        } else {
          this.client.mutesCreate(options, response => {
            this.gridReload()
          })
        }
      },
      buttonBlock: function (user, event) {
        const options = { name: this.account.screen_name, user_id: user.id_str }
        this.client.blocksCreate(options, response => {
          this.friendshipDestroy(user.id_str)
        })
      },
      buttonKick: function (user, event) {
        const options = { name: this.account.screen_name, user_id: user.id_str }
        this.client.blocksCreate(options, response => {
          this.client.blocksDestroy(options, response => {
            this.friendshipDestroy(user.id_str) 
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.datatable__expand-row tr td {
  height: 100px !important;
}
i.material-icons {
  display: inline-block !important;
  cursor: pointer
}
.inline {
  display: inline-block;
}
</style>
