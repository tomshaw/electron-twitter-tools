<template>
  <v-tabs :scrollable="false" v-model="model" slider-color="yellow" slot="extension">
    <v-tab v-for="(item, i) in items" :key="i" :href="`#tab-${i}`">{{item.name}}</v-tab>
    <v-tabs-items>
      <v-tab-item v-for="(item, i) in items" :key="i" :id="`tab-${i}`">
        <v-card flat>
          <template>
            <v-container grid-list-md text-xs-center class="user-profile">
              <v-layout>
                <v-flex xs12>
                  <v-card>
                    <v-card-media :src="item.profile_background_image_url" height="200px"></v-card-media>
                    <v-card-title primary-title>
                      <div class="headline-copy">
                        <h3 class="headline"><strong>{{item.name}}</strong> <small class="grey--text">@{{item.screen_name}}</small></h3>
                        <p>{{item.description}}</p>
                      </div>
                    </v-card-title>
                    <v-card-actions>
                      <v-container grid-list-md text-xs-center>
                        <v-form>
                          <v-layout row wrap>
                            <v-flex xs11 sm4>
                              <v-text-field label="Location" prepend-icon="person_pin_circle" :value="item.location"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm4>
                              <v-text-field label="Time Zone" prepend-icon="my_location" :value="item.time_zone"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm4>
                              <v-text-field :label="item.created_at | timeAgo" prepend-icon="event" :value="item.created_at"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm4>
                              <v-text-field label="Account Verified" prepend-icon="flag" :value="item.verified"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm4>
                              <v-text-field label="Language" prepend-icon="translate" :value="item.lang"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm4>
                              <v-text-field label="Notifications" prepend-icon="question_answer" :value="item.notifications"></v-text-field>
                            </v-flex>
                            <v-flex xs11 sm2>
                              <v-text-field label="Status Count" prepend-icon="speaker_notes" :value="item.statuses_count"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm2>
                              <v-text-field label="Favourites Count" prepend-icon="favorite" :value="item.favourites_count"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm2>
                              <v-text-field label="Friends Count" prepend-icon="face" :value="item.friends_count"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm2>
                              <v-text-field label="Followers Count" prepend-icon="face" :value="item.followers_count"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs11 sm2>
                              <v-text-field label="Listed Count" prepend-icon="list" :value="item.listed_count"></v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs12>
                              <v-btn v-if="item.following" @click="friendship(item, false, $event)">Unfollow User</v-btn>
                              <v-btn v-else @click="friendship(item, true, $event)">Follow User</v-btn>
                            </v-flex>
                          </v-layout>
                        </v-form>
                      </v-container>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </template>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'lookup-results',
    props: ['items'],
    data () {
      return {
        model: 'tab-0'
      }
    },
    watch: {
      items: function () {
        const items = this.items
        if (items.length) {
          this.model = items[0].screen_name
        }
      }
    },
    methods: {
      ...mapActions(['friendshipCreate', 'friendshipDestroy']),
      friendship(item, action, event) {
        const id = item.id_str
        if (action) {
          this.friendshipCreate(id)
        } else {
          this.friendshipDestroy(id)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.user-profile {
  padding: 0;
  .headline-copy {
    width: 100%;
    text-align: left;
  }
}
</style>
