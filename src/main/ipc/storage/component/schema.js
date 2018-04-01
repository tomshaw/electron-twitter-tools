import Adapter from '../../../../renderer/library/storage'

export default class Schema {

  action(credentials, callback) {
    const db = new Adapter(credentials)
    
    let createConfigTable = new Promise((resolve, reject) => {
      db.createConfigTable(response => {
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

    let createListsTable = new Promise((resolve, reject) => {
      db.createListsTable(response => {
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

    let createListsStoreTable = new Promise((resolve, reject) => {
      db.createListsStoreTable(response => {
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

    let createSearchTable = new Promise((resolve, reject) => {
      db.createSearchSessionTable(response => {
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

    let createSearchStoreTable = new Promise((resolve, reject) => {
      db.createSearchStoreTable(response => {
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

    Promise.all([
      createConfigTable, 
      createListsTable, 
      createListsStoreTable, 
      createSearchTable,
      createSearchStoreTable
    ]).then(response => {
      callback(response)
    })
  }
}
