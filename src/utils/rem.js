/*
 * @Author: your name
 * @Date: 2020-05-07 14:50:12
 * @LastEditTime: 2020-05-07 16:33:11
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \athlete-information-cli4\src\utils\rem.js
 */
(function (doc, win) {
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalc = function () {
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontSize = 20 * (clientWidth / 375) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
