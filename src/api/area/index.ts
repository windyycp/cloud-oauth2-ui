import request from '/@/utils/request'

const base = '/area'

// 查询分页
export function getByParentId(query) {
    return request({
        url: base + '/getByParentId',
        method: 'get',
        params: query
    })
}


export function getAreaInfo(id) {
    return request({
        url: base + '/' + id,
        method: 'get'
    })
}

