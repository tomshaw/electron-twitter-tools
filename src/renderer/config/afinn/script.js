var fs = require('fs');

var processData = (next) => {
    console.log('BEGIN PROCESS')
    const array = fs.readFileSync('AFINN-111.txt').toString().split('\r\n');
    let save = []
    for (let i in array) {
      let row = array[i].split('\t')
      save.push({
        'word': row[0],
        'value': row[1]
      })
    }
    return next(save)
}

processData((data) => {
  fs.writeFile('./afinn.json', JSON.stringify(data), 'utf-8', (err) => {
    if (err) throw err
    console.log('FINISHED PROCESS')
    process.exit(0)
  })
})
