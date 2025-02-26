import request from '/@/utils/request'

const base = '/system/dept'

// 查询分页
export function page(query) {
    return request({
        url: base + '/page',
        method: 'get',
        params: query
    })
}

// 列表查询
export function list(query) {
    return request({
        url: base + '/list',
        method: 'get',
        params: query
    })
}

// 查询详情
export function get(id) {
    return request({
        url: base + '/' + id,
        method: 'get'
    })
}

// 新增
export function add(data) {
    return request({
        url: base,
        method: 'post',
        data: data
    })
}

// 修改
export function update(data) {
    return request({
        url: base,
        method: 'put',
        data: data
    })
}

// 删除
export function del(ids) {
    return request({
        url: base + '/' +ids,
        method: 'delete',
    })
}

export function getByPid(query) {
    return request({
        url: base + '/getByPid',
        method: 'get',
        params: query
    })
}