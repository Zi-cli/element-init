/*
 * @Author: your name
 * @Date: 2021-02-17 21:21:07
 * @LastEditTime: 2021-02-25 15:02:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \瑞丰康体后台管理系统\src\utils\btnPermissions.js
 */

export function hasPermission (perm) {
  const permissionBtns = JSON.parse(sessionStorage.getItem('btnPermissions'))
  if (permissionBtns) {
    const btnName = permissionBtns.map(res => {
      return res.menuName
    })
    return btnName.indexOf(perm) > -1
  }
}
