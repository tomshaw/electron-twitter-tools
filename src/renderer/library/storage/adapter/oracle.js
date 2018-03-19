import Adapter from './adapter'

export default class extends Adapter {

  constructor() {
    super()
    console.dir('constructor:oracle', {
      depth: null,
      colors: true
    })
  }

}
