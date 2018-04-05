<template>
  <v-container grid-list-xl text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <div id="cloud" style="min-height: 800px;"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import WordCloud from 'wordcloud'
  import {
    mapGetters
  }
  from 'vuex'
import { setInterval } from 'timers';
  export default {
    name: 'search-sentiment-cloud',
    computed: {
      ...mapGetters({
        words: 'getSearchSentimentWords'
      })
    },
    mounted() {
      this.canvas = document.getElementById('cloud')
    },
    watch: {
      words: {
        handler: function (newValues, oldValues) {
          this.values = newValues
        }
      }
    },
    data() {
      return {
        values: [],
        colours: {
          positive: ['#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
          negative: ['#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#E53935', '#D32F2F', '#C62828', '#B71C1C']
        }
      }
    },
    created () {
      setInterval(() => {
        this.generateCloud()
      }, 5e3)
    },
    methods: {
      wordValence(word) {
        for (let i = 0, total = this.values.length; i < total; i++) {
          if (this.values[i].word === word) {
            return this.values[i].value
          }
        }
        return 0
      },
      generateCloud() {
        WordCloud(this.canvas, {
          list: this.generateList(),
          minSize: '1.6rem',
          gridSize: Math.round(12 * 1100 / 1024),
          weightFactor: (size) => {
            return Math.pow(size, 2.3) * 1100 / 1024;
          },
          fontFamily: 'Roboto',
          color: (word, weight) => {
            let value = this.wordValence(word)
            if (value > 0) {
              return this.colours.positive[value]
            } else if (value < 0) {
              return this.colours.negative[Math.abs(value)]
            } else {
              return (weight === 12) ? '#f02222' : '#c09292';
            }
          },
          rotateRatio: 0.5,
          rotationSteps: 2,
          backgroundColor: '#fff'
        })
      },
      generateList() {
        let list = []
        this.values.forEach(item => {
          if (item.count >= 2) {
            list.push([item.word, item.count])
          }
        })
        return list
      }
    }
  }
</script>
