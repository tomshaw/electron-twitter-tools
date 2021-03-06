export default function initialOptions () {
  return {
    id: 0,
    active: false,
    sessions: [],
    languages: [],
    locations: [],
    timezones: [],
    influential: [],
    places: [],
    words: [],
    results: {
      status_count: 0,
      quote_count: 0,
      reply_count: 0,
      retweet_count: 0,
      verified_count: 0,
      language_count: 0,
      timezone_count: 0,
      places_count: 0
    },
    sentiment: {
      negative: 0,
      positive: 0,
      neutral: 0
    }
  }
}
