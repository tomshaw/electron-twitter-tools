/**
 * REFERENCE
 * @see https://stackoverflow.com/questions/960156/regex-in-javascript-to-remove-links
 * @see https://stackoverflow.com/questions/9364400/remove-not-alphanumeric-characters-from-string-having-trouble-with-the-char
 */
import dictionary from './lexicon'

export default class SentimentAnalysis {

  constructor(tweet) {
    return this.process(this.prepare(tweet))
  }

  process(string) {

    let array = string.toLowerCase().split(' ')

    let filtered = array.filter((word) => {
      return word.length >= 3
    })
    
    let wordArray = [...new Set(filtered)]

    let total = 0
    let match = []

    wordArray.forEach((word) => {
      if (typeof dictionary[word] !== 'undefined') {
        total += dictionary[word]
        match.push({
          word: word,
          value: dictionary[word]
        })
      }
    })

    if (typeof total === 'string') {
      match = []
      total = 0
    }

    return {
      'score': total,
      'match': match,
      'tweet': string.trim()
    }
  }

  prepare(text) {

    const apply = {
      'anchor': {
        'regex': /<\/?a[^>]*>/g,
        'replace': ' '
      },
      'numeric': {
        'regex': /[^A-Za-z0-9]/g,
        'replace': ' '
      }
    }

    Object.keys(apply).forEach((key) => {
      const rule = apply[key]
      if (rule.regex) {
        text = text.replace(rule.regex, rule.replace)
      }
    })

    return text
  }

}
