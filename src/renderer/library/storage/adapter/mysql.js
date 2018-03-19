/**
 * Adapter
 */
import Adapter from './adapter'

//var moment = require('moment');

export default class extends Adapter {

  constructor(connection) {
    super(connection.client)
    connection.timezone = 'UTC'
    connection.dateStrings = true

    //connection.charset = 'utf8'
    //connection.charset = 'utf8mb4'
    //connection.charset = 'UTF8MB4_GENERAL_CI'
    //connection.charset = 'UTF8_GENERAL_CI'

    // connection.typeCast = (field, next) => {
    //   if (field.type === 'DATETIME') {
    //     return moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
    //   }
    //   return next();
    // }

    // connection.pool = {
    //   afterCreate: (conn, done) => {
    //     conn.query('SET NAMES utf8mb4').exec((error) => {
    //       if (error) {
    //         console.dir(error)
    //       }
    //       done()
    //     })
    //   }
    // }

    // pool: {
    //   afterCreate: function (conn, done) {
    //     console.dir(conn)
    //     conn.query('SET NAMES utf8mb4').exec(function (err) {
    //       if (err) {
    //         console.dir(err)
    //       }
    //       done(err, conn)
    //     })
    //   }
    // }

    if (this.api === undefined) {
      this.api = require('knex')({
        client: connection.client,
        connection: connection
      })
    }

    this.api.raw('SET NAMES UTF8')
  }

}
