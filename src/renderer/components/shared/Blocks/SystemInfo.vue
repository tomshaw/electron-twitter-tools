<template>
  <v-card>
    <v-toolbar dark dense>
      <v-toolbar-title>System Information</v-toolbar-title>
    </v-toolbar>
    <v-list two-line dark>
      <template v-for="(item, i) in items">
        <v-subheader v-if="item.header" v-text="item.header" v-bind:key="i"></v-subheader>
        <v-divider v-else-if="item.divider" inset v-bind:key="i"></v-divider>
        <v-list-tile avatar v-else v-bind:key="item.title">
          <v-list-tile-avatar>
            <v-icon large color="blue darken-2">{{item.avatar}}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-divider></v-divider>
    <v-list two-line subheader>
      <v-subheader>Available Storage Adapters</v-subheader>
      <v-card flat>
        <v-card-text>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs12>
                <v-switch label="Sqlite3" v-model="adapter" color="red" value="sqlite3" hide-details></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-switch label="MySQL" v-model="adapter" color="red" value="mysql" hide-details></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    name: 'system-info',
    watch: {
      adapter: function (newAdapter, oldAdapter) {
        this.$store.dispatch('setAdapter', newAdapter)
        this.$settings.set('storage.adapter', newAdapter)
        this.$toastr('success', `System storage updated using ${newAdapter}.`, 'Success')
      }
    },
    data() {
      return {
        adapter: this.$store.getters.getAdapter,
        setup: {
          electron: process.versions['atom-shell'],
          name: this.$route.name,
          node: process.versions.node,
          path: this.$route.path,
          platform: require('os').platform(),
          vue: require('vue/package.json').version
        }
      }
    },
    created() {
      this.buildArray(this.setup)
    },
    methods: {
      buildArray: function (data) {
        this.items = [{
          header: 'Application Settings'
        }, {
          avatar: 'link',
          title: 'System Path',
          subtitle: `<span class="green--text text--lighten-2">${data.path}</span>`
        }, {
          divider: true,
          inset: true
        }, {
          avatar: 'linear_scale',
          title: 'Active Route',
          subtitle: `<span class="green--text text--lighten-2">${data.name}</span>`
        }, {
          divider: true,
          inset: true
        }, {
          avatar: 'device_hub',
          title: 'Vue.js Version',
          subtitle: `<span class="grey--text text--lighten-2">Currently running:</span> <strong class="red--text text--lighten-2">v${data.vue}</strong>`
        }, {
          divider: true,
          inset: true
        }, {
          avatar: 'device_hub',
          title: 'Electron Version',
          subtitle: `<span class="grey--text text--lighten-2">Currently running:</span> <strong class="red--text text--lighten-2">v${data.electron}</strong>`
        }, {
          divider: true,
          inset: true
        }, {
          avatar: 'device_hub',
          title: 'Node.js Version',
          subtitle: `<span class="grey--text text--lighten-2">Currently running:</span> <strong class="red--text text--lighten-2">v${data.node}</strong>`
        }, {
          divider: true,
          inset: true
        }, {
          avatar: 'desktop_windows',
          title: 'System Platform',
          subtitle: `<span class="grey--text text--lighten-2">Currently running:</span> <strong class="red--text text--lighten-2">${data.platform.toUpperCase()}</strong>`
        }]
      }
    }
  }
</script>
