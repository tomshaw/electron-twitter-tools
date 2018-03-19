import TwitterClient from '../../../../renderer/library/twitter'

let _ = require('lodash')

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
          resolve(_.pick(response, [
            'id',
            'name',
            'screen_name',
            'description',
            'followers_count',
            'friends_count',
            'statuses_count',
            'favourites_count',
            'profile_image_url',
            'profile_background_image_url'
          ]))
        }
      })
    })

    promise.then(result => {
      callback(result)
    })
  }
}
