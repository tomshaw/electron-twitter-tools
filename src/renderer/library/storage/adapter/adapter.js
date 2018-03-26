var async = require('async')

export default class Adapter {

  constructor(client) {
    this.client = client
  }

  validate(callback) {
    this.api.select('key', 'value').from('config').then(data => {
      callback(data)
    }).catch(error => {
      callback(error)
    })
  }

  getVersionNumber(callback) {
    this.api('config').where('key', 'version_number').then(data => {
      callback(data)
    }).catch(error => {
      callback(error)
    })
  }

  dropTables() {

    this.api.schema.dropTableIfExists('config').then(() => {
      console.dir('Config Table is Deleted!')
    })

    this.api.schema.dropTableIfExists('lists').then(() => {
      console.dir('Lists Table is Deleted!')
    })

    this.api.schema.dropTableIfExists('store').then(() => {
      console.dir('Store Table is Deleted!')
    })
  }

  createTables(callback) {
    async.waterfall([
      (callback) => {
        this.createConfigTable(result => {
          callback(result)
        })
      }, (callback) => {
        this.createListsTable(result => {
          callback(result)
        })
      }, (callback) => {
        this.createStoreTable(result => {
          callback(result)
        })
      }
    ], callback)
  }

  createConfigTable(callback) {
    this.api.schema.createTableIfNotExists('config', table => {
      table.collate('utf8mb4_general_ci')
      table.string('key').collate('utf8mb4_general_ci')
      table.string('value').collate('utf8mb4_general_ci')
    }).then(response => {
      callback(response)
    }).catch(error => {
      callback(error)
    })
  }

  createListsTable(callback) {
    this.api.schema.createTableIfNotExists('lists', table => {
      table.collate('utf8mb4_general_ci')
      table.increments().unsigned().primary()
      table.bigInteger('list_id').unsigned()
      table.string('slug').collate('utf8mb4_general_ci')
      table.timestamps()
    }).then(response => {
      callback(response)
    }).catch(error => {
      callback(error)
    })
  }

  createListsStoreTable(callback) {
    // this.api.schema.dropTableIfExists('lists_store').then(() => {
    //   console.dir('TABLE_DELETED: lists_store')
    // })
    this.api.schema.createTableIfNotExists('lists_store', table => {
      table.collate('utf8mb4_general_ci')
      table.increments().unsigned().primary()
      table.bigInteger('list_id').unsigned()
      table.bigInteger('user_id').unsigned()
      table.text('name').nullable().collate('utf8mb4_general_ci')
      table.text('screen_name').nullable().collate('utf8mb4_general_ci')
      table.text('location').nullable().collate('utf8mb4_general_ci')
      table.text('description').nullable().collate('utf8mb4_general_ci')
      table.text('url').nullable().collate('utf8mb4_general_ci')
      table.integer('followers').nullable().unsigned()
      table.integer('friends').nullable().unsigned()
      table.string('time_zone').collate('utf8mb4_general_ci')
      table.integer('verified').unsigned()
      table.integer('statuses_count').nullable().unsigned()
      table.string('lang').nullable().collate('utf8mb4_general_ci')
      table.string('profile_image').nullable().collate('utf8mb4_general_ci')
    }).then(response => {
      callback(response)
    }).catch(error => {
      callback(error)
    })
  }

  createSearchSessionTable(callback) {
    // this.api.schema.dropTableIfExists('search_session').then(() => {
    //   console.dir('TABLE_DELETED: search_session')
    // })
    this.api.schema.createTableIfNotExists('search', table => {
      table.collate('utf8mb4_general_ci')
      table.increments().unsigned().primary()
      table.string('type').collate('utf8mb4_general_ci')
      table.string('title').collate('utf8mb4_general_ci')
      table.string('keyword').collate('utf8mb4_general_ci')
      table.string('include_retweets').nullable().collate('utf8mb4_general_ci')
      table.string('include_quotes').nullable().collate('utf8mb4_general_ci')
      table.text('include_language').nullable().collate('utf8mb4_general_ci')
      table.string('verified_accounts').nullable().collate('utf8mb4_general_ci')
      table.dateTime('start_time').nullable()
      table.dateTime('end_time').nullable()
    }).then(response => {
      callback(response)
    }).catch(error => {
      callback(error)
    })
  }

  createSearchStoreTable(callback) {
    // this.api.schema.dropTableIfExists('search_store').then(() => {
    //   console.dir('TABLE_DELETED: search_store')
    // })
    this.api.schema.createTableIfNotExists('search_store', table => {
      table.collate('utf8mb4_general_ci')
      table.increments().unsigned().primary()
      table.integer('session_id').unsigned()
      table.string('coordinates_type').nullable().collate('utf8mb4_general_ci')
      table.decimal('coordinates_lat', [9], [6]).nullable()
      table.decimal('coordinates_lng', [9], [6]).nullable()
      // Place data
      table.text('place_coordinates', ['longtext']).nullable().collate('utf8mb4_general_ci')
      table.string('place_type').nullable().collate('utf8mb4_general_ci')
      table.string('place_country').nullable().collate('utf8mb4_general_ci')
      table.string('place_country_code').nullable().collate('utf8mb4_general_ci')
      table.string('place_name').nullable().collate('utf8mb4_general_ci')
      table.string('place_full_name').nullable().collate('utf8mb4_general_ci')

      table.integer('favorite_count').nullable()
      table.string('filter_level').nullable().collate('utf8mb4_general_ci')
      table.bigInteger('tweet_id').unsigned()
      table.integer('is_reply').nullable().unsigned()
      table.integer('is_quote').nullable().unsigned()
      table.string('lang').nullable().collate('utf8mb4_general_ci')
      table.integer('possibly_sensitive').nullable().unsigned()
      table.integer('quote_count').nullable().unsigned()
      table.integer('reply_count').nullable().unsigned()
      table.integer('retweet_count').nullable().unsigned()
      table.text('text', ['longtext']).nullable().collate('utf8mb4_general_ci')
      //user info
      table.bigInteger('user_id').unsigned()
      table.text('name').nullable().collate('utf8mb4_general_ci')
      table.text('screen_name').nullable().collate('utf8mb4_general_ci')
      table.text('description', ['longtext']).nullable().collate('utf8mb4_general_ci')
      table.integer('user_default_profile').nullable().unsigned()
      table.integer('user_default_profile_image').nullable().unsigned()
      table.string('profile_background_image_url').nullable().collate('utf8mb4_general_ci')
      table.integer('statuses_count').nullable().unsigned()
      table.integer('favourites_count').nullable().unsigned()
      table.integer('followers_count').nullable().unsigned()
      table.integer('friends_count').nullable().unsigned()
      table.integer('listed_count').nullable().unsigned()
      table.text('location').nullable().collate('utf8mb4_general_ci')
      table.integer('protected').nullable().unsigned()
      table.string('time_zone').nullable().collate('utf8mb4_general_ci')
      table.integer('verified').nullable().unsigned()
      table.dateTime('created_at')
    }).then(response => {
      callback(response)
    }).catch(error => {
      callback(error)
    })
  }

  addConfigData(callback) {
    this.api('config').insert([{
      key: 'package_name',
      value: process.env.npm_package_name
    }, {
      key: 'version_number',
      value: process.env.npm_package_version
    }, {
      key: 'installation_date',
      value: this.api.fn.now()
    }]).then(response => {
      callback(response)
    }).catch(error => {
      callback(error)
    })
  }

}
