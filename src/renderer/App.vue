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
  import * as types from '@/config/constants'
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
      this.$settings.watch('google.maps.key', (newValue, oldValue) => {})

      //this.$settings.deleteAll()
      //this.$settings.delete('storage')

      if (this.$settings.has('storage.connections')) {
        this.$store.dispatch('addConnections', this.$settings.get('storage.connections'))
      } else {
        this.$settings.set('storage.connections', this.$store.getters.getConnections)
      }

      if (this.$settings.has('storage.adapter')) {
        this.$store.dispatch('setAdapter', this.$settings.get('storage.adapter'))
      } else {
        this.$settings.set('storage.adapter', this.$store.getters.getAdapter)
      }

      if (!this.$settings.has('storage.connection')) {
        this.$settings.set('storage.connection', this.$store.getters.getConnection)
      }
      
      this.$electron.ipcRenderer.send(types.IPC_REQUEST_SCHEMA_CREATE, this.$store.getters.getConnection)
      this.$electron.ipcRenderer.on(types.IPC_RESPONSE_SCHEMA_CREATE, (event, response) => {
        let hasError = response.find(item => item.status === 'error')
        if (hasError) {
          this.$toastr('error', hasError.message, 'Error Message')
          this.$router.push({ name: 'settings-page' })
        } else {
          this.$electron.ipcRenderer.send(types.IPC_REQUEST_SCHEMA_CONFIG, this.$store.getters.getConnection)
        }
      })

      this.$electron.ipcRenderer.on(types.IPC_RESPONSE_SCHEMA_CONFIG, (event, response) => {
        let hasError = response.find(item => item.status === 'error')
        if (hasError) {
          this.$toastr('error', hasError.message, 'Error Message')
          this.$router.push({ name: 'settings-page' })
        } else {
          this.$settings.set('storage.adapter', this.$store.getters.getAdapter)
          this.$settings.set('storage.connection', this.$store.getters.getConnection)
          this.$toastr('success', `Adapter ${this.$store.getters.getAdapter} has been setup successfully.`, 'Success Message')
        }
      })
      
      /*
       * Start Twitter
       */

      if (this.$settings.get('twitter.validated') === false) {
        this.$router.push({ name: 'settings-page' })
      }

      if (this.$settings.has('twitter.profile')) {
        this.$store.dispatch('setValidated', true)
        this.$store.dispatch('setProfile', this.$settings.get('twitter.profile'))
      } 

      this.$electron.ipcRenderer.send(types.IPC_REQUEST_TWITTER_CREDENTIALS, this.$settings.get('twitter.tokens'))
      this.$electron.ipcRenderer.on(types.IPC_RESPONSE_TWITTER_CREDENTIALS, (event, response) => {
        if (!response.hasOwnProperty('id')) {
          this.$toastr('error', 'Twitter authentication failed.', 'Error Message')
          this.$router.push({ name: 'settings-page' })
        } else {
          this.$settings.set('twitter.validated', true)
          this.$settings.set('twitter.profile', response)
          this.$store.dispatch('setValidated', true)
          this.$store.dispatch('setProfile', response)
          this.$toastr('success', `The Twitter account for ${response.name} has been setup successfully.`, 'Success Message')
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
