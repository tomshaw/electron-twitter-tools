import Database from '@/library/storage'
import Twitter from '@/library/twitter'
const settings = require('electron-settings')

function getDb () {
  let db
  if (db === undefined) {
    db = new Database(settings.get('storage.connection'))
  }
  return db
}

function getClient () {
  let client
  if (client === undefined) {
    client = new Twitter(settings.get('twitter.tokens'))
  }
  return client
}

export const db = getDb()
export const client = getClient()
export const account = settings.get('twitter.profile')
