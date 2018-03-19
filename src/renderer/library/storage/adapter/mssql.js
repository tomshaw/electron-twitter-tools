import Adapter from './adapter'

export default class extends Adapter {

  constructor() {
    super()
    console.dir('constructor:mssql', {
      depth: null,
      colors: true
    })
  }

}
