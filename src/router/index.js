import Vue from 'vue'

// @会自动找到src路径下的文件
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Users from '@/views/users.vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      name:'home',
      path:'/',
      component:Home,
      children:[{path:'/users',component:Users}]
    },{
    name:'login',
    path:'/login',
    component:Login
  }]
})
