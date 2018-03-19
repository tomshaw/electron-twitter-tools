const settings = require('electron-settings')

export default {
  computed: {
    $settings() {
      return settings
    }
  }
}
