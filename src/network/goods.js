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

// 获取商品参数(通过分类id和tab标签名称)
export function getCateParams(id, sel) {
  return request({
    method: 'get',
    url: `categories/${id}/attributes`,
    params: {
      sel,
    }
  })
}

// 添加商品属性的参数名称和属性名称
export function addGoodsParamAttr(cateId, attr_name, attr_sel, attr_vals) {
  return request({
    method: 'post',
    url: `categories/${cateId}/attributes`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

// 编辑商品参数/属性
export function updateParams(id, attrId, attr_name, attr_sel, attr_vals) {
  return request({
    method: 'put',
    url: `categories/${id}/attributes/${attrId}`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

// 删除商品参数/属性
export function deleteParams(cateId, attrid) {
  return request({
    method: 'delete',
    url: `/categories/${cateId}/attributes/${attrid}`
  })
}

// 

