import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

Vue.use(Router)

function loadView(view) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: loadView('Login')
    },
    {
      path: '/',
      component: loadView('Base'),
      meta: { authRequired: true },
      children: [
        {
          path: '',
          name: 'home',
          component: loadView('Channel')
        },
        {
          path: '/channel/create',
          name: 'channel-create',
          component: loadView('ChannelForm')
        },
        {
          path: '/channel/:id/edit',
          name: 'channel-edit',
          component: loadView('ChannelForm')
        },
        {
          path: '/channel/:id',
          name: 'channel',
          component: loadView('Channel')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    const isAuth = store.getters['auth/isAuthenticated']

    if (!isAuth) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
