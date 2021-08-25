/*
 * @Author: your name
 * @Date: 2021-04-14 10:38:20
 * @LastEditTime: 2021-04-19 17:02:21
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \rfkt-admin\src\api\api.js
 */
import request from '@/utils/request'

// 登录接口
export const login = (data) => {
  return request({
    method: 'post',
    url: '/public/account/login',
    data,
    isForm: true,
    isLogin: true
  })
}
// 字典列表
export const sysDictionaryList = (data) => {
  return request({
    method: 'get',
    url: '/public/sys_dictionary_list',
    data
  })
}
