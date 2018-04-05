import Adapter from './adapter'

export default class extends Adapter {

  constructor(connection) {
    super(connection.client)
    if (this.api === undefined) {
      this.api = require('knex')({
        client: connection.client,
        connection: connection,
        debug: true
      })
    }
  }

}
