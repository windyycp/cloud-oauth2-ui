import { defineStore } from 'pinia';
import { Session } from '/@/utils/storage';
import cryptoJS from "crypto-js";

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
			nickName:''

		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				// 用户信息被清空时，返回login页
				// 清除缓存/token等
				Session.clear();
				window.location.href = '/#/login';
			}
		},
		isAdmin(): boolean {
			const userNameEncrypt = this.userInfos.userNameEncrypt;
			const userNameDecrypt = userNameEncrypt
				? cryptoJS.AES.decrypt(userNameEncrypt, 'kortrong123A').toString(
					cryptoJS.enc.Utf8
				)
				: null;
			if(userNameDecrypt &&('admin' == userNameDecrypt )){
				return true
			}else{
				return false
			}
		}
	},
});
