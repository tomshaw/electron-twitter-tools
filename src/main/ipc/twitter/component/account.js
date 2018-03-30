import TwitterClient from '../../../../renderer/library/twitter'

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
          resolve(response)
        }
      })
    })

    promise.then(result => {
      callback(result)
    })

  }

}
