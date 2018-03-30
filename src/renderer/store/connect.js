import Database from '@/library/storage'
import Twitter from '@/library/twitter'
let settings = require('electron-settings')
let connection = settings.get('storage.connection')
let tokens = settings.get('twitter.tokens')

function getDb () {
  let db
  if (db === undefined) {
    db = new Database(connection)
  }
  return db
}

function getClient () {
  let client
  if (client === undefined) {
    client = new Twitter(tokens)
  }
  return client
}

export const db = getDb()
export const client = getClient()
export const account = settings.get('twitter.credentials')
