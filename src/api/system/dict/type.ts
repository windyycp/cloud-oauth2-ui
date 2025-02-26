import request from '/@/utils/request';
import { i18n } from "/@/i18n/index";

export function getTypeList(query:Object) {
    return request({
        url: '/system/dict/type/list',
        method: 'get',
        params:query
    })
}

export function getType(id:number) {
    return request({
        url: '/system/dict/type/'+id,
        method: 'get',
    })
}

export function addType(data:any) {
    return request({
        url: '/system/dict/type',
        method: 'post',
        data:data
    })
}

export function editType(data:any) {
    return request({
        url: '/system/dict/type',
        method: 'put',
        data:data
    })
}


export function deleteType(dictIds:number[]) {
    return request({
        url: '/system/dict/type/delete',
        method: 'delete',
        data:{dictIds}
    })
}


// 获取字典选择框列表
export function optionselect() {
    return request({
        url: '/system/dict/type/optionSelect',
        method: 'get'
    })
}

// 获取字典选择框列表
export function getDictCacheByType(dictType:string) {
    return new Promise(resolve => {
        request({
            url: '/system/dict/type/getCache/'+dictType,
            method: 'get'
        }).then(res => {
            // TODO: 国际化
            // console.log('i18n：',i18n.global.t("message.router.home"));
            resolve(res)
        })
    })
}

