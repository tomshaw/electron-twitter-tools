import {
  SEARCH_SETTINGS_INCLUDE,
  SEARCH_SETTINGS_EXCLUDE,
  SEARCH_SETTINGS_LIMITED
} from '@/config/constants'
import langs from '@/config/languages'

export default function initialState () {
  return {
    options: {
      title: '',
      type: 'user',
      keyword: null,
      include_retweets: true,
      include_quotes: true,
      include_language: false,
      verified_accounts: true
    },
    retweets: [{ 
      text: 'Include',
      value: SEARCH_SETTINGS_INCLUDE 
    }, { 
      text: 'Limit',
      value: SEARCH_SETTINGS_LIMITED 
    }, { 
      text: 'Exclude',
      value: SEARCH_SETTINGS_EXCLUDE 
    }],
    verified: [{ 
      text: 'Include',
      value: SEARCH_SETTINGS_INCLUDE 
    }, { 
      text: 'Limit',
      value: SEARCH_SETTINGS_LIMITED 
    }, { 
      text: 'Exclude',
      value: SEARCH_SETTINGS_EXCLUDE 
    }],
    quotes: [{ 
      text: 'Include',
      value: SEARCH_SETTINGS_INCLUDE 
    }, { 
      text: 'Limit',
      value: SEARCH_SETTINGS_LIMITED 
    }, { 
      text: 'Exclude',
      value: SEARCH_SETTINGS_EXCLUDE 
    }],
    langs,
    valid: false,
    titleRules: [
      v => !!v || 'A search title is required.'
    ],
    keywordRules: [
      v => !!v || 'A search term is required.',
      v => (v && v.length > 3) || 'A search term must be at least 3 characters.'
    ]
  }
}
