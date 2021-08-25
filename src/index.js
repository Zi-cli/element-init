/*
 * @Author: your name
 * @Date: 2021-02-17 21:21:07
 * @LastEditTime: 2021-03-26 11:09:29
 * @LastEditors: zx
 * @Description: In User Settings Edit
 * @FilePath: \瑞丰康体后台管理系统\src\index.js
 */
/* eslint-disable no-constant-condition */
import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import routes from './router'
import index from './App.vue'
import promise from 'es6-promise'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ZkTable from 'vue-table-with-tree-grid'
import { hasPermission } from './utils/btnPermissions'

import util from './utils/util'
import validate from './utils/validate'
import session from './utils/session'
import moment from 'moment'
import './utils/rem'
import store from './store'
import USlideVerify from '@uone/u-slide-verify'
import * as echarts from 'echarts'

promise.polyfill()

Vue.use(VueRouter)

Vue.use(ElementUI)
Vue.use(USlideVerify)
Vue.use(ZkTable)

Vue.prototype.$moment = moment
Vue.prototype.$util = util
Vue.prototype.$validate = validate
Vue.prototype.$session = session
Vue.prototype.$hasPer = hasPermission
Vue.prototype.$echarts = echarts

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (sessionStorage.getItem('token')) {
      if (session.get('unitId')) {
        if (session.get('vipStatus') !== '正常' && to.path !== '/member-home') {
          next(false)
          vm.$message.error('您还不是会员或会员已过期，续费后才能操作哦！')
        } else {
          next()
        }
      } else {
        next()
      }
    } else {
      sessionStorage.clear()
      next({ path: '/login' })
    }
  } else {
    next()
  }
})

const vm = new Vue({
  el: '#app',
  router,
  store,
  render: v => v(index)
})
// 响应拦截（配置请求回来的信息）
axios.defaults.timeout = 50000
axios.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  // 处理响应失败
  if (error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
    vm.$message.error('网络超时，请联系管理员!')
    return Promise.reject(error) // reject这个错误信息
  } else {
  // 处理响应数据
  // 403 : token错误、过期
  // 401: 无权限
  // 500 ： 服务错误
  switch (error.response.status) {
    case 500:
      vm.$message.error('服务端错误，请联系管理员！')
    break
    case 403:
      vm.$router.push('/login')
      sessionStorage.clear()
    break
    default:
      break
  }
    vm.$message.error(error.response.data.message)
  }
  return Promise.reject(error)
})
Vue.use(vm)
