<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <breadcrumbs page="lists"></breadcrumbs>
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
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import LookupForm from '@/components/shared/Blocks/LookupForm'
  import LookupResults from './LookupResults'
  export default {
    name: 'lookup-management',
    components: {
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
