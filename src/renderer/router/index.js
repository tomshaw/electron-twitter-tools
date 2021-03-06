import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routerDashboard = [{
  path: '/',
  name: 'dashboard-page',
  component: require('@/components/pages/Dashboard').default,
  props: { 
    sidebar: true 
  }
}]

const routerLists = [{
  path: '/lists',
  name: 'lists-page',
  component: require('@/components/pages/Lists').default
}]

const routerStatus = [{
  path: '/status',
  components: {
    default: require('@/components/pages/Status').default
  },
  children: [{
    path: '',
    component: require('@/components/views/status/StatusHome').default
  }, {
    path: '/status/tweets',
    component: require('@/components/views/status/StatusTweets').default
  }, {
    path: '/status/favorites',
    component: require('@/components/views/status/StatusFavorites').default
  }]
}]

const routerUser = [{
  path: '/user',
  components: {
    default: require('@/components/pages/User').default
  },
  children: [{
    path: '/user/friends',
    name: 'user-friends',
    component: require('@/components/views/user/UserFriends').default
  }, {
    path: '/user/followers',
    name: 'user-followers',
    component: require('@/components/views/user/UserFollowers').default
  }]
}]

const routerExpunge = [{
  path: '/expunge',
  name: 'expunge-page',
  component: require('@/components/pages/Expunge').default
}]

const routerSearch = [{
  path: '/search',
  components: {
    default: require('@/components/pages/Search').default
  },
  children: [{
    path: '',
    name: 'search-grid',
    component: require('@/components/views/search/grid/SearchGrid').default
  }, {
    path: '/search/session',
    name: 'search-session',
    component: require('@/components/views/search/session/SearchSession').default
  }, {
    path: '/search/results/:id',
    name: 'search-results',
    component: require('@/components/views/search/results/SearchResults').default
  }]
}]

const routerLookup = [{
  path: '/lookup',
  name: 'lookup-page',
  component: require('@/components/pages/Lookup').default
}]

const routerSettings = [{
    path: '/settings',
    name: 'settings-page',
    component: require('@/components/pages/Settings').default
}]

const redirectMe = [{
  path: '/redirect-me',
  redirect: {
    name: 'home-page'
  }
}]

const redirectAll = [{
  path: '*',
  redirect: '/'
}]

const routes = [
  ...routerDashboard,
  ...routerLists,
  ...routerStatus,
  ...routerExpunge,
  ...routerSearch,
  ...routerLookup,
  ...routerSettings,
  ...routerUser,
  ...redirectMe,
  ...redirectAll
]

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return { y: 0 }
  }
}

const router = new Router({
  routes,
  scrollBehavior,
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/settings-test') {
    let test = true
    if (test) {
      next()
    } else {
      router.push('/settings')
    }
  } else {
    next()
  }
})

export default router
