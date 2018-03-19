<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
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
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import ListBackup from './ListBackup'
  import ListOnline from './ListOnline'
  export default {
    name: 'list-management',
    components: {
      'breadcrumbs': Breadcrumbs,
      'list-backup': ListBackup,
      'list-online': ListOnline
    }
  }
</script>