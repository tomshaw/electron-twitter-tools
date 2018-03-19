import TwitterClient from '../../../../renderer/library/twitter'

let _ = require('lodash')

export default class Account {

  action(credentials, callback) {

    const client = new TwitterClient(credentials)

    const promise = new Promise((resolve, reject) => {
      client.accountSettings(response => {
        if (response.hasOwnProperty('errors')) {
          resolve({
            status: 'errors',
            message: 'Could not authenticate you.'
          })
        } else {
          resolve(_.map(_.reject(response, key => {
            return _.includes([ 'trend_location' ], key);
          })))
        }
      })
    })

    promise.then(result => {
      callback(result)
    })

  }

}
