import request from '/@/utils/request';

export function useUserApi() {
	return {
		getUsers: (params ?: object) => {
			return request({
				// url: '/gitee/lyt-top/vue-next-admin-images/raw/master/menu/adminMenu.json',
				url: '/system/user/page',
				method: 'get',
				params,
			});
		},
		deleteUser: (params ?: object) => {
			return request({
				url: '/system/user/' + params,
				method: 'delete',
			});
		},
		addUser: (data ?: object) => {
			return request({
				url: '/system/user',
				method: 'post',
				data: data
			});
		},
		getUserById: (id ?: object) => {
			return request({
				url: '/system/user/' + id,
				method: 'get',
			});
		},
		getUserInfo: (id ?: object) => {
			return request({
				url: '/system/user/user_info',
				method: 'get',
			});
		},
		editUser: (data ?: object) => {
			return request({
				url: '/system/user',
				method: 'put',
				data: data
			});
		},
	};
}

// 查询分页
export function list(query) {
    return request({
        url: '/system/user/list',
        method: 'get',
        params: query
    })
}