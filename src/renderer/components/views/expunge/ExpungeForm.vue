<template>
  <v-form v-model="valid" ref="form" lazy-validation>

    <v-layout row wrap>
      <v-flex xs11 sm5>
        <v-text-field label="Include Words" v-model="keywords.include" @change="onChange" :counter="30" prepend-icon="font_download" required></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs11 sm5> 
        <v-text-field label="Exclude Words" v-model="keywords.exclude" @change="onChange" :counter="30" prepend-icon="font_download" required></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs11 sm5>
        <v-select label="Retweets" v-model="includeRetweets" @change="onChange" :items="includeRetweetsOptions" prepend-icon="cached" required></v-select>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs11 sm5> 
        <v-select label="Excluded Media" v-model="excludeContent" @change="onChange" :items="excludeContentOptions" prepend-icon="important_devices" required></v-select>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs11 sm5>
        <v-menu ref="start_menu" lazy :close-on-content-click="true" v-model="start_menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px">
          <v-text-field slot="activator" label="Starting Date" v-model="start_date" prepend-icon="event" readonly></v-text-field>
          <v-date-picker v-model="start_date" @change="onChange" :allowed-dates="allowedDates" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="start_menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.start_menu.save(start_date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs11 sm5>
        <v-menu ref="end_menu" lazy :close-on-content-click="true" v-model="end_menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px">
          <v-text-field slot="activator" label="Ending Date" v-model="end_date" prepend-icon="event" readonly></v-text-field>
          <v-date-picker v-model="end_date" @change="onChange" :allowed-dates="allowedDates" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="end_menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.end_menu.save(end_date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs11 sm5>
        <v-menu ref="start_time_menu" lazy :close-on-content-click="false" v-model="start_time_menu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px">
          <v-text-field slot="activator" label="Starting Time" v-model="start_time" prepend-icon="access_time" readonly></v-text-field>
          <v-time-picker v-model="start_time" @change="onChange"></v-time-picker>
        </v-menu>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs11 sm5>
        <v-menu ref="end_time_menu" lazy :close-on-content-click="false" v-model="end_time_menu" transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px">
          <v-text-field slot="activator" label="Ending Time" v-model="end_time" prepend-icon="access_time" readonly></v-text-field>
          <v-time-picker v-model="end_time" @change="onChange"></v-time-picker>
        </v-menu>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12>
        <v-btn @click="submit" :disabled="!valid">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
      </v-flex>
    </v-layout>

  </v-form>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex'
  import moment from 'moment'
  import {convertTo24Hour} from '@/config/helpers'
  export default {
    name: 'expunge-form',
    props: ['type', 'items'],
    data: () => ({
      valid: true,
      keywords: {
        include: '',
        exclude: ''
      },
      includeRetweets: null,
      includeRetweetsOptions: [{ 
        text: 'Include',
        value: 'include' 
      }, { 
        text: 'Exclude',
        value: 'exclude' 
      }],
      excludeContent: null,
      excludeContentOptions: [{ 
        text: 'Images',
        value: 'images' 
      }, { 
        text: 'Videos',
        value: 'videos' 
      }, { 
        text: 'Links',
        value: 'links' 
      }],
      statusDates: [],
      start_date: null,
      start_menu: false,
      start_modal: false,
      end_date: null,
      end_menu: false,
      end_modal: false,
      start_time: null,
      start_time_menu: false,
      start_time_modal: false,
      end_time: null,
      end_time_menu: false,
      end_time_modal: false,
      interval: null
    }),
    watch: {
      items: function (newData, oldData) {
        if (newData.length) {
          this.mapDates(newData)
        }
      }
    },
    methods: {
      ...mapActions(['expungeTweet', 'expungeFavorite']),
      ...mapMutations({
        setProgress: 'TASKS_SET_PROGRESS',
        resetProgress: 'TASKS_RESET_PROGRESS',
        setStatusesCount: 'TWITTER_SET_STATUSES_COUNT',
        setFavoritesCount: 'TWITTER_SET_FAVORITES_COUNT',
        setSelected: 'EXPUNGE_SET_SELECTED',
        resetSelected: 'EXPUNGE_RESET_SELECTED'
      }),
      onChange() {
        if (this.$refs.form.validate()) {
          this.preBuild()
        }
      },
      submit () {
        if (this.$refs.form.validate()) {
          this.preBuild()
          let type = this.type
          let selected = this.$store.getters.getExpungeSelectedItems
          if (selected.length) {
            this.process(type, selected)
          }
        }
      },
      clear () {
        this.$refs.form.reset()
        this.resetSelected()
      },
      criteria() {
        const keywords = this.keywords
        const includeRetweets = this.includeRetweets
        const excludeContent = this.excludeContent
        const startDate = new Date(this.start_date).getTime()
        const endDate = new Date(this.end_date).getTime()
        const startTime = (this.start_time !== null) ? convertTo24Hour(this.start_time) : false
        const endTime = (this.end_time !== null) ? convertTo24Hour(this.end_time) : false 
        return {
          keywords,
          includeRetweets,
          excludeContent,
          startDate,
          endDate,
          startTime,
          endTime
        }
      },
      preBuild() {
        this.resetSelected()
        const criteria = this.criteria()
        this.items.forEach(status => {
          this.build(status, criteria.keywords, criteria.includeRetweets, criteria.excludeContent, criteria.startDate, criteria.endDate, criteria.startTime, criteria.endTime)
        })
      }, 
      build(tweet, keywords, includeRetweets, excludeContent, startDate, endDate, startTime, endTime) {

        let process = false

        const text = tweet.text.toLowerCase()
        const textArray = text.split(' ')

        const includeArray = (keywords.include) ? keywords.include.toLowerCase().split(' ') : []
        const excludeArray = (keywords.exclude) ? keywords.exclude.toLowerCase().split(' ') : []

        // const createdAt = new Date(tweet.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, '$1 $2 $4 $3 UTC'))
        const createdAt = new Date(tweet.created_at)
        const tweetDate = new Date(createdAt).getTime()
        const tweetHours = moment(createdAt).format('HH:mm')

        if (startDate && endDate) {
          if (tweetDate >= startDate && tweetDate <= endDate) {
            process = true
          }
        } else if (startDate) {
          if (tweetDate >= startDate) {
            process = true
          }
        }

        if (startTime && endTime) {
          process = (tweetHours >= startTime && tweetHours <= endTime) ? true : false
        } else if (startTime) {
          process = (tweetHours >= startTime) ? true : false
        } else if (endTime) {
          process = (tweetHours <= endTime) ? true : false
        }

        if (includeRetweets) {
          if (includeRetweets === 'exclude' && tweet.retweeted === true) {
            process = false
          }
        }

        if (excludeContent) { /* @FIXME */
          if (excludeContent === 'images') {}
          if (excludeContent === 'videos') {}
          if (excludeContent === 'links') {}
        }

        if (includeArray.length) {
          let found = textArray.some(item => includeArray.includes(item))
          if (found) {
            process = found
          }
        }

        if (excludeArray.length) {
          let found = textArray.some(item => excludeArray.includes(item))
          if (found) {
            process = !found
          }
        }

        if (!includeArray.length && !excludeArray.length && !startDate && !endDate && !startTime && !endTime) {
          process = true
        }

        if (process) {
          this.setSelected(tweet)
        }

      },
      process(type, selected) {
        const total = selected.length

        let counter = 0
        const processor = () => {

          this.setProgress({ id: 'expunge', name: type, total: total, done: counter + 1 })

          if (type === 'tweets') {
            if (typeof selected[counter] !== 'undefined') {
              let status = selected[counter]
              this.expungeTweet({id: status.id}).then(() => {
                this.setStatusesCount({type: 'decrement'})
              })
            }
          } else if (type === 'favorites') {
            if (typeof selected[counter] !== 'undefined') {
              let status = selected[counter]
              this.expungeFavorite({id: status.id}).then(() => {
                this.setFavoritesCount({type: 'decrement'})
              })
            }
          }

          if (counter >= total - 1) {
            counter = 0
            this.resetSelected()
            clearInterval(this.interval)
            this.resetProgress()
            this.clear()
          }

          counter++
        }

        this.interval = setInterval(processor, 3e3)
      },
      mapDates(data) {
        this.statusDates = []

        let generateDates = (data, next) => {
          let map = []
          data.forEach(row => {
            let parsed = new Date(row.created_at)
            map.push(moment(parsed).format('YYYY-MM-DD'))
          })
          next(map)
        }

        generateDates(data, items => {
          if (items.length) {
            items.forEach(item => {
              let hasDate = this.statusDates.map(i => i).indexOf(item)
              if (hasDate === -1) {
                this.statusDates.unshift(item)
              }
            })
          }
        })
      },
      allowedDates(val) {
        let found = this.statusDates.find(i => i === val)
        if (found) {
          return found
        }
      }
    }
  }
</script>
