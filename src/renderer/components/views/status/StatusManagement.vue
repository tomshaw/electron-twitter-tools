<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <breadcrumbs page="lists"></breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3>
        <tweet-form></tweet-form>
      </v-flex>
      <v-flex xs9>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import TweetForm from '@/components/shared/Blocks/TweetForm'
  export default {
    components: {
      'breadcrumbs': Breadcrumbs,
      'tweet-form': TweetForm
    }
  }
</script>
