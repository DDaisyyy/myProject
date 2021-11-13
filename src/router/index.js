import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config' //导入基础路由表
//实例化路由
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap   //路由表（传入的是普通路由）
})