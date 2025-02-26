import request from '/@/utils/request'

// 上传到公共文件库
export function uploadPublic(data : any) {
	return request({
		url: '/file/upload/public',
		method: 'post',
		data: data,
		headers: { 'Content-Type': 'multipart/form-data' },
	})
}
