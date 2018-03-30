var fs = require('fs');

var processData = (next) => {
    console.log('BEGIN PROCESS')
    const obj = JSON.parse(fs.readFileSync('locations.json', 'utf8'))
    const array = obj.trendLocations
    let save = []
    for (i in array) {
      let row = array[i]
      save.push({
        'name': row.name,
        'country': row.countryName,
        'woeid': row.woeid,
        'type': row.placeTypeCode
      })
    }
    
    return next(save)
}

processData((data) => {
  fs.writeFile('./locations2.json', JSON.stringify(data), 'utf-8', (err) => {
    if (err) throw err
    console.log('FINISHED PROCESS')
    process.exit(code = 0)
  })
})
