<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <page-title main-title="Search Analytics" sub-title="reports and analysis"></page-title>
        <breadcrumbs page="search"></breadcrumbs>
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
  import PageTitle from '@/components/shared/PageTitle'
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import TrendsForm from '@/components/shared/Blocks/TrendsForm'
  export default {
    name: 'search-management',
    components: {
      'page-title': PageTitle,
      'breadcrumbs': Breadcrumbs,
      'trends-form': TrendsForm
    }
  }
</script>
