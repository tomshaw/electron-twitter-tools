<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap v-for="(item, index) in tweets" :key="index">
      <v-flex xs12>
        <v-card dark>
          <v-card-text class="px-0">
            <v-layout row wrap>
              <v-flex xs1>
                <img class="profile-image" v-if="item.retweeted_status" v-bind:src="item.retweeted_status.user.profile_image_url"/>
                <img class="profile-image" v-else v-bind:src="item.user.profile_image_url"/>
              </v-flex>
              <v-flex xs11 text-xs-left>
                <span class="twitter-time">{{ item.created_at | timeAgo }}</span>

                <div v-if="item.retweeted_status">
                  <span><v-icon color="grey">repeat_one</v-icon></span>
                  <span style="color: #9d9d9d;">@{{ item.user.name }} Retweeted</span>
                </div>
                <div v-else>
                  <strong style="color: #9d9d9d; margin-left: 5px;">{{ item.user.name }}</strong> 
                  <span style="color: #9d9d9d;">@{{ item.user.screen_name }}</span>
                </div>

                <text-entities v-if="item.retweeted_status" :tweet="item.retweeted_status" text media></text-entities>
                <text-entities v-else :tweet="item" text media></text-entities> 
                <div class="meta">

                  <div class="action" @click="handleReply(item.retweeted_status ? item.retweeted_status : item)">
                    <template v-if="userTimeline">
                      <v-icon color="pink" v-if="item.in_reply_to_status_id">chat</v-icon>
                      <v-icon color="grey" v-else>chat_bubble_outline</v-icon>
                    </template>
                    <template v-else>
                      <v-icon color="pink" v-if="item.in_reply_to_status_id">chat</v-icon>
                      <v-icon color="grey" v-else>chat_bubble_outline</v-icon>
                    </template>
                  </div>

                  <div class="action" @click="handleRetweet(item)">
                    <v-icon color="pink" v-if="item.retweeted">repeat_one</v-icon>
                    <v-icon color="grey" v-else>repeat</v-icon>
                  </div>

                  <div class="action" @click="handleFavorite(item)">
                    <v-icon color="pink" v-if="item.favorited">favorite</v-icon>
                    <v-icon color="grey" v-else>favorite_border</v-icon>
                  </div>

                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex'
  import TextEntities from '@/components/shared/Miscellaneous/TextEntities'
  export default {
    name: 'status-view',
    props: {
      tweets: {},
      homeTimeline: {
        type: Boolean,
        default: false
      },
      userTimeline: {
        type: Boolean,
        default: false
      },
      favsTimeline: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'text-entities': TextEntities
    },
    methods: {
      ...mapActions({
        statusDestroy: 'statusDestroy',
        retweetCreate: 'retweetCreate',
        retweetDestroy: 'retweetDestroy',
        favoriteCreate: 'favoriteCreate',
        favoriteDestroy: 'favoriteDestroy',
        setFavoritesCount: 'setFavoritesCount'
      }),
      ...mapMutations({
        setReply: 'TWEET_FORM_SET_REPLY'
      }),
      handleReply (tweet) {
        if (tweet.in_reply_to_status_id) {
          this.statusDestroy(tweet).then(response => {
            console.log('destroy', response)
          }, error => {
            console.log(error)
          })
        } else {
          this.setReply(tweet)
        }
      },
      handleRetweet (tweet) {
        if (tweet.retweeted) {
          this.retweetDestroy(tweet).then(response => {
            console.log('destroy', response)
          }, error => {
            console.log(error)
          })
        } else {
          this.retweetCreate(tweet).then(response => {
            console.log('create', response)
          }, error => {
            console.log(error)
          })
        }
      },
      handleFavorite (tweet) {
        if (tweet.favorited) {
          this.favoriteDestroy(tweet).then(response => {
            this.setFavoritesCount({type: 'decrement'})
          }, error => {
            console.log(error)
          })
        } else {
          this.favoriteCreate(tweet).then(response => {
            this.setFavoritesCount({type: 'increment'})
          }, error => {
            console.log(error)
          })
        }
      }
    }
  }
</script>

<style lang="scss">
.meta {
  margin-top: 10px;
  .action {
    display: inline-block;
    cursor: pointer;
  }
}
.twitter-time {
  position: absolute; 
  top: 0; 
  right: 0; 
  font-size: 13px; 
  padding: 5px 10px;
}
</style>
