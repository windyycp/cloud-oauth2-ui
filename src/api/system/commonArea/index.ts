import request from '/@/utils/request';

export function useCommonAreaApi() {
	return {
		getAllRoom: (params ?: object) => {
			return request({
				url: '/system/commonArea/getAllRoom',
				method: 'get',
				params,
			});
		},

	};
}