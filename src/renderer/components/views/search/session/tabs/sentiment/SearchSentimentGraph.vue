<template>
  <v-container>
    <v-layout row>
      <v-flex xs4>
        <search-sentiment-pie :chart-data="collection"></search-sentiment-pie>
      </v-flex>
      <v-flex xs4>
        <search-sentiment-pie :chart-data="collection"></search-sentiment-pie>
      </v-flex>
      <v-flex xs4>
        <search-sentiment-pie :chart-data="collection"></search-sentiment-pie>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SearchSentimentPie from './SearchSentimentPie'
  export default {
    name: 'search-sentiment-graph',
    props: ['active'],
    components: {
      'search-sentiment-pie': SearchSentimentPie
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