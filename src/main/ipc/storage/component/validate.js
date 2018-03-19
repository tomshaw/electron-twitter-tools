import Adapter from '../../../../renderer/library/storage'

export default class Schema {

  action(credentials, callback) {
    const db = new Adapter(credentials)
    
    let createTables = new Promise((resolve, reject) => {
      db.createTables(response => {
        if (response instanceof Error) {
          resolve({
            status: 'error',
            message: response.sqlMessage
          })
        } else {
          resolve({
            status: 'success',
            message: 'Tables created successfully.'
          })
        }
      })
    })

    let validateConnection = new Promise((resolve, reject) => {
      db.validate(response => {
        if (response instanceof Error) {
          resolve({
            status: 'error',
            message: response.sqlMessage
          })
        } else {
          resolve({
            status: 'success',
            message: 'Connection is validated.'
          })
        }
      })
    })

    Promise.all([createTables, validateConnection]).then(response => {
      callback(response)
    })
  }
}
