<h1><img src="https://raw.github.com/tomshaw/electron-twitter-tools/master/docs/logo.png" alt="Electron Twitter Tools" title="Electron Twitter Tools"></h1>

[![Build Status](https://travis-ci.org/tomshaw/electron-twitter-tools.svg?branch=master)](https://travis-ci.org/tomshaw/electron-twitter-tools)
[![Tag](https://img.shields.io/github/tag/tomshaw/electron-twitter-tools.svg)](https://github.com/tomshaw/electron-twitter-tools/tags)
[![GitHub (pre-)release](https://img.shields.io/github/release/tomshaw/electron-twitter-tools/all.svg)](https://github.com/tomshaw/electron-twitter-tools/releases)
[![Version npm](https://img.shields.io/npm/v/electron-twitter-tools.svg)](https://www.npmjs.com/package/electron-twitter-tools)
[![Downloads npm](https://img.shields.io/npm/dt/electron-twitter-tools.svg)](https://www.npmjs.com/package/electron-twitter-tools)
[![MIT license](https://img.shields.io/npm/l/electron-twitter-tools.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/tomshaw/electron-twitter-tools.svg?style=social&label=Star)](https://github.com/tomshaw/electron-twitter-tools)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Overview

> Electron Twitter Tools a cross platfom [Electron](https://electronjs.org) application that allows users to effortlessly backup and restore user lists, seamlessly manage friends and followers, perform powerful multi account user searches and finally execute highly customized streaming searches that index a litany of data including languages used, geographic locations and rudimentary sentiment analysis.

## Screen Shots
As part of the documentation you can check out more [random screenshots here.](docs/screenshots/readme.md)

<img src="docs/screenshots/screen-grab1.png" alt="Electron Twitter Tools" title="Electron Twitter Tools">

## Build Setup
Once the application is launched you will need to provide your own Twitter API keys in the application configuration panel. An Sqlite3 database comes pre-selected and ready to use by default. A Google Maps API key is also required and can also be added in the application settings control panel.

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test

# lint all JS/Vue component files in `src/`
npm run lint

```

## Features

Functionality you'll find in this application include:

- User list management including backup and restore options.
- A highly customized streaming search that indexes a litany of data.
- A multi user account lookup that returns most of the relevant metadata. 
- Delete user statuses tweets and favorites based on search criteria.
- Supports multiple storage backends special thanks to [Knex.js](http://knexjs.org/)

## Libraries Used

+ [Electron](https://electronjs.org) - Build cross platform desktop apps with JavaScript, HTML, and CSS.
+ [Electron Vue](https://github.com/SimulatedGREG/electron-vue) - An Electron & Vue.js quick start boilerplate with vue-cli
+ [Vue](https://vuejs.org) - A progressive, JavaScript framework for building UI on the web.
+ [Vuex](https://vuex.vuejs.org/en) - Vuex is a state management pattern + library for Vue.js applications..
+ [Vuetify](https://vuetifyjs.com/en) - Vuetify is a semantic material component framework for Vue.js.
+ [VueChart.js](http://vue-chartjs.org) - Easy and beautiful charts with Chart.js and Vue.js.
+ [Knex.js](http://knexjs.org/) - An SQL query builder designed to be flexible, portable, and fun to use.

## Contributing
The project was originaly developed to learn the basics of [Electron](https://electronjs.org), [Vue](https://vuejs.org), [Vuex](https://vuex.vuejs.org/en) and [Vuetify](https://vuetifyjs.com/en) and was developed rather hastily. Many of the components are incomplete or could use vast improvements. Any pull requests, suggestions or ideas are highly welcomed.

## AFINN

This project makes use of [AFINN](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010) a list of English words rated for valence with an integer between minus five (negative) and plus five (positive). The words have been manually labeled by Finn Årup Nielsen in 2009-2011. This database of words is copyright protected and distributed under the [Open Database License (ODbL) v1.0](http://www.opendatacommons.org/licenses/odbl/1.0).

## License

See the bundled LICENSE file for details.

## Author

Tom Shaw (@urlrider)
