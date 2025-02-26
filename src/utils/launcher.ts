import { Launcher } from '@~crazy/launcher';
import { ElMessage } from 'element-plus';

import { Session } from '/@/utils/storage';
import store from '/@/stores';
import router from '/@/router';

export const launcher = new Launcher({
	baseUrl: import.meta.env.VITE_MCS_URL,
	timeoutAgain: false,
	timeout: 1000 * 10,
	requestOptions: {
		headers: {},
	},
	appendParams: () => {
		return {
			// lang: store.getters.language,
		};
	},
	beforeHandler: () => {
		launcher.setAuthorization(`Bearer ${Session.get('token')}`);
	},
	authHandler: (code) => {
		if (code == 401 || code === 4001) {
			ElMessage.error('非法请求，用户未授权');
			// store.dispatch('Logout');
			router.push('/login');
		} else if (code == 403) {
			ElMessage.error('禁止访问，用户令牌无效');
			// store.dispatch('Logout');
			router.push('/login');
		}
	},
	timeoutHandler: (options, again) => {
		let msg = `请求接口'${options.url}'超时`;
		if (again) {
			msg += ',正在重新发起请求';
		}
		ElMessage.error(msg);
		console.error(msg);
	},
});
