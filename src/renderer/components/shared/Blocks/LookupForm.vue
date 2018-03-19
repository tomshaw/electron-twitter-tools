<template>
  <v-card>
    <v-toolbar dark>
      <v-toolbar-title>Lookup Users</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon><v-icon dark>search</v-icon></v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-select label="Keywords" autocomplete :loading="loading" multiple chips required :items="items" :search-input.sync="search" v-model="select">
          <template slot="selection" slot-scope="data">
            <v-chip close @input="remove(data)" :selected="data.selected" class="chip--select-multi" :key="data.item.id">
              <v-avatar>
                <img :src="data.item.avatar">
              </v-avatar>
              {{ data.item.text }}
            </v-chip>
          </template>
          <template slot="item" slot-scope="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
              <v-list-tile-avatar>
                <img :src="data.item.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item.description"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </template>
        </v-select>
        <v-btn @click="submit" :loading="loading" :disabled="loading" color="success" class="white--text">Submit <v-icon right dark>find_replace</v-icon></v-btn>
        <v-btn @click="clear">clear</v-btn>  
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'lookup-form',
    computed: {
      ...mapGetters({
        items: 'getLookupItems'
      })
    },
    data() {
      return {
        loading: false,
        search: null,
        select: []
      }
    },
    watch: {
      search (val) {
        val && this.querySelections(val)
      }
    },
    methods: {
      ...mapActions(['searchUsers', 'lookupUsers']),
      querySelections (val) {
        this.loading = true
        if (val) {
          this.searchUsers({q: val, count: 10}).then(() => {
            this.loading = false
          })
        }
      },
      submit () {
        this.loading = true
        this.lookupUsers({user_id: this.select.join(',')}).then(() => {
          this.loading = false
        })
      },
      clear () {
        this.search = null
        this.select = []
        this.$store.commit('LOOKUP_USERS_CLEAR')
      },
      remove(data) {
        const item = data.item
        const parent = data.parent
        parent.selectItem(data.item)
        this.$store.commit('LOOKUP_USERS_REMOVE', item)
      }
    }
  }
</script>
