/**
 * Adapter
 */
import Adapter from './adapter'

export default class extends Adapter {

  constructor() {
    super()
    console.dir('constructor:mariadb', {
      depth: null,
      colors: true
    })
  }

}
