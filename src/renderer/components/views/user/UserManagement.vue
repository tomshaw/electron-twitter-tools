<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <page-title main-title="User Management" sub-title="friends and followers"></page-title>
        <breadcrumbs page="user"></breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3>
        <profile-view></profile-view>
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
  import ProfileView from '@/components/shared/Blocks/ProfileView'
  export default {
    components: {
      'page-title': PageTitle,
      'breadcrumbs': Breadcrumbs,
      'profile-view': ProfileView
    }
  }
</script>
