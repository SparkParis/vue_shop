import { request } from './request'

//获取商品分类列表
export function getGoodsCate(queryInfo) {
  return request({
    url: '/categories',
    params: queryInfo
  })
}

// 添加分类
export function addCate(addFormInfo) {
  return request({
    method: 'post',
    url: 'categories',
    data: addFormInfo
  })
}

// 编辑分类
export function updateCate(id, cate) {
  return request({
    method: 'put',
    url: `categories/${id}`,
    data: cate
  })
}

// 删除分类
export function deleteCate(id) {
  return request({
    method: 'delete',
    url: `categories/${id}`
  })
}