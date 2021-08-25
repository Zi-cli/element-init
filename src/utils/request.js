/*
 * @Author: your name
 * @Date: 2021-02-17 21:21:07
 * @LastEditTime: 2021-04-14 10:51:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \瑞丰康体后台管理系统\src\utils\request.js
 */

import axios from 'axios'
import qs from 'qs'
import util from './util'
axios.defaults.headers['Cache-Control'] = 'no-cache'
export default function request (options) {
  let { method = 'get', url, data, isForm, isUpload, isText } = options
  let host = ''
  let path = ''
  if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
    host = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
    path = url.slice(host.length)
  } else {
    host = process.env.VUE_APP_URL
    // host = 'http://172.20.13.59:8520'
    path = url
  }
  url = host + path
  const parData = isForm ? qs.stringify(data) : data
  if (isForm) {
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded' // 表单传值
  } else if (isUpload) {
    axios.defaults.headers['Content-Type'] = 'multipart/form-data' // 上传图片文件类型
  } else if (isText) {
    axios.defaults.headers['Content-Type'] = 'text/plain;charset=UTF-8'
  } else {
    axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
  }
  if (sessionStorage.getItem('token')) {
    axios.defaults.headers.token = window.atob(util.getPaw(sessionStorage.getItem('token')))
  } else {
    axios.defaults.headers.token = ''
  }
  if (sessionStorage.getItem('authorization')) {
    axios.defaults.headers.Authorization = window.atob(util.getPaw(sessionStorage.getItem('authorization')))
  } else {
    axios.defaults.headers.Authorization = ''
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: {
          ...parData
        }
      })
    case 'delete':
      return axios.delete(url, {
        data: parData
      })
    case 'post':
      return axios.post(url, parData)
    case 'put':
      return axios.put(url, parData)
    case 'patch':
      return axios.patch(url, parData)
    case 'down': // 文件下载
      return axios.get(url, {
        params: parData,
        responseType: 'blob'
      })
      case 'postdown': // 文件下载
      return axios.post(url, parData, {
        responseType: 'blob'
      })
    default:
      return axios(options)
  }
}
