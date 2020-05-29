// 封装axios的request请求
import axios from 'axios';

export function request(config) {
  // 1.创建axois实例对象
  const instance = axios.create({
    baseURL: "http://182.92.102.182:88/api/private/v1",
    timeout: 5000
  })
  // 2.请求拦截
  instance.interceptors.request.use(res => {
    //每次拦截只有都需要return,才能执行后续操作
    // 授权api需要在axios的请求拦截器中拦截请求, 在请求头中添加Authorization属性为token值

    res.headers.Authorization = window.sessionStorage.getItem('token')
    return res
  })
  // 3.响应拦截
  instance.interceptors.response.use(res => {
    return res
  })
  // 4发送请求,axios中返回的本来就是promise对象

  return instance(config)

}