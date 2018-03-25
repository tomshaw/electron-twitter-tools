<template>
  <v-card flat>
    <v-card-text>
      <h1>Sentiment Analysis</h1>
      <v-container grid-list-xl text-xs-center>
        <v-layout row wrap>
          <v-flex xs3></v-flex>
          <v-flex xs6>
            <search-sentiment-graph :chart-data="collection"></search-sentiment-graph>
          </v-flex>
          <v-flex xs3></v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SearchSentimentGraph from './SearchSentimentGraph'
  export default {
    name: 'search-sentiment',
    props: ['active'],
    components: {
      'search-sentiment-graph': SearchSentimentGraph
    },
    computed: {
      ...mapGetters({
        sentiment: 'getSearchSentiment'
      })
    },
    watch: {
      sentiment: {
        handler: function (newValues, oldValues) { 
          this.collection = {
            labels: ['Negative', 'Positive', 'Neutral'],
            datasets: [{
              backgroundColor: ['Red', 'Blue', 'Yellow'],
              data: [newValues.negative, newValues.positive, newValues.neutral]
            }]
          }
        },
        deep: true
      }
    },
    data () {
      return {
        collection: null
      }
    }
  }
</script>