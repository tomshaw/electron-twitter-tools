import TwitterClient from '../../../../renderer/library/twitter'
//import _ from 'lodash'

export default class Credentials {

  action(credentials, callback) {

    const client = new TwitterClient(credentials)

    const promise = new Promise((resolve, reject) => {
      client.verifyCredentials(response => {
        if (response.hasOwnProperty('errors')) {
          resolve({
            status: 'errors',
            message: 'Could not authenticate you.'
          })
        } else {
          resolve(response)
        }
      })
    })

    promise.then(result => {
      callback(result)
    })
  }
}
