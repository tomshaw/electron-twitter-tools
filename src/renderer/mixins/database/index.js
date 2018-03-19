import Database from '@/library/storage'
const settings = require('electron-settings')

export default {
  name: 'database',
  data() {
    return {
      connection: false
    }
  },
  methods: {
    db: () => {
      if (!this.connection) {
        this.connection = new Database(settings.get('storage.connection'))
      }
      return this.connection
    }
  }
}
