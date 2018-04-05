<template>
  <h1>Hello Results - #{{id}}</h1>
</template>

<script>
  export default {
    name: 'search-results',
    data () {
      return {
        id: 0
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.$parent.$emit('search:sidebar', false)
    },
    destroyed() {
      this.$parent.$emit('search:sidebar', true)
    },
    methods: {
      something() {
      }
    }
  }
</script>
