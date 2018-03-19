import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routerHome = [{
  path: '/',
  name: 'home-page',
  redirect: { name: 'welcome-page' },
  component: require('@/components/pages/Home').default
}]

const routerWelcome = [{
  path: '/welcome',
  name: 'welcome-page',
  component: require('@/components/pages/Welcome').default
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
    component: require('@/components/views/User/UserFriends').default
  }, {
    path: '/user/followers',
    name: 'user-followers',
    component: require('@/components/views/User/UserFollowers').default
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
    path: '/search/grid',
    name: 'search-grid',
    component: require('@/components/views/Search/SearchGrid').default
  }, {
    path: '/search/create',
    name: 'search-create',
    component: require('@/components/views/Search/SearchCreate').default
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
  ...routerHome,
  ...routerWelcome,
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
