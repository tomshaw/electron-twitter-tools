/**
 * Adapter
 */
import Adapter from './adapter'

export default class extends Adapter {

  constructor(connection) {
    super(connection.client)
    this.api = require('knex')({
      client: connection.client,
      connection: {
        filename: './src/config/database/maindb.sqlite'
      },
      useNullAsDefault: true,
      debug: false
    })
  }

}
