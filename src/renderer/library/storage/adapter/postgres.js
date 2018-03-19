import Adapter from './adapter'

export default class extends Adapter {

  constructor() {
    super()
    console.dir('constructor:postgres', {
      depth: null,
      colors: true
    })
  }

}
