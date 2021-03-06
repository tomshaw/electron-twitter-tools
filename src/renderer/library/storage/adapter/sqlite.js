import Adapter from './adapter'
const os = require('os')

export default class extends Adapter {
  constructor(connection) {
    super(connection.client)
    if (this.api === undefined) {
      this.api = require('knex')({
        client: connection.client,
        connection: {
          filename: os.tmpdir() + '/maindb.sqlite'
        },
        useNullAsDefault: true,
        debug: false
      })
    }
  }
}
