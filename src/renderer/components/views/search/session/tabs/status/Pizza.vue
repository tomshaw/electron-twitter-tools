<template>
  <v-container>
    <v-layout row>
      <v-flex xs4>
        <!-- <search-sentiment-pie :chart-data="collection"></search-sentiment-pie> -->
      </v-flex>
      <v-flex xs4>
        <!-- <search-sentiment-pie :chart-data="collection"></search-sentiment-pie> -->
      </v-flex>
      <v-flex xs4>
        <!-- <search-sentiment-pie :chart-data="collection"></search-sentiment-pie> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'pizza',
    data() {
      return {
        collection: []
      }
    },
    mounted () {

    },
    methods: {
      AmChartExample() {

      }
    }
  }
</script>