<template>
  <v-container grid-list-xl text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <table class="table">
          <thead>
            <tr>
              <th scope="col" style="width:20px">#</th>
              <th scope="col" style="width:50%; text-align:left;">Word</th>
              <th scope="col" style="width:25%">Valence</th>
              <th scope="col" style="width:20%">Occurence</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(word, i) in list" :key="i++">
              <th scope="row">{{i}}</th>
              <td style="text-align:left;">{{word.word}}</td>
              <td>{{word.value}}</td>
              <td>{{word.count}}</td>
            </tr>
          </tbody>
        </table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'search-sentiment-words',
    computed: {
      ...mapGetters({
        words: 'getSearchSentimentWords'
      })
    },
    watch: {
      words: {
        handler: function (newValues, oldValues) { 
          let list = []
          newValues.forEach(item => {
            if (item.count > 0) {
              list.push(item)
            }
          })
          this.list = list
        }
      }
    },
    data () {
      return {
        list: []
      }
    }
  }
</script>
