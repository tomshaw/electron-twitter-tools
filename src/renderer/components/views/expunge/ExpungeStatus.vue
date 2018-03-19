<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar dark>
          <v-menu offset-y>
            <v-btn color="primary" dark small slot="activator">{{items.length}} {{buttonText}}<v-icon dark right small>dns</v-icon></v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in choices" :key="i" @click="switchType(item, $event)">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <v-btn icon @click="handleRefresh">
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-toolbar-title v-if="type === 'tweets'">{{selectedCount}}/{{tweets.length}} Total</v-toolbar-title>
          <v-toolbar-title v-else>{{selectedCount}}/{{favorites.length}} Total</v-toolbar-title>
        </v-toolbar>
        <tasks-view id="expunge"></tasks-view>
        <v-list>
          <v-card-text>
            <expunge-form :type="type" :items="items"></expunge-form>
          </v-card-text>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import moment from 'moment'
  import Tasks from '@/components/shared/Blocks/TaskView'
  import ExpungeForm from './ExpungeForm'
  export default {
    name: 'expunge-status',
    components: {
      'tasks-view': Tasks,
      'expunge-form': ExpungeForm
    },
    computed: {
      ...mapGetters({
        tweets: 'getExpungeTweets',
        favorites: 'getExpungeFavorites',
        selectedCount: 'getExpungeSelectedCount'
      }),
      items: function () { 
        return this.type === 'tweets' ? this.tweets : this.favorites
      },
      buttonText: function () { 
        return this.type === 'tweets' ? 'Tweets' : 'Favorites'
      }
    },
    data() {
      return {
        type: 'tweets',
        choices: [{ 
          title: 'Tweets',
          value: 'tweets' 
        }, { 
          title: 'Favorites',
          value: 'favorites' 
        }],
        refreshTime: null
      }
    },
    created() {
      const lessThan24HourAgo = (date) => {
        return moment(date).isAfter(moment().subtract(24, 'hours'));
      }

      if (this.refreshTime === null) {
        this.handleRefresh()
      } else {
        if (!lessThan24HourAgo(this.refreshTime)) {
          this.handleRefresh()
        }
      }
    }, 
    methods: {
      ...mapActions(['loadStatuses']),
      switchType(item, event) {
        this.type = item.value
      },
      handleRefresh() {
        this.loadStatuses(this.type).then(() => {
          if (this.type === 'tweets') { 
            this.$toastr('success', `${this.tweets.length} tweets loaded successfully.`, 'Success')
          } else {
            this.$toastr('success', `${this.favorites.length} favorites loaded successfully.`, 'Success')
          }
        })
        this.refreshTime = new Date().getTime()
      }
    }
  }
</script>
