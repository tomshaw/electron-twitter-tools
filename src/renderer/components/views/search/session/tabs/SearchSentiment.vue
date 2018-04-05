<template>
  <v-expansion-panel>
    <v-expansion-panel-content key="one" value="one" expand-icon="mdi-menu-down">
      <div slot="header" id="header"><h4>Chart Analysis</h4></div>
      <v-card>
        <v-card-text class="grey darken-4">
          <search-sentiment-graph></search-sentiment-graph>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
    <v-expansion-panel-content key="two" expand-icon="mdi-menu-down">
      <div slot="header" id="header"><h4>Word Frequency</h4></div>
      <v-card>
        <v-card-text class="grey">
          <search-sentiment-words></search-sentiment-words>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
    <v-expansion-panel-content key="three" expand-icon="mdi-menu-down">
      <div slot="header" id="header"><h4>Cloud Visualization</h4></div>
      <v-card>
        <v-card-text class="grey">
          <search-sentiment-cloud></search-sentiment-cloud>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  import SearchSentimentGraph from './sentiment/SearchSentimentGraph'
  import SearchSentimentWords from './sentiment/SearchSentimentWords'
  import SearchSentimentCloud from './sentiment/SearchSentimentCloud'
  export default {
    name: 'search-sentiment',
    props: ['active'],
    components: {
      'search-sentiment-graph': SearchSentimentGraph,
      'search-sentiment-words': SearchSentimentWords,
      'search-sentiment-cloud': SearchSentimentCloud
    }
  }
</script>

<style lang="scss" scoped>
#header {
  text-transform: uppercase
}
</style>
