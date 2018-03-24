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
              <v-flex xs12 v-for="(item, i) in connections" :key="i">
                <v-switch :label="formatTitle(item.client)" v-model="adapter" color="red" :value="item.client" hide-details></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-list>
  </v-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  import * as types from '@/config/constants'
  export default {
    name: 'system-info',
    computed: {
      ...mapGetters({
        connections: 'getConnections'
      })
    },
    watch: {
      adapter: function (newAdapter, oldAdapter) {
        this.$store.dispatch('setAdapter', newAdapter)
        this.$electron.ipcRenderer.send(types.IPC_REQUEST_SCHEMA_CREATE, this.$store.getters.getConnection)
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
      formatTitle(adapter) {
        let title = adapter
        switch (adapter) {
          case 'sqlite3':
            title = 'Sqlite3'
            break
          case 'mysql':
            title = 'MySQL'
            break
        }
        return title
      },
      buildArray(data) {
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
