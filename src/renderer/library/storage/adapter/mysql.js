import Adapter from './adapter'

//var moment = require('moment');

export default class extends Adapter {

  constructor(connection) {
    super(connection.client)
    connection.timezone = 'UTC'
    connection.dateStrings = true
    if (this.api === undefined) {
      this.api = require('knex')({
        client: connection.client,
        connection: connection
      })
    }

    this.api.raw('SET NAMES UTF8')
  }

}
