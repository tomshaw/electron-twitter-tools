import Adapter from '../../../../renderer/library/storage'

export default class Schema {

  action(credentials, callback) {
    const db = new Adapter(credentials)
    
    let populateConfig = new Promise((resolve, reject) => {
      db.addConfigData(response => {
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
      })
    })

    Promise.all([populateConfig]).then(response => {
      console.dir(response)
      callback(response)
    })
  }
}
