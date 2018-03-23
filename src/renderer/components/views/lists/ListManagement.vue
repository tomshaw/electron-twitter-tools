<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <page-title main-title="List Management" sub-title="saved and active"></page-title>
        <breadcrumbs page="lists"></breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6>
        <list-backup></list-backup>
      </v-flex>
      <v-flex xs6>
        <list-online></list-online>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import PageTitle from '@/components/shared/PageTitle'
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import ListBackup from './ListBackup'
  import ListOnline from './ListOnline'
  export default {
    name: 'list-management',
    components: {
      'page-title': PageTitle,
      'breadcrumbs': Breadcrumbs,
      'list-backup': ListBackup,
      'list-online': ListOnline
    }
  }
</script>