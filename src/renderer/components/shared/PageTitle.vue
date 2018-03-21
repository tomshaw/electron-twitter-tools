<template>
  <h1>{{mainTitle}} <small>{{subTitle}}</small></h1>
</template>

<script>
  export default {
    name: 'page-title',
    props: {
      mainTitle: {
        type: String,
        default: 'Dashboard'
      },
      subTitle: {
        type: String,
        default: 'stats and more'
      }
    }
  }
</script>

<style lang="scss" scoped>
h1 {
  color: #666;
  display: block;
  padding: 0px;
  margin: 0px 0px 10px 0;
  letter-spacing: -1px;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  font-size: 30px;
  font-weight: 300;
  small {
    color: #888;
    letter-spacing: 0px;
    font-size: 18px;
    font-weight: 300;
  }
}
</style>
