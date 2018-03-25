<template>
  <v-card flat>
    <v-card-text>
      <v-container grid-list-md text-xs-center>
        <v-form>
          <v-layout row wrap>
            <v-flex xs11 sm4>
              <v-text-field label="Status Count" v-model="results.status_count" prepend-icon="speaker_notes"></v-text-field>
            </v-flex>
            <v-flex xs11 sm4>
              <v-select :label="languageLabel" :items="languages" v-model="languages" prepend-icon="translate" single-line></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11 sm4>
              <v-select :label="timezoneLabel" :items="timezones" v-model="timezones" prepend-icon="translate" single-line></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11 sm4>
              <v-text-field label="Quotes Count" v-model="results.quote_count" prepend-icon="favorite"></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11 sm4>
              <v-text-field label="Replies Count" v-model="results.reply_count" prepend-icon="face"></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11 sm4>
              <v-text-field label="Retweets Count" v-model="results.retweet_count" prepend-icon="face"></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11 sm4>
              <v-text-field label="Verified Accounts" v-model="results.verified_count" prepend-icon="list"></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'search-status',
    props: ['active'],
    computed: {
      ...mapGetters({
        results: 'getSearchResults',
        languages: 'getSearchLanguages',
        timezones: 'getSearchTimezones'
      }),
      languageLabel: function () { 
        if (this.results.language_count === 0) {
          return 'Languages'
        } else {
          return `${this.results.language_count} Languages`
        }
      },
      timezoneLabel: function () { 
        if (this.results.timezone_count === 0) {
          return 'Timezones'
        } else {
          return `${this.results.timezone_count} Timezones`
        }
      }
    }
  }
</script>
