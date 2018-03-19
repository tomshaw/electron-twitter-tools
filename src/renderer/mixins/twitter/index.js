import Twitter from '@/library/twitter'
const settings = require('electron-settings')

export default {
  name: 'twitter',
  data() {
    return {
      client: false
    }
  },
  methods: {
    twitter: () => {
      if (!this.client) {
        this.client = new Twitter(settings.get('twitter.tokens'))
      }
      return this.client
    }
  }
}
