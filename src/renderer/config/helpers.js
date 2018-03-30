/**
 * Sort array alphabetically
 * 
 * @param {array} array 
 */
export function sortArray(array) {
  return array.sort((a, b) => {
    // var textA = a.name.toUpperCase();
    // var textB = b.name.toUpperCase();
    // return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  })
}

/**
 * 
 * @param {*} length 
 */
export function randomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * 
 * @param {*} arr 
 * @param {*} len 
 */
export function chunks(arr, len) {
  let chunks = []
  let i = 0
  let n = arr.length
  while (i < n) {
    chunks.push(arr.slice(i, i += len))
  }
  return chunks
}

/**
 * 
 * @param {*} amount 
 * @param {*} total 
 */
export function fpercent(amount, total) {
  return Math.floor((amount / total) * 100)
}

/**
 * Converts 3:30pm to 15:30
 */
export function convertTo24Hour(time) {
  var hours = parseInt(time.substr(0, 2));
  if (time.indexOf('am') !== -1 && hours === 12) {
      time = time.replace('12', '0');
  }
  if (time.indexOf('pm') !== -1 && hours < 12) {
      time = time.replace(hours, (hours + 12));
  }
  return time.replace(/(am|pm)/, '');
}

export function pad (val) {
  if (val <= 9) {
    return '0' + val;
  } else {
    return val;
  }
}
