<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <breadcrumbs page="lists"></breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3>
        <trends-form></trends-form>
      </v-flex>
      <v-flex xs9>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import TrendsForm from '@/components/shared/Blocks/TrendsForm'
  export default {
    name: 'search-management',
    components: {
      'breadcrumbs': Breadcrumbs,
      'trends-form': TrendsForm
    }
  }
</script>
