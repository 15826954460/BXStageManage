/* eslint-disabled */
import Vue from 'vue'
// 取登陆用户的后两位
Vue.filter('lastName', (value) => {
  if (!value) return ''
  if (value.length > 2) {
    return value.slice(-2)
  } else {
    return value
  }
})

// 日期格式化
let formatTime = (type, value) => {
  if (!value) return
  let date = new Date(value)
  let [Y, M, D, H, Ms, S] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
  let returnVal = null
  M = parseInt(M) < 10 ? ('0' + M) : M
  D = parseInt(D) < 10 ? ('0' + D) : D
  H = parseInt(H) < 10 ? ('0' + H) : H
  Ms = parseInt(Ms) < 10 ? ('0' + Ms) : Ms
  S = parseInt(S) < 10 ? ('0' + S) : S
  switch (type) {
    case 'year':
      returnVal = Y
      break
    case 'date':
      returnVal = Y + '-' + M + '-' + D
      break
    case 'time':
      returnVal = H + ':' + Ms + ':' + S
      break
    case 'dateTime':
      returnVal = Y + '-' + M + '-' + D + ' ' + H + ':' + Ms + ':' + S
  }
  return returnVal
}
// 解决浏览器兼容
let CompatiblWith = function (value) {
  let date
  if (value) {
    // 解决火狐浏览器和safari浏览器的bug
    if (navigator.userAgent.indexOf('Safari') >= 0) {
      date = new Date(value + '+08:00')
    } else {
      date = new Date(value)
    }
  }
  return date
}
// 格式化 YYYY
Vue.filter('year', function (value) {
  return formatTime('year', CompatiblWith(value))
})
// 格式化 YYYY-MM-DD
Vue.filter('date', function (value) {
  return formatTime('date', CompatiblWith(value))
})
// 格式化到 HH:MS:SS
Vue.filter('time', function (value) {
  return formatTime('year', CompatiblWith(value))
})
// 格式化到  YYYY-MM-DD HH:MS:SS
Vue.filter('dateTime', function (value) {
  return formatTime('dateTime', CompatiblWith(value))
})

// 金额做千位符格式化并保留两位小数  如果是数字就直接做千位符格式化，不保留两位小数
let toThousands = (num, type) => {
  let result = ''
  if (num) {
    if (type === 'num') {
      let numStr = num.toString()
      while (numStr.length > 3) {
        result = ',' + numStr.slice(-3) + result
        numStr = numStr.slice(0, numStr.length - 3)
      }
      result = numStr + result
    } else {
      num = Number(num.toString() || 0).toFixed(2)
      let numAry = num.toString().split('.')
      let preNum = numAry[0]
      let lastNum = numAry[1]
      while (preNum.length > 3) {
        result = ',' + preNum.slice(-3) + result
        preNum = preNum.slice(0, preNum.length - 3)
      }
      if (preNum) {
        result = preNum + result
      }
      result = result + '.' + lastNum
    }
  } else {
    result = '0.00'
  }
  return result
}

Vue.filter('formatToThree', (value, type) => {
  return toThousands(value, type)
})
// 最长12个字符
Vue.filter('minStr12', value => {
  if (!value || value === '' || value.length <= 12) return value
  if (value.length > 10) return value.substr(0, 10) + '...'
})

// 千位符格式化
Vue.filter('toThousands', (value) => {
  return toThousands(value)
})

// 放款时间的拼接
Vue.filter('lendTimeJoin', (value) => {
  if (!value) {
    return '00:00:00'
  }
  value = parseInt(value) < 10 ? '0' + value : value
  return value + ':' + '00' + ':' + '00'
})

Vue.filter('name', (value) => {
  if (value) return value
  return null
})

//  123456789  => 12***6789
Vue.filter('fliterNum', (value) => {
  if (!value) return
  let newValue = value.toString()
  value = newValue.replace(value.slice(2, value.length - 4), '***')
  return value
})
