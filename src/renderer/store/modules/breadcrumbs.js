const state = {
  trails: [{
    page: 'dashboard',
    items: [{
      text: 'Home',
      disabled: false,
      to: '/'
    }, {
      text: 'Dashboard',
      disabled: false,
      to: '/lists'
    }]
  }, {
    page: 'expunge',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }, {
      text: 'Expunge',
      disabled: true,
      to: '/expunge'
    }]
  }, {
    page: 'status',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }, {
      text: 'Statuses',
      disabled: true,
      to: '/status'
    }]
  }, {
    page: 'lookup',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }, {
      text: 'Lookup Users',
      disabled: true,
      to: '/lookup'
    }]
  }, {
    page: 'search',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }, {
      text: 'Search Analytics',
      disabled: true,
      to: '/search'
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
    page: 'user',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }, {
      text: 'User Management',
      disabled: true,
      to: '/user'
    }]
  }, {
    page: 'settings',
    items: [{
      text: 'Dashboard',
      disabled: false,
      to: '/'
    }, {
      text: 'System Settings',
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
