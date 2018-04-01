import Adapter from '../../../../renderer/library/storage'

export default class Schema {

  action(credentials, callback) {
    const db = new Adapter(credentials)
    
    let populateConfig = new Promise((resolve, reject) => {
      db.addConfigData().then(response => {
        if (response instanceof Error) {
          resolve({
            status: 'error',
            message: response.sqlMessage
          })
        } else {
          resolve({
            status: 'success',
            message: 'Populated configuration data.'
          })
        }
      }).catch(error => {
        reject(error)
      })
    })

    Promise.all([populateConfig]).then(response => {
      callback(response)
    })
  }
}
