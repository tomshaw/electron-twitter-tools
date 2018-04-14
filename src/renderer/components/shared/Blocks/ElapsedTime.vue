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
          this.interval = setInterval(this.start, 1e3);
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
    mounted() {
      this.el = document.getElementById('elapsedTime')
    },
    destroyed() {
      if (this.interval) {
        this.stop()
      }
    },
    methods: {
      start() {
        this.totalSeconds++;
        let hour = Math.floor(this.totalSeconds / 3600);
        let minutes = Math.floor((this.totalSeconds - hour * 3600) / 60);
        let seconds = this.totalSeconds - (hour * 3600 + minutes * 60);
        if (hour) {
          this.el.innerHTML = `${pad(hour)}:${pad(minutes)}:${pad(seconds)}`;
        } else {
          this.el.innerHTML = `00:${pad(minutes)}:${pad(seconds)}`;
        }
      },
      stop() {
        if (this.interval) {
          clearInterval(this.interval)
          this.totalSeconds = 0
          if (this.el.length) {
            this.el.innerHTML = '';
          }
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
