import TwitterClient from '../../../../renderer/library/twitter'

export default class Account {

  action(credentials, callback) {

    const client = new TwitterClient(credentials)

    const promise = new Promise((resolve, reject) => {
      client.accountSettings().then(response => {
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
