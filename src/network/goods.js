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

// 商品列表展示功能实现
// 获取商品列表,
// 这里通过嵌套获取的方式会出现参数params并没有传入到url中,原因是没有return
export function getGoods(queryInfo) {
  return request({
    method: "get",
    // url: `/goods?query=${queryInfo.query}&pagenum=${queryInfo.pagenum}&pagesize=${queryInfo.pagesize}`,
    url: `/goods`,
    params: queryInfo,

  })
}

// 删除商品
export function deleteGoods(goodsId) {
  return request({
    method: 'delete',
    url: `/goods/${goodsId}`
  })
}

//编辑提交商品
export function updateGoods(id) {
  return request({
    method: 'put',
    url: `goods/${id}`,
    data: {
      goods_name,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs
    }
  })
}

// 添加商品
export function addGoods(goods) {
  return request({
    method: 'post',
    url: '/goods',
    data: goods
  })
}