'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

import TwitterDecorator from './ipc/twitter'
import TwitterAccount from './ipc/twitter/component/account'
import TwitterCredentials from './ipc/twitter/component/credentials'

import StorageDecorator from './ipc/storage'
import StorageSchema from './ipc/storage/component/schema'
import StorageConfig from './ipc/storage/component/config'

import {
  IPC_REQUEST_SCHEMA_CREATE,
  IPC_RESPONSE_SCHEMA_CREATE,
  IPC_REQUEST_SCHEMA_CONFIG,
  IPC_RESPONSE_SCHEMA_CONFIG,
  IPC_REQUEST_TWITTER_SETTINGS,
  IPC_RESPONSE_TWITTER_SETTINGS,
  IPC_REQUEST_TWITTER_CREDENTIALS,
  IPC_RESPONSE_TWITTER_CREDENTIALS
} from '../renderer/config/constants'

// console.dir(object, {depth: null, colors: true})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on(IPC_REQUEST_SCHEMA_CREATE, (event, args) => {
  return new StorageDecorator(new StorageSchema(), args, (result) => {
    event.sender.send(IPC_RESPONSE_SCHEMA_CREATE, result)
  })
})

ipcMain.on(IPC_REQUEST_SCHEMA_CONFIG, (event, args) => {
  return new StorageDecorator(new StorageConfig(), args, (result) => {
    event.sender.send(IPC_RESPONSE_SCHEMA_CONFIG, result)
  })
})

ipcMain.on(IPC_REQUEST_TWITTER_SETTINGS, (event, args) => {
  return new TwitterDecorator(new TwitterAccount(), args, (result) => {
    event.sender.send(IPC_RESPONSE_TWITTER_SETTINGS, result)
  })
})

ipcMain.on(IPC_REQUEST_TWITTER_CREDENTIALS, (event, args) => {
  return new TwitterDecorator(new TwitterCredentials(), args, (result) => {
    event.sender.send(IPC_RESPONSE_TWITTER_CREDENTIALS, result)
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
