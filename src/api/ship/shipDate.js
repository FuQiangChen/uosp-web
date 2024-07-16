import request from '@/utils/request'

// 查询船期管理列表
export function listShipDate(query) {
  return request({
    url: '/ship/shipDate/list',
    method: 'get',
    params: query
  })
}

// 查询船期管理详细
export function getShipDate(operatingId) {
  return request({
    url: '/ship/shipDate/' + operatingId,
    method: 'get'
  })
}

// 新增船期管理
export function addShipDate(data) {
  return request({
    url: '/ship/shipDate',
    method: 'post',
    data: data
  })
}

// 修改船期管理
export function updateShipDate(data) {
  return request({
    url: '/ship/shipDate',
    method: 'put',
    data: data
  })
}

// 删除船期管理
export function delShipDate(operatingId) {
  return request({
    url: '/ship/shipDate/' + operatingId,
    method: 'delete'
  })
}
