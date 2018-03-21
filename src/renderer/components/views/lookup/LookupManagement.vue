<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <page-title main-title="Lookup Users" sub-title="search user information"></page-title>
        <breadcrumbs page="lookup"></breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3>
        <lookup-form></lookup-form>
      </v-flex>
      <v-flex xs9>
        <lookup-results :items="items"></lookup-results>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PageTitle from '@/components/shared/PageTitle'
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import LookupForm from '@/components/shared/Blocks/LookupForm'
  import LookupResults from './LookupResults'
  export default {
    name: 'lookup-management',
    components: {
      'page-title': PageTitle,
      'breadcrumbs': Breadcrumbs,
      'lookup-form': LookupForm,
      'lookup-results': LookupResults
    },
    computed: {
      ...mapGetters({
        items: 'getLookupUsers'
      })
    }
  }
</script>
