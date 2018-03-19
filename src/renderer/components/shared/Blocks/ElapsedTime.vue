<template>
  <v-btn flat id="elapsedTime"></v-btn>
</template>

<script>
  import {pad} from '@/config/helpers'
  export default {
    name: 'elapsed-time',
    props: ['active'],
    watch: {
      active: function () {
        const isRunning = this.active
        if (isRunning) {
          this.interval = setInterval(this.start, 1000);
        } else {
          this.stop()
        }
      }
    },
    data() {
      return {
        interval: null,
        totalSeconds: 0
      }
    },
    methods: {
      start() {
        this.totalSeconds++;
        let hour = Math.floor(this.totalSeconds / 3600);
        let minutes = Math.floor((this.totalSeconds - hour * 3600) / 60);
        let seconds = this.totalSeconds - (hour * 3600 + minutes * 60);
        if (hour) {
          document.getElementById('elapsedTime').innerHTML = `${pad(hour)}:${pad(minutes)}:${pad(seconds)}`;
        } else {
          document.getElementById('elapsedTime').innerHTML = `00:${pad(minutes)}:${pad(seconds)}`;
        }
      },
      stop() {
        if (this.interval) {
          clearInterval(this.interval)
          this.totalSeconds = 0
          document.getElementById('elapsedTime').innerHTML = '';
        }
      }
    }
 }
</script>

<style lang="scss" scoped>
#elapsedTime {
  font-size: 24px
}
</style>
