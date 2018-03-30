const settings = require('electron-settings')

export default {
  methods: {
    $account() {
      return settings.get('twitter.profile')
    }
  }
}
