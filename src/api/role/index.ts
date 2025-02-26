import request from '/@/utils/request';

export function useRoleApi() {
	return {
		getRoles: (params?: object) => {
			return request({
				url: '/system/role/page',
				method: 'get',
				params,
			});
		},
		list: (params?: object) => {
			return request({
				url: '/system/role/list',
				method: 'get',
				params,
			});
		},
		deleteRole: (params?: object) => {
			return request({
				url: '/system/role/'+params,
				method: 'delete',
			});
		},
		addRole: (data?: object) => {
			return request({
				url: '/system/role',
				method: 'post',
				data:data
			});
		},
		getRoleById: (id?: object) => {
			return request({
				url: '/system/role/'+id,
				method: 'get',
			});
		},
		editRole: (data?: object) => {
			return request({
				url: '/system/role',
				method: 'put',
				data:data
			});
		},
		
	};
}
