/*
 * @Author: your name
 * @Date: 2020-05-07 14:50:12
 * @LastEditTime: 2020-05-09 09:49:52
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \athlete-information-cli4\src\utils\session.js
 */
import ase from './ase'
const setSession = (key, value) => {
  const val = JSON.parse(process.env.VUE_APP_ENCRYPT) ? ase.Encrypt(value) : value
  sessionStorage.setItem(key, JSON.stringify(val))
}
const getSession = (key) => {
  let value
  if (sessionStorage.getItem(key)) {
    const val = JSON.parse(process.env.VUE_APP_ENCRYPT)
    ? ase.Decrypt(JSON.parse(sessionStorage.getItem(key)))
    : JSON.parse(sessionStorage.getItem(key))
    value = val
  } else {
    return
  }
  return value
}
// 单个字段清除
const clearOneSession = (key) => {
  sessionStorage.removeItem(key)
}
// 全部删除
const clearAllSession = () => {
  sessionStorage.clear()
}
export default {
  set: setSession,
  get: getSession,
  clear: clearOneSession,
  clearAll: clearAllSession
}
