import Vue from 'vue'
import Router from 'vue-router'
import firebase from '@/services/firebase/index'

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
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next()
      } else {
        next({
          name: 'login'
        })
      }
    })
  } else {
    next()
  }
})

export default router
