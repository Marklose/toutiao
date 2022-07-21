import axios from 'axios'
import store from '@/store/index'
import jsonBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://42.192.129.12:8000/',

  transformResponse: [
    function (data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data)
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data
        }
      }
    }
  ]
})

request.interceptors.request.use(
  (config) => {
    const token = store.state?.user?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
request.interceptors.request.use()
export default request
