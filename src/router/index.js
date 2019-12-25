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
      path: '/',
      component: loadView('Base'),
      children: [
        {
          path: '',
          name: 'home',
          component: loadView('Channel'),
          meta: {
            auth: true
          }
        },
        {
          path: '/create-channel',
          name: 'new-channel',
          component: loadView('NewChannel'),
          meta: {
            auth: true
          }
        },
        {
          path: '/channel/:id',
          name: 'channel',
          component: loadView('Channel'),
          meta: {
            auth: true
          }
        },
        {
          path: '/login',
          name: 'login',
          component: loadView('Login')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
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
