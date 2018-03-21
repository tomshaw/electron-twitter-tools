<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <page-title main-title="Statuses" sub-title="tweets and favorites"></page-title>
        <breadcrumbs page="status"></breadcrumbs>
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
  import PageTitle from '@/components/shared/PageTitle'
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import TweetForm from '@/components/shared/Blocks/TweetForm'
  export default {
    components: {
      'page-title': PageTitle,
      'breadcrumbs': Breadcrumbs,
      'tweet-form': TweetForm
    }
  }
</script>
