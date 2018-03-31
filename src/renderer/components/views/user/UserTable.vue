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
    </template>
  </v-data-table>
</template>

<script>
  import { mapActions } from 'vuex'
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
    methods: {
      ...mapActions({
        loadFriends: 'loadFriends',
        loadFollowers: 'loadFollowers',
        friendshipCreate: 'friendshipCreate',
        friendshipDestroy: 'friendshipDestroy',
        blocksCreate: 'blocksCreate',
        blocksDestroy: 'blocksDestroy',
        mutesCreate: 'mutesCreate',
        mutesDestroy: 'mutesDestroy'
      }),
      gridReload() {
        if (this.friends) {
          this.loadFriends({ name: this.$account.screen_name }).then(resp => {
            this.$toastr('success', `A total of ${resp.users.length} friends loaded successfully.`, 'Success Message')
          })
        } else if (this.followers) {
          this.loadFollowers({ name: this.$account.screen_name }).then(resp => {
            this.$toastr('success', `A total of ${resp.users.length} followers loaded successfully.`, 'Success Message')
          })
        }
      }, 
      buttonFollow: function (user, event) {
        const options = { name: this.$account.screen_name, user_id: user.id_str }
        if (user.following) {
          this.friendshipDestroy(options).then((resp) => {
            this.gridReload()
            this.$toastr('success', `User ${resp.name} was successfully unfollowed.`, 'Success Message')
          })
        } else {
          this.friendshipCreate(options).then((resp) => {
            this.gridReload()
            this.$toastr('success', `User ${resp.name} was successfully followed.`, 'Success Message')
          })
        }
        this.gridReload()
      },
      buttonMute: function (user, event) {
        const options = { name: this.$account.screen_name, user_id: user.id_str }
        if (user.muting) {
          this.mutesDestroy(options).then(() => {
            this.gridReload()
            this.$toastr('success', `Adapter ${user.name} was successfully unmuted.`, 'Success Message')
          })
        } else {
          this.mutesCreate(options).then(() => {
            this.gridReload()
            this.$toastr('success', `Adapter ${user.name} was successfully muted.`, 'Success Message')
          })
        }
      },
      buttonBlock: function (user, event) {
        const options = { name: this.$account.screen_name, user_id: user.id_str }
        this.blocksCreate(options).then(() => {
          this.$toastr('success', `Adapter ${user.name} was successfully blocked.`, 'Success Message')
        })
      },
      buttonKick: function (user, event) {
        const options = { name: this.$account.screen_name, user_id: user.id_str }
        this.blocksCreate(options).then(() => {
          this.blocksDestroy(options).then(() => {
            this.$toastr('success', `Adapter ${user.name} was successfully kicked.`, 'Success Message')
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
