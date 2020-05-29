import { request } from './request';

// 获取menu的数据,左侧菜单权限
export function getMenu() {
  return request({
    method: 'get',
    url: '/menus'
  })
}
