import MariaDb from './adapter/mariadb'
import MSSQL from './adapter/mssql'
import MySql from './adapter/mysql'
import Postgres from './adapter/postgres'
import Sqlite from './adapter/sqlite'

import {
  API_STORAGE_SQLITE,
  API_STORAGE_MYSQL,
  API_STORAGE_POSTGRES,
  API_STORAGE_MARIADB,
  API_STORAGE_MSSQL
}
from '../../config/constants'

export default class Database {

  constructor(options) {

    const connection = (typeof options === 'undefined') ? {
      client: 'sqlite3'
    } : options

    const adapter = connection.client

    let data = []
    switch (adapter) {
    case API_STORAGE_SQLITE:
      data.push({
        processor: new Sqlite(connection)
      })
      break;
    case API_STORAGE_MYSQL:
      data.push({
        processor: new MySql(connection)
      })
      break;
    case API_STORAGE_POSTGRES:
      data.push({
        processor: new Postgres(connection)
      })
      break;
    case API_STORAGE_MARIADB:
      data.push({
        processor: new MariaDb(connection)
      })
      break;
    case API_STORAGE_MSSQL:
      data.push({
        processor: new MSSQL(connection)
      })
      break;
    default:
      data.push({
        processor: new Sqlite(connection)
      })
    }

    return data[0].processor
  }

}
