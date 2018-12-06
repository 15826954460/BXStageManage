// 进行时间格式，共后台搜索查询
const filterTime = function (value, type) {
  if (!value) return null
  let date = new Date(value)
  let [Y, M, D, H, Ms, S] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
  let returnVal = ''
  M = parseInt(M) < 10 ? ('0' + M) : M
  D = parseInt(D) < 10 ? ('0' + D) : D
  H = parseInt(H) < 10 ? ('0' + H) : H
  Ms = parseInt(Ms) < 10 ? ('0' + Ms) : Ms
  S = parseInt(S) < 10 ? ('0' + S) : S
  if (!type) {
    returnVal = Y + '-' + M + '-' + D
    return returnVal
  } else {
    switch (type) {
      case 'year':
        returnVal = Y
        break
      case 'time':
        returnVal = H + ':' + Ms + ':' + S
        break
      case 'dateTime':
        returnVal = Y + '-' + M + '-' + D + ' ' + H + ':' + Ms + ':' + S
    }
    return returnVal
  }
}
// 验证手机号
const validateMobilePhone = function (value) {
  return /^1[34578][0-9]{9}$/.test(value)
}
// 验证金额的格式
const validateAccount = function (value) {
  return /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/.test(value)
}
// 验证天数
const validateDay = function (valone, valtwo) {
  if (valone && valtwo) {
    if (/(^[0-9])/.test(valone) && /(^[0-9])/.test(valtwo) &&
      (Number.parseInt(valtwo) >= Number.parseInt(valone))) {
      return true
    } else {
      return false
    }
  } else {
    if (/(^[0-9])/.test(valone)) {
      return true
    } else {
      return false
    }
  }
}
// 判断权限的方法
const judgeLimit = function (arr, val) {
  if (arr && arr.length > 0) {
    return arr.some((item) => {
      return item.menuId === val
    })
  } else {
    return false
  }
}
// 根据用户选择的搜索条件进行清空数据
const clearHistorySearch = function (searchConditions, param, type) {
  switch (searchConditions) {
    case 1:
      param.mobile = null
      if (type === 'id') {
        param.id = null
      } else {
        param.userId = null
      }
      break
    case 2:
      param.realName = null
      if (type === 'id') {
        param.id = null
      } else {
        param.userId = null
      }
      break
    case 3:
      param.realName = null
      param.mobile = null
      break
  }
}
// 根据用户搜索框的输入像后台传值
const setSearchValue = function (searchConditions, param, searchConditionsContent, type) {
  switch (searchConditions) {
    case 1:
      param.realName = searchConditionsContent
      break
    case 2:
      param.mobile = searchConditionsContent
      break
    case 3:
      if (type === 'id') {
        param.id = searchConditionsContent
      } else {
        param.userId = searchConditionsContent
      }
      break
  }
}
// 数组类型的检测
const isArray = function (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}
// 获取图片的真是大小
const getImageSize = function (url) {
  let img = new Image()
  img.src = url
  img.onload = () => {
    return {
      width: img.width,
      height: img.height
    }
  }
}
// 定义模块的对外接口
export {
  getImageSize,
  isArray,
  setSearchValue,
  clearHistorySearch,
  validateDay,
  filterTime,
  validateMobilePhone,
  validateAccount,
  judgeLimit
}
