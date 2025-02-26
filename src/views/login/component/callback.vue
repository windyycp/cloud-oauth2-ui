<template>
  <div>
    <!-- <div><span>Message: {{ msg }}</span></div> -->
  </div>
  <!--App -->
</template>

<script setup>


import Axios from 'axios'
import {onMounted} from 'vue'
import {useRouter} from 'vue-router';

import Cookies from 'js-cookie';
import {Session} from '/@/utils/storage';
import {NextLoading} from '/@/utils/loading';
import {useUserApi} from '/@/api/user/index';
import cryptoJS from "crypto-js";

// 引入 api 请求接口
const userApi = useUserApi();
const $router = useRouter();

// 从授权中心回调到此页面，保存token
onMounted(() => {

  // 校验 oauth state, 防止csrf攻击
	var queryState = $router.currentRoute.value.query.state;
	const sessionState = Session.get("state");
	if(!sessionState || !queryState || queryState.toString() !== sessionState.toString()) {
		Session.clear();
		window.location.href = '/';
		return
	}
  
	// 清除 oauth state
	Session.remove("state");

  var token = $router.currentRoute.value.query.token;
  var jkToken = $router.currentRoute.value.query.jktoken;

  if(jkToken){
    Session.set('jktoken', jkToken);
  }
  if (token) {
    Session.set('token', token);
    // 获取用户在权限中心的账号信息
    getUserInfo($router.currentRoute.value.query.token);
  }
})


const getUserInfo = (token) => {
  var authHost = import.meta.env.VITE_AUTH_URL;
  const authUrl = authHost + '/oauth/user_info';
  NextLoading.start();

  Axios({
    method: "get",
    url: authUrl,
    params: {
      token: token,
    },
  }).then(response => {

    if (response.data.code === '0000') {
      const authUser = response.data.data;
      // 设置token
      Session.set('token', token);

      // 获取当前系统用户信息
      userApi.getUserInfo().then(res => {
        const user = res.data;
        const userName = user.userName;
        // 用户账号加密
        user.userNameEncrypt = cryptoJS.AES.encrypt(userName, "kortrong123A").toString();
        NextLoading.done();
        // 设置用户名
        Cookies.set('userName', userName);
        // 存入用户信息到session
        Session.set('userInfo', user);
        if (userName !== 'admin' && (!user.roles || user.roles.length === 0)) {
          $router.push("/401")
          return
        }
        $router.push("/home")
      });

    }
  }).catch(err => {
    console.log(err)
    NextLoading.done();
  })
}

</script>
