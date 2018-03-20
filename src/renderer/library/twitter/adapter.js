import Twitter from 'twitter'

export default class Adapter {

  constructor (credentials) {
    if (typeof credentials !== 'undefined' && this.api === undefined) {
      this.api = new Twitter({
        consumer_key: credentials['consumer_key'],
        consumer_secret: credentials['consumer_secret'],
        access_token_key: credentials['access_token_key'],
        access_token_secret: credentials['access_token_secret']
      })
    }
    this.errors = []
    this.stream = null
  }
}
