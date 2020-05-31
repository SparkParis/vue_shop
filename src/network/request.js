// 封装axios的request请求
import axios from 'axios';
//get参数序列化
function serialize(obj) {
  let ary = []
  for (var p in obj)
    if (obj.hasOwnProperty(p) && obj[p]) {
      ary.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return '?' + ary.join('&')
}

export function request(config) {
  // 1.创建axois实例对象
  const instance = axios.create({
    baseURL: "http://182.92.102.182:88/api/private/v1",
    // baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',

    timeout: 5000
  })
  // 2.请求拦截
  instance.interceptors.request.use(res => {
    //每次拦截只有都需要return,才能执行后续操作
    // 授权api需要在axios的请求拦截器中拦截请求, 在请求头中添加Authorization属性为token值

    res.headers.Authorization = window.sessionStorage.getItem('token')

    // get请求参数的处理,todo
    // res.headers.url = res.headers.method == 'get' ? res.headers.url + serialize(res.headers.url) : formatUrl(res.headers.url, 1)
    // https://blog.csdn.net/weixin_44827421/article/details/100060163

    return res
  })
  // 3.响应拦截
  instance.interceptors.response.use(res => {
    return res
  })
  // 4发送请求,axios中返回的本来就是promise对象

  return instance(config)

}