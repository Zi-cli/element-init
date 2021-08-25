/*
 * @Author: your name
 * @Date: 2021-02-17 21:21:07
 * @LastEditTime: 2021-04-19 18:00:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \瑞丰康体后台管理系统\src\utils\util.js
 */
import session from '@/utils/session'
const getTableHeight = (b, c, d, e) => {
    let all
    if (document.querySelector('.right')) {
        all = document.querySelector('.right').clientHeight
    } else {
        all = document.querySelector('.rightFull').clientHeight
    }
    const b1 = (b === null ? 0 : document.querySelector(b).clientHeight)
    const c1 = (c === null ? 0 : document.querySelector(c).clientHeight)
    const d1 = (d === null ? 0 : document.querySelector(d).clientHeight)
    const e1 = (e === null ? 0 : document.querySelector(e).clientHeight)

    return all - b1 - c1 - d1 - e1 - 62
}

// 根据出生日期计算年龄
const toGetAge = strBirthday => {
    let returnAge
    const strBirthdayArr = strBirthday.split('-')
    const birthYear = strBirthdayArr[0]
    const birthMonth = strBirthdayArr[1]
    const birthDay = strBirthdayArr[2]
    const d = new Date()
    const nowYear = d.getFullYear()
    const nowMonth = d.getMonth() + 1
    const nowDay = d.getDate()
    if (nowYear === birthYear) {
        returnAge = 0 // 同年则为0岁
    } else {
        const ageDiff = nowYear - birthYear
        // 年之差
        if (ageDiff > 0) {
            if (nowMonth === birthMonth) {
                const dayDiff = nowDay - birthDay // 日之差
                if (dayDiff < 0) {
                    returnAge = ageDiff - 1
                } else {
                    returnAge = ageDiff
                }
            } else {
                const monthDiff = nowMonth - birthMonth // 月之差
                if (monthDiff < 0) {
                    returnAge = ageDiff - 1
                } else if (monthDiff === 0) {
                    const dayDiff = nowDay - birthDay // 日之差
                    if (dayDiff < 0) {
                        returnAge = ageDiff - 1
                    } else {
                        returnAge = ageDiff
                    }
                } else {
                    returnAge = ageDiff
                }
            }
        } else {
            returnAge = 0 // 返回0 表示出生日期输入错误 晚于今天
        }
    }
    return returnAge // 返回周岁年龄
}
  const getRandomString = (len) => { // 随机成成字符
    // let len = len || 32
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    let maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }
  /**
   * 参数说明：str表示原字符串变量，flg表示要插入的字符串，sn表示要插入的位置
  */
  const insertFlg = (str, flg) => { // 动态加入随机字符
    return str.slice(0, 2) + flg + str.slice(2)
  }
  const removeFlg = (str, start, end) => { // str: 需要删除的字符串
    return str.slice(0, start) + str.slice(end)
  }
  const setPaw = (paw) => {
    return insertFlg(paw, getRandomString(20))
  }
  const getPaw = (paw) => {
    return removeFlg(paw, 2, 22)
  }
// 根据字典转换值显示
const dicShow = (dicname, val) => {
    let dicVal = ''
    const options = session.get('dict') ? session.get('dict')[dicname] : []
    if (options.length > 0) {
        options.map((item) => {
            if (Number(item.labelValue) === Number(val)) {
                dicVal = item.labelName
            }
        })
    }
    return dicVal
}

// 判断是否是服务上的相对图片，是的话不需要前缀
const photoShow = (url) => {
    let newUrl
    if (url.indexOf('photo') > -1) {
        newUrl = url
    } else {
        newUrl = process.env.VUE_APP_ImgLoadUrl + url
    }
    return newUrl
}
export default {
  getTableHeight: getTableHeight,
  toGetAge: toGetAge,
  setPaw: setPaw,
  getPaw: getPaw,
  dicShow,
  photoShow
}
