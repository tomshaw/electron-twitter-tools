import TwitterClient from '../../../../renderer/library/twitter'
//import _ from 'lodash'

export default class Credentials {

  action(credentials, callback) {

    const client = new TwitterClient(credentials)

    const promise = new Promise((resolve, reject) => {
      client.verifyCredentials().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })

    promise.then(result => {
      callback(result)
    })
  }
}
