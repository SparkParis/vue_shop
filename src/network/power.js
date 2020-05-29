import { request } from './request'

// 获取用户权限列表
export function getRightByList(type) {
  return request({
    method: 'get',
    url: `/rights/${type}`
  })
}

// 获取用户角色列表
export function getRule() {
  return request({
    method: 'get',
    url: '/roles'
  })
}

// 根据角色id获取列表
export function getRuleById(id) {
  return request({
    method: 'get',
    url: `roles/${id}`
  })
}

// 编辑提交角色
export function updateRule(id, editInfo) {
  return request({
    method: 'put',
    url: `/roles/${id}`,
    data: editInfo
  })
}

// 删除角色
export function deleteRule(id) {
  return request({
    method: 'delete',
    url: `roles/${id}`
  })
}

// 删除角色的权限
export function deleteRight(ruleId, rightId) {
  return request({
    method: 'delete',
    url: `roles/${ruleId}/rights/${rightId}`
  })
}

// 获取所有权限列表
export function getRightByTree(type) {
  return request({
    method: 'get',
    url: `rights/${type}`
  })
}

// 给用户授权 
export function setRuleRight(ruleId, rids) {
  return request({
    method: 'post',
    url: `roles/${ruleId}/rights`,
    data: {
      rids,
    }
  })
}

// 添加角色
export function addRule(rule) {
  return request({
    method: "post",
    url: '/roles',
    data: rule
  })
}