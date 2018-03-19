<h1><img src="https://raw.github.com/tomshaw/electron-twitter-tools/master/docs/logo.png" alt="Electron Twitter Tools"></h1>

[![Build Status](https://travis-ci.org/tomshaw/electron-twitter-tools.svg?branch=master)](https://travis-ci.org/tomshaw/electron-twitter-tools)
[![Tag](https://img.shields.io/github/tag/tomshaw/electron-twitter-tools.svg)](https://github.com/tomshaw/electron-twitter-tools/tags)
[![GitHub (pre-)release](https://img.shields.io/github/release/tomshaw/electron-twitter-tools/all.svg)](https://github.com/tomshaw/electron-twitter-tools/releases)
[![Version npm](https://img.shields.io/npm/v/electron-twitter-tools.svg)](https://www.npmjs.com/package/electron-twitter-tools)
[![Downloads npm](https://img.shields.io/npm/dt/electron-twitter-tools.svg)](https://www.npmjs.com/package/electron-twitter-tools)
[![MIT license](https://img.shields.io/npm/l/electron-twitter-tools.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/tomshaw/electron-twitter-tools.svg?style=social&label=Star)](https://github.com/tomshaw/electron-twitter-tools)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> A cross platfom [Electron](https://electronjs.org) application that allows users to backup and restore lists. A powerful multi-user lookup feature that returns most of the relevant API metadata. A highly customized streaming search that harvests a litany of data including languages used, geographic locations, user markers and rudimentary sentiment analysis. Supports mulitple storage backends thanks to [Knex.js](http://knexjs.org/) including Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift.

## Overview

This project was originaly developed to learn the basics of [Electron](https://electronjs.org), [Vue](https://vuejs.org), [Vuex](https://vuex.vuejs.org/en) and [Vuetify](https://vuetifyjs.com/en). Second Twitter's powerful programming API offers developers the unique ability to develop exciting features not offered out of the box.

## Features

Functionality you'll find in this application supports the following features:

- Ability to backup and restore user lists limited only by Twitter's API.
- A robust customized streaming search that harvests a litany of data.
- A multi account lookup that returns most of the relevant API metadata. 
- The ability to expunge user statuses based on robust search criteria.
- Supports multiple storage backends special thanks to [Knex.js](http://knexjs.org/)

## Build Setup
Once the application is launched you will need to provide your own Twitter API keys in the application configuration panel. An Sqlite3 database comes pre-installed and ready to use by default. If you wish to use an alternative storage solution [Knex.js](http://knexjs.org/) currently supports Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift. At this time only Sqlite3 and MySQL have been tested. The system is designed to easily test the others.

``` bash
# install dependencies
npm install

# step is required for sqlite3 module
npm run rebuild

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test

# lint all JS/Vue component files in `src/`
npm run lint

```

## Awesome Libraries Used

+ [Electron](https://electronjs.org) - Build cross platform desktop apps with JavaScript, HTML, and CSS.
+ [Electron Vue](https://github.com/SimulatedGREG/electron-vue) - An Electron & Vue.js quick start boilerplate with vue-cli
+ [Vue](https://vuejs.org) - A progressive, JavaScript framework for building UI on the web.
+ [Vuex](https://vuex.vuejs.org/en) - Vuex is a state management pattern + library for Vue.js applications..
+ [Vuetify](https://vuetifyjs.com/en) - Vuetify is a semantic material component framework for Vue.js.
+ [VueChart.js](http://vue-chartjs.org) - Easy and beautiful charts with Chart.js and Vue.js.
+ [Knex.js](http://knexjs.org/) - An SQL query builder designed to be flexible, portable, and fun to use.

## Contributing
This project was developed to learn the basics of Electron and Vue.js. The project was developed rather hastily. Many of the components are incomplete or could use vast improvements. Any pull requests, suggestions or ideas to enhance the project are highly welcomed. Please read the contributing guide thoroughly before issuing pull requests.

## AFINN

AFINN is a list of English words rated for valence with an integer
between minus five (negative) and plus five (positive). The words have
been manually labeled by Finn Årup Nielsen in 2009-2011. This database 
of words is copyright protected and distributed under:

- [Open Database License (ODbL) v1.0](http://www.opendatacommons.org/licenses/odbl/1.0)

## License

(The MIT License)

Copyright (c) 2018 Tom Shaw 

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
