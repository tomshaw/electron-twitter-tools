import _ from 'lodash'
import Adapter from './adapter'
import Parser from './parser'

export default class extends Adapter {

  accountSettings(callback) {
    this.api.get('account/settings', {}, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  verifyCredentials(callback) {
    this.api.get('account/verify_credentials', {}, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  helpLanguages(callback) {
    this.api.get('help/languages', {}, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  search(options, next) {
    this.api.stream(options.type, {track: options.keyword}, (stream) => {
      this.stream = stream
      this.stream.on('error', (err) => { 
        this.errors.push(err)
       })
      this.stream.on('data', (tweet) => {
        const processed = Parser.all(tweet)
        if (typeof processed === 'object') {
          if (processed.hasOwnProperty('weight')) {
            if (processed.weight.valid === true) {
              next(processed)
            }
          }
        }
      })
    })
  }

  streamFilter(type, options, next) {
    this.api.stream(type, options, (stream) => {
      this.stream = stream
      this.stream.on('error', (err) => { 
        this.errors.push(err)
       })
      this.stream.on('data', (tweet) => {
        const processed = Parser.all(tweet)
        if (typeof processed === 'object') {
          if (processed.hasOwnProperty('weight')) {
            if (processed.weight.valid === true) {
              next(processed)
            }
          }
        }
      })
    })
  }

  searchUsers(options, callback) {
    this.api.get('users/search', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  lookupUsers(options, callback) {
    this.api.get('users/lookup', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postTweet (options) {

    const statusUpdate = (options, mediaIds = []) => {
      let params = {
        status: options.message
      }
      if (mediaIds.length) {
        params.media_ids = mediaIds.join()
      }
      if (options.status_id) {
        params.in_reply_to_status_id = options.status_id
      }
      return new Promise((resolve, reject) => {
        this.api.post('statuses/update', params, (error, data, response) => {
          if (!error) {
            resolve()
          } else {
            reject(new Error(error))
          }
        })
      })
    }

    const mediaUpload = (options) => {
      return new Promise((resolve, reject) => {
        let out = resolve
        let mediaIds = []
        const process = () => {
          return new Promise((resolve, reject) => {
            let b64Image = options.images[mediaIds.length]
            b64Image = b64Image.replace(/^data:image\/.+;base64,/, '')
            this.api.post('media/upload', {media_data: b64Image}, (error, data, response) => {
              if (!error) {
                mediaIds.push(data.media_id_string)
                resolve()
              } else {
                reject(new Error(error))
              }
            })
          }).then(() => {
            if (options.images.length === mediaIds.length) {
              out(mediaIds.filter((id) => { return id !== null }))
            } else {
              process()
            }
          })
        }
        process()
      }).then(mediaIds => {
        return statusUpdate(options, mediaIds)
      }).catch(error => {
        console.log('error: ', JSON.stringify(error))
      })
    }

    if (options.images.length > 0) {
      return mediaUpload(options)
    } else {
      return statusUpdate(options)
    }
  }

  homeTimeline (options, callback) {
    this.api.get('statuses/home_timeline', options, (error, data, response) => {
      if (error) { 
        callback(error) 
      } else {
        let tweets = []
        data.forEach(tweet => {
          tweets.push(Parser.all(tweet))
        })
        callback(tweets)
      }
    })
  }

  userTimeline (options, callback) {
    this.api.get('statuses/user_timeline', options, (error, data, response) => {
      if (error) { 
        callback(error) 
      } else {
        let tweets = []
        data.forEach(tweet => {
          tweets.push(Parser.all(tweet))
        })
        callback(tweets)
      }
    })
  }

  favoritesList (options, callback) {
    this.api.get('favorites/list', options, (error, data, response) => {
      if (error) { 
        callback(error) 
      } else {
        let tweets = []
        data.forEach(tweet => {
          tweets.push(Parser.all(tweet))
        })
        callback(tweets)
      }
    })
  }

  userLists(options, callback) {
    this.api.get('lists/list', _.pick(_.assign(options, { user_id: options.id }), ['user_id', 'screen_name']), (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  listMembers(options, callback) { /* {list_id: options.list_id, slug: options.slug, owner_id: options.owner_id, owner_screen_name: options.owner_screen_name, include_entities: options.include_entities, skip_status: options.skip_status, cursor: options.cursor} */   
    this.api.get('lists/members', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postList(options, callback) {
    this.api.post('lists/create', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postListCreateAll(options, callback) {
    this.api.post('lists/members/create_all', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postListUpdate(options, callback) {
    this.api.post('lists/update', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postListDestroy(options, callback) {
    this.api.post('lists/destroy', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postRetweet(options, callback) {
    this.api.post('statuses/retweet', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postUnretweet(options, callback) {
    this.api.post(`statuses/unretweet/${options.id}`, options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postFavoritesCreate(options, callback) {
    this.api.post('favorites/create', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postFavoritesDestroy(options, callback) {
    this.api.post('favorites/destroy', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  postStatusDestroy(options, callback) {
    this.api.post('statuses/destroy', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  followersList(options) {
    return new Promise((resolve, reject) => {
      this.api.get('followers/list', options, (error, data, response) => {
        if (error) { 
          reject(new Error(error))
        } else {
          resolve(data)
        }
      })
    })
  }

  friendsList(options) {
    return new Promise((resolve, reject) => {
      this.api.get('friends/list', options, (error, data, response) => {
        if (error) { 
          reject(new Error(error))
        } else {
          resolve(data)
        }
      })
    })
  }

  friendshipCreate(options, callback) {
    this.api.post('friendships/create', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  friendshipDestroy(options, callback) {
    this.api.post('friendships/destroy', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  mutesCreate(options, callback) { /* {name: options.name, user_id: options.user_id} */
    this.api.post('mutes/users/create', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  mutesDestroy(options, callback) {
    this.api.post('mutes/users/destroy', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  blocksCreate(options, callback) {
    this.api.post('blocks/create', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  blocksDestroy(options, callback) {
    this.api.post('blocks/destroy', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  // https://developer.twitter.com/en/docs/trends/locations-with-trending-topics/api-reference/get-trends-available
  trendsAvailable(options, callback) {
    this.api.get('trends/available', {}, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  // https://developer.twitter.com/en/docs/trends/locations-with-trending-topics/api-reference/get-trends-closest
  trendsClosest(options, callback) {
    this.api.get('trends/closest', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

  // https://developer.twitter.com/en/docs/trends/trends-for-location/api-reference/get-trends-place
  trendsPlace(options, callback) {
    this.api.get('trends/place', options, (error, data, response) => {
      if (error) { 
        callback(error)
      } else {
        callback(data)
      }
    })
  }

}
