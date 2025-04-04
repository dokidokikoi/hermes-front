import axios from 'axios'
import { getItem } from './localStorage'
import { ElMessage } from 'element-plus'
import router from "@/router/"

var request;

if (process.env.NODE_ENV !== "development") {
  request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
  })
} else {
  request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
    // 统一设置用户身份 token
    // const token = getItem("token")
    // const user = store.state.user
    // if (config && config.headers) {
    //     if (user && user.token) {
    //         config.headers.Authorization = user.token
    //     }
    // }
    // config.headers.Authorization = token
    return config
    }, function (error) {
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  console.log(response)
    // 统一处理接口响应数据，比如 token 过期无效、服务端异常等
    if (response.data.code === 10201 || response.data.code === 10202 || response.data.code === 10203 || response.data.code === 10001) {
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.value.fullPath
        }
      })
      ElMessage.error("请登录")
      return Promise.reject(response)
    }
    // 请求正常，返回数据
    const status = response.data.code
    if (status === 0) {
      return response
    }
  
    // 其它错误情况
    ElMessage.error(response.data.message || '请求失败，请稍后重试')
    // 手动返回一个 Promise 异常
    return Promise.reject(response.data)
  }, function (error) {
    const response = error.response
    if (response.status !== 200) {
      if (response.data) {
        ElMessage.error(response.data.message)
      } else {
        ElMessage.error(response)
      }
      
      return Promise.reject(response)
    }
    if (response.data.code === 10201 || response.data.code === 10202 || response.data.code === 10203 || response.data.code === 10001) {
      router.push({
        name: 'login',
        query: {
          redirect: router.currentRoute.value.fullPath
        }
      })
      ElMessage.error("请登录")
    }
    return Promise.reject(error)
  })

export default (config) => {
    return request(config).then(res => {
        return res.data
    })
}