<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <page-title main-title="Expunge" sub-title="delete statuses"></page-title>
        <breadcrumbs page="expunge"></breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3>
        <profile-view></profile-view>
      </v-flex>
      <v-flex xs9>
        <expunge-status></expunge-status>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import PageTitle from '@/components/shared/PageTitle'
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import ProfileView from '@/components/shared/Blocks/ProfileView'
  import ExpungeStatus from './ExpungeStatus'
  export default {
    name: 'expunge-management',
    components: {
      'page-title': PageTitle,
      'breadcrumbs': Breadcrumbs,
      'profile-view': ProfileView,
      'expunge-status': ExpungeStatus
    }
  }
</script>
