import { request } from 'network/request'

// 获取数据报表的数据
export function getReportData() {
  return request({
    method: 'get',
    url: `reports/type/1`
  })
}