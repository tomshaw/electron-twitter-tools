<template>
  <div id="app">
    <v-app dark>
      <app-navigation :miniVariant="miniVariant" :clipped="clipped" :drawer="drawer" :rightDrawer="rightDrawer" @toggleRightDrawer="rightDrawer = !rightDrawer;"></app-navigation>
      <app-toolbar 
        @toggleClipped="clipped = !clipped;" 
        @toggleDrawer="drawer = !drawer;" 
        @toggleFixed="fixed = !fixed;" 
        @toggleMiniInvariant="miniVariant = !miniVariant;" 
        @toggleRightDrawer="rightDrawer = !rightDrawer;"
        :clipped="clipped" :fixed="fixed" :miniVariant="miniVariant" :title="title"></app-toolbar>
      <app-content></app-content>
      <app-footer :fixed="fixed"></app-footer>
    </v-app>
  </div>
</template>

<script>
  import AppNavigation from '@/components/shared/Layout/AppNavigation'
  import AppToolbar from '@/components/shared/Layout/AppToolbar'
  import AppContent from '@/components/shared/Layout/AppContent'
  import AppFooter from '@/components/shared/Layout/AppFooter'

  import {
    IPC_REQUEST_SCHEMA_CREATE,
    IPC_RESPONSE_SCHEMA_CREATE,
    IPC_REQUEST_SCHEMA_CONFIG,
    IPC_RESPONSE_SCHEMA_CONFIG,
    //IPC_REQUEST_TWITTER_SETTINGS,
    IPC_RESPONSE_TWITTER_SETTINGS,
    IPC_REQUEST_TWITTER_CREDENTIALS,
    IPC_RESPONSE_TWITTER_CREDENTIALS
  } from '@/config/constants'

  export default {
    name: 'electron-twitter-tools',
    data: () => ({
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: true,
      rightDrawer: false,
      title: 'Electron Twitter Tools'
    }),
    components: {
      'app-navigation': AppNavigation,
      'app-toolbar': AppToolbar,
      'app-content': AppContent,
      'app-footer': AppFooter
    },
    created () {

      this.$settings.watch('storage', (newValue, oldValue) => {})
      this.$settings.watch('twitter', (newValue, oldValue) => {})
      this.$settings.watch('twitter.profile', (newValue, oldValue) => {})
      this.$settings.watch('google.maps.key', (newValue, oldValue) => {
        // Application will need to restart to take effect.
      })

      if (this.$settings.has('google.maps.loaded')) {
        this.$settings.delete('google.maps.loaded')
      }

      //this.$settings.deleteAll()
      //this.$settings.delete('storage')

      if (this.$settings.has('storage.connections')) {
        this.$store.dispatch('addConnections', this.$settings.get('storage.connections'))
      }

      if (this.$settings.get('twitter.validated') === false) {
        this.$router.push({ name: 'settings-page' })
      }

      if (!this.$settings.has('storage.adapter')) {
         this.$settings.set('storage.adapter', this.$store.getters.getAdapter)
      } else {
        this.$store.dispatch('setAdapter', this.$settings.get('storage.adapter'))
      }

      if (!this.$settings.has('storage.connection')) {
        this.$settings.set('storage.connection', this.$store.getters.getConnection)
      }
      
      this.$electron.ipcRenderer.send(IPC_REQUEST_SCHEMA_CREATE, this.$settings.get('storage.connection'))
      this.$electron.ipcRenderer.on(IPC_RESPONSE_SCHEMA_CREATE, (event, response) => {
        if (response.hasOwnProperty('errors')) {
          this.$router.push({ name: 'settings-page' })
        } else {
          if (!this.$settings.has('storage.hasconfig')) {
            this.$electron.ipcRenderer.send(IPC_REQUEST_SCHEMA_CONFIG, this.$settings.get('storage.connection'))
          }
        }
      })

      this.$electron.ipcRenderer.on(IPC_RESPONSE_SCHEMA_CONFIG, (event, response) => {
        if (response.hasOwnProperty('errors')) {
          this.$router.push({ name: 'settings-page' })
        } else {
          this.$settings.set('storage.hasconfig', true)
        }
      })

      //this.$electron.ipcRenderer.send(IPC_REQUEST_TWITTER_SETTINGS, this.$settings.get('twitter.tokens'))
      this.$electron.ipcRenderer.on(IPC_RESPONSE_TWITTER_SETTINGS, (event, response) => {
        if (response.hasOwnProperty('errors')) {
          // @TODO
          console.log('IPC_RESPONSE_TWITTER_SETTINGS', response.errors)
        }
      })

      if (this.$settings.has('twitter.profile')) {
        this.$store.dispatch('setValidated', true)
        this.$store.dispatch('setProfile', this.$settings.get('twitter.profile'))
      } 

      this.$electron.ipcRenderer.send(IPC_REQUEST_TWITTER_CREDENTIALS, this.$settings.get('twitter.tokens'))
      this.$electron.ipcRenderer.on(IPC_RESPONSE_TWITTER_CREDENTIALS, (event, response) => {
        // console.log('IPC_RESPONSE_TWITTER_CREDENTIALS', response)
        if (response.hasOwnProperty('errors')) {
          // @TODO send notice...
          console.log('IPC_RESPONSE_TWITTER_CREDENTIALS', response.errors)
        } else {
          console.log('IPC_RESPONSE_TWITTER_CREDENTIALS', response)
          this.$settings.set('twitter.validated', true)
          this.$settings.set('twitter.profile', response)
          this.$store.dispatch('setValidated', true)
          this.$store.dispatch('setProfile', response)
        }
      })

      if (this.$settings.has('google.maps.key')) {
        if (typeof google !== 'object') {
          let apiKey = this.$settings.get('google.maps.key')
          let script = document.createElement('script')
          script.setAttribute('src', `http://maps.google.com/maps/api/js?libraries=places&key=${apiKey}`)
          let head = document.getElementsByTagName('head')[0]
          head.appendChild(script)
        }
      }

    }
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
.profile-image {
  margin: 5px 0;
  padding: 0;
  width: 36px;
  height: 36px;
  border-radius: 100%;
}
.emoji {
  width: 14px !important;
  height: 14px !important;
}
.toast-title,
.toast-message {
  font-family: Roboto, 'Helvetica Neue', sans-serif
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
