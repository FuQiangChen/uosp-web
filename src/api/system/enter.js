import request from '@/utils/request'

// 查询企业信息列表
export function listEnter(query) {
  return request({
    url: '/system/enter/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getEnter(id) {
  return request({
    url: '/system/enter/' + id,
    method: 'get'
  })
}

// 新增企业信息
export function addEnter(data) {
  return request({
    url: '/system/enter',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateEnter(data) {
  return request({
    url: '/system/enter',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delEnter(id) {
  return request({
    url: '/system/enter/' + id,
    method: 'delete'
  })
}
