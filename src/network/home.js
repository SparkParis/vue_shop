import { request } from './request';

// 获取menu的数据,左侧菜单权限
export function getMenu() {
  return request({
    method: 'get',
    url: '/menus'
  })
}

// 获取用户数据
export function getUsers(queryInfo) {
  return request({
    method: 'get',
    url: '/users',
    params: queryInfo

  })
}

// 修改用户状态
export function updateState(url) {
  return request({
    method: 'put',
    url: url

  })
}

// 添加用户
export function addUser(postData) {
  return request({
    method: 'post',
    url: '/users',
    data: postData
  })
}

// 根据id查询用户
export function getUserById(id) {
  return request({
    method: 'get',
    url: `/users/${id}`
  })
}

// 修改用户信息
export function updateUser(id, editData) {
  return request({
    method: 'put',
    url: `/users/${id}`,
    data: editData
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    method: 'delete',
    url: `/users/${id}`
  })
}