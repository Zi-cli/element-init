/*
 * @Author: your name
 * @Date: 2020-05-07 14:50:12
 * @LastEditTime: 2021-04-14 10:53:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \athlete-information-cli4\src\router.js
 */
const Index = resolve => require(['@/views/index'], resolve)
const Login = resolve => require(['@/views/login'], resolve)// 登录页
// 系统管理l
const Account = resolve => require(['@/views/sysManager/account/index'], resolve) // 系统管理-账号管理
const Role = resolve => require(['@/views/sysManager/role/index'], resolve) // 系统管理-角色管理
const Menu = resolve => require(['@/views/sysManager/menu/index'], resolve) // 系统管理-菜单管理

const routes = [
  {
    path: '/',
    component: Index,
    redirect: '/login',
    children: [

      // 系统管理
      { path: '/account', component: Account, name: '账号管理', meta: { keepAlive: false } },
      { path: '/role', component: Role, name: '角色管理', meta: { keepAlive: false } },
      { path: '/menu', component: Menu, name: '菜单管理', meta: { keepAlive: false } }
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

export default routes
