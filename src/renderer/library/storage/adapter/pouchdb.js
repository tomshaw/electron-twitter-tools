import Adapter from './adapter'

export default class extends Adapter {

  constructor() {
    super()
    console.dir('constructor:pouchdb', {
      depth: null,
      colors: true
    })
  }

}
