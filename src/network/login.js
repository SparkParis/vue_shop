
import { request } from './request'

// 封装login的请求
export function postLogin(data) {
  return request({
    method: 'post',
    url: '/login',
    // 注意data是post特有的属性,通过请求体的方式进行发送,这里直接将data中的数据传入即可
    data: data
  })
}
