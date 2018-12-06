import axios from 'axios'
import qs from 'qs' // 序列化插件
import router from '../router/router'
import {Message} from 'element-ui' // 引用element-ui message 弹框插件
// 响应时间
axios.defaults.timeout = 10000
// 配置请求头 (全局配置)
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 配置接口地址 (全局配置)   https://cnodejs.org/api/v1/  bixiabackapi/
axios.defaults.baseURL = '/api/'

// 过滤请求参数
export function screeningParam(params) {
  let newParams = {}
  for (let key in params) {
    if (params[key] || params[key] === 0) {
      newParams[key] = params[key]
    }
  }
  return newParams
}

// post传参序列化  (添加请求拦截器)
axios.interceptors.request.use((config) => {
  // console.log(config)
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    if (config.data) {
      // 参数序列化
      config.data = qs.stringify(screeningParam(config.data))
    }
  }
  // 如果有权限鉴别，就加上请求头的taken字段
  if (localStorage.token) {
    config.headers.Authorization = localStorage.token
  }
  return config
}, (error) => {
  Message({
    //  饿了么的消息弹窗组件
    showClose: true, // 手动关闭
    message: error, // 提示信息
    type: 'error'
  })
  return Promise.reject(error)
})

// 返回状态判断  (添加响应拦截器)
axios.interceptors.response.use((res) => {
  // 对响应数据做些事
  if (res.status === 404) return
  if (res.status === 200 || res.status === 304 || res.status === 400) {
    let data = res.data
    // session 超时冲定向 去login页面
    if (data.code && parseInt(data.code) === 510) {
      if (!window.localStorage.getItem('_b_u')) {
        window.localStorage.setItem('_b_u', window.location.hash.substr(1))
      }
      router.push('/')
    } else {
      return res
    }
  }
}, (error) => {
  return Promise.reject(error)
})

// 返回一个Promise(发送get请求)
export function getFetch(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      params: params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(response => {
      return resolve(response.data)
    })
      .catch((error) => {
        reject(error)
      })
  })
}

// 返回一个Promise(发送post请求)
export function postFetch(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: params,
      traditional: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(response => {
      if (response.data.code === 200) {
        return resolve(response.data.body)
      } else {
        Message({
          //  饿了么的消息弹窗组件
          showClose: true, // 手动关闭
          message: response.data.message, // 提示信息
          type: 'error'
        })
      }
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  get(url, params) {
    return getFetch(url, params)
  },
  post(url, params) {
    return postFetch(url, params)
  }
}
