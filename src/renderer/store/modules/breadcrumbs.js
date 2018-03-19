/**
 * Breadcrumbs
 */

const state = {
  trails: [{
    page: 'home',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }]
  }, {
    page: 'lists',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }, {
      text: 'Lists',
      disabled: true,
      to: '/lists'
    }]
  }, {
    page: 'settings',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }, {
      text: 'Settings',
      disabled: true,
      to: '/settings'
    }]
  }]
}

const getters = {
  getTrails: state => state.trails,
  getTrailById: (state) => (id) => {
    let found = state.trails.find(item => item.page === id)
    if (found) {
      return found.items
    }
  }
}

export default {
  state, getters
}
