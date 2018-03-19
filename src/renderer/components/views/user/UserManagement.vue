<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <breadcrumbs page="lists"></breadcrumbs>
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
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import ProfileView from '@/components/shared/Blocks/ProfileView'
  export default {
    components: {
      'breadcrumbs': Breadcrumbs,
      'profile-view': ProfileView
    }
  }
</script>
