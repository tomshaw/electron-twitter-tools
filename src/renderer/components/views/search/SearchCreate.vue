<template>
  <div>
    <v-toolbar dark tabs :color="color">
      <v-toolbar-side-icon><v-icon v-if="active">my_location</v-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Search Analysis</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <elapsed-time :active="active"></elapsed-time>
      </v-toolbar-items>
      <!-- <v-progress-circular v-if="active" indeterminate :size="25" :width="5" color="amber"></v-progress-circular> -->
      <v-tabs color="grey darken-2" slot="extension" slider-color="yellow" v-model="model">
        <v-tab href="#tab1">Search Criteria</v-tab>
        <v-tab v-if="active" href="#tab2">Session Statistics</v-tab>
        <v-tab v-if="active" href="#tab3">Sentiment Analysis</v-tab>
        <v-tab v-if="active && hasGoogle" href="#tab4">Geographic Location</v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="model">
      <v-tab-item id="tab1">
        <search-form :active="active"></search-form>
      </v-tab-item>
      <v-tab-item id="tab2">
        <search-status :active="active"></search-status>
      </v-tab-item>
      <v-tab-item id="tab3">
        <search-sentiment :active="active"></search-sentiment>
      </v-tab-item>
      <v-tab-item id="tab4" v-if="hasGoogle">
        <search-geographic :active="active"></search-geographic>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ElapsedTime from '@/components/shared/Blocks/ElapsedTime'
  import SearchForm from './SearchForm'
  import SearchStatus from './SearchStatus'
  import SearchSentiment from './SearchSentiment'
  import SearchGeographic from './SearchGeographic'
  export default {
    name: 'search-create',
    components: {
      'elapsed-time': ElapsedTime,
      'search-form': SearchForm,
      'search-status': SearchStatus,
      'search-sentiment': SearchSentiment,
      'search-geographic': SearchGeographic
    },
    computed: {
      ...mapGetters({
        active: 'getSearchActive'
      }),
      color: function () {
        return this.active ? 'error' : 'primary'
      }
    },
    data () {
      return {
        model: 'tab1',
        hasGoogle: false
      }
    },
    created () {
      if (this.$settings.has('google.maps.key')) {
        this.hasGoogle = true
      }
    }
  }
</script>
