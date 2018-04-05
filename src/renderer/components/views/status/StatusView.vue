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

                <div class="actions">
                  <div class="action-item" @click="handleReply(item.retweeted_status ? item.retweeted_status : item)">
                    <template v-if="userTimeline">
                      <v-icon color="pink" v-if="item.in_reply_to_status_id">chat</v-icon>
                      <v-icon color="grey" v-else>chat_bubble_outline</v-icon>
                    </template>
                    <template v-else>
                      <v-icon color="pink" v-if="item.in_reply_to_status_id">chat</v-icon>
                      <v-icon color="grey" v-else>chat_bubble_outline</v-icon>
                    </template>
                  </div>
                  <div class="action-item" @click="handleRetweet(item)">
                    <v-icon color="pink" v-if="item.retweeted">repeat_one</v-icon>
                    <v-icon color="grey" v-else>repeat</v-icon>
                  </div>
                  <div class="action-item" @click="handleFavorite(item)">
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
  import { mapActions } from 'vuex'
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
        favoriteDestroy: 'favoriteDestroy'
      }),
      handleReply (tweet) {
        if (tweet.in_reply_to_status_id) {
          console.log('statusDestroy', tweet)
          this.statusDestroy(tweet)
        } else {
          console.log('TWEET_FORM_SET_REPLY', tweet)
          this.$store.commit('TWEET_FORM_SET_REPLY', tweet)
        }
      },
      handleRetweet (tweet) {
        console.log('this.$account', this.$account.id_str)
        if (tweet.retweeted) {
          console.log('retweetDestroy', tweet)
          this.retweetDestroy(tweet)
        } else {
          console.log('retweetCreate', tweet)
          this.retweetCreate(tweet)
        }
      },
      handleFavorite (tweet) {
        if (tweet.favorited) {
          console.log('favoriteDestroy', tweet)
          this.favoriteDestroy(tweet)
        } else {
          console.log('favoriteCreate', tweet)
          this.favoriteCreate(tweet)
        }
      }
    }
  }
</script>

<style lang="scss">
.actions {
  margin-top: 10px;
  .action-item {
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
