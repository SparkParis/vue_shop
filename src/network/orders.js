import { request } from 'network/request'

export function getOrders(queryInfo) {
  return request({
    method: 'get',
    url: '/orders',
    params: queryInfo
  })
}

// 查看物流信息
export function getAddressInfo() {
  return request({
    method: 'get',
    url: `/kuaidi/1106975712662`
  })
}