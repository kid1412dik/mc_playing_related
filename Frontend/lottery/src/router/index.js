import Vue from 'vue'
import VueRouter from 'vue-router'

const userView = () => import('../views/userView.vue')
const managerView = () => import('../views/managerView.vue')
Vue.use(VueRouter)

const routes = [
  {
    path:'',
    redirect:'/user'
  },
  {
    path:'/user',
    component: userView
  },
  {
    path:'/manager',
    components: managerView
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
