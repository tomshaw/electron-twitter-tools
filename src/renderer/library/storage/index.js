/**
 * Target
 */
import MariaDb from './adapter/mariadb'
import MSSQL from './adapter/mssql'
import MySql from './adapter/mysql'
import Oracle from './adapter/oracle'
import Postgres from './adapter/postgres'
import Sqlite from './adapter/sqlite'
import PouchDb from './adapter/pouchdb'

import {
  API_STORAGE_SQLITE,
  API_STORAGE_MYSQL,
  API_STORAGE_POSTGRES,
  API_STORAGE_MARIADB,
  API_STORAGE_ORACLE,
  API_STORAGE_MSSQL,
  API_STORAGE_POUCHDB
}
from '../../config/constants'

export default class Database {

  constructor(connection) {

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
      case API_STORAGE_ORACLE:
          data.push({
            processor: new Oracle(connection)
          })
          break;
      case API_STORAGE_MSSQL:
          data.push({
            processor: new MSSQL(connection)
          })
          break;
      case API_STORAGE_POUCHDB:
          data.push({
            processor: new PouchDb(connection)
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
