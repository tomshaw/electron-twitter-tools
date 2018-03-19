import twitterText from 'twitter-text'
import twemoji from 'twemoji'

export default class Parser {

  static addWeight (text) {
    return twitterText.parseTweet(text)
  }

  static autoLink (text, symbol = true, target = true) {
    return twitterText.autoLink(text, {
      'usernameIncludeSymbol': symbol,
      'targetBlank': target
    })
  }

  static parseEmojis (text) {
    return twemoji.parse(text)
  }

  static extractEntities (text, urlsWithoutProtocol = true) {
    return twitterText.extractEntitiesWithIndices(text, {
      extractUrlsWithoutProtocol: urlsWithoutProtocol
    })
  }
  
  static all(tweet) {
    const text = tweet.text
    try {
      if (tweet.retweeted_status) {
        tweet.retweeted_status.weight = this.addWeight(tweet.retweeted_status.text)
        tweet.retweeted_status.text_html = this.autoLink(tweet.retweeted_status.text, false)
        tweet.retweeted_status.text_html = this.parseEmojis(tweet.retweeted_status.text_html)
        tweet.retweeted_status.extracted = this.extractEntities(tweet.retweeted_status.text, false)
      } else {
        tweet.weight = this.addWeight(text)
        tweet.text_html = this.autoLink(text, false)
        tweet.text_html = this.parseEmojis(tweet.text_html)
        tweet.extracted = this.extractEntities(text, true)
      }
      return tweet
    } catch (err) {}
  }

}
