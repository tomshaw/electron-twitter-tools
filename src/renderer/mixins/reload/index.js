import { remote } from 'electron'

export default {
  name: 'electron-reload',
  methods: {
    $reload: (seconds) => {
      setTimeout(() => {
        remote.getCurrentWindow().reload()
      }, seconds)
    }
  }
}
