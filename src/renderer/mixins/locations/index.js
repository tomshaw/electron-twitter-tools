import {sortArray} from '@/config/helpers'
import locations from '@/config/locations.json'
import * as types from '@/config/constants'

export default {
  name: 'electron-locations',
  methods: {
    $getCountries: () => {
      let data = locations.filter(item => item.type === types.LOCATION_TYPE_COUNTRY)
      return sortArray(data)
    },
    $getCities: () => {
      let data = locations.filter(item => item.type === types.LOCATION_TYPE_CITY)
      return sortArray(data)
    }
  }
}
