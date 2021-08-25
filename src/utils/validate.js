/*
 * @Author: your name
 * @Date: 2020-06-30 15:57:24
 * @LastEditTime: 2021-03-19 17:51:56
 * @LastEditors: zx
 * @Description: In User Settings Edit
 * @FilePath: \fitness-goods\src\utils\validate.js
 */

import moment from 'moment'

// 固话+手机正则校验 非必传
const validateTelNum = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('手机号码不能为空'))
  }
  if (!value) {
    callback(new Error('请输入正确联系方式'))
  } else {
     if (/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确联系方式'))
    }
  }
}
// 正整数校验
const Integer = (rule, value, callback) => {
  if (/(^[1-9]\d*$)/.test(value)) {
    callback()
  } else {
    callback(new Error('只能输入正整数'))
  }
}
const Integer2 = (rule, value, callback) => {
  if (value) {
    if (/(^[1-9]\d*$)/.test(value)) {
      callback()
    } else {
      callback(new Error('只能输入正整数'))
    }
  } else {
    callback()
  }
}
// 密码
const passwordInteger = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else {
    if (/^[0-9A-Za-z]{6,12}$/.test(value)) {
      callback()
    } else {
      callback(new Error('只能输入6-12位密码'))
    }
  }
}
// 校验当前日期之前
const currentDate = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择入队日期'))
  } else {
    if (value > moment(new Date()).format('YYYY-MM-DD')) {
      callback(new Error('入队日期不能大于当天时间'))
    }
  }
}

const AccountPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else {
    let reg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,18}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('必须为6-18位的数字和字母组合'))
    }
  }
}
const otherCard = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入证件号码'))
  } else {
    let reg = /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/
    if (!reg.test(value)) {
      callback()
    } else {
      callback(new Error('请不要输入汉字'))
    }
  }
}

// 打印机端口号校验
const PortNumber = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入端口号'))
  } else {
    if (value <= 10000000) {
      if (/^[0-9]+$/.test(value)) {
        callback()
      } else {
        callback(new Error('端口号只能输入自然数'))
      }
    } else {
      callback(new Error('端口号为自然数且不能超过8位'))
    }
  }
}
// 身份证验证
const validateIdNum = (rule, value, callback) => {
  let iSum = 0
  const aCity = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
  const sBirthday = value.substr(6, 4) + '-' + Number(value.substr(10, 2)) + '-' + Number(value.substr(12, 2))
  const d = new Date(sBirthday.replace(/-/g, '/'))
  const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  for (let i = 0; i < 17; i++) iSum += value.substr(i, 1) * arrInt[i]
  const residue = arrCh[iSum % 11]
  if (!value) {
    callback(new Error('请输入身份证'))
  }
  if (!/^\d{17}(\d|x)$/i.test(value)) {
    callback(new Error('身份证长度或格式错误'))
  }
  if (aCity[parseInt(value.substr(0, 2))] === null) {
    callback(new Error('身份证地区非法'))
  }
  if (sBirthday !== (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())) {
    callback(new Error('身份证上出生日期非法'))
  }
  if (residue !== value.substr(17, 1)) {
    callback(new Error('身份证号非法'))
  } else {
    callback()
  }
}
// 银行卡正则
const validateBankCard = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入银行卡号'))
  } else {
    let reg = /^[1-9]\d{9,29}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的银行卡号'))
    }
  }
}
export default {
  validateTelNum: validateTelNum,
  passwordInteger: passwordInteger,
  Integer: Integer,
  currentDate: currentDate,
  AccountPassword: AccountPassword,
  PortNumber: PortNumber,
  validateIdNum,
  validateBankCard,
  otherCard,
  Integer2
}
