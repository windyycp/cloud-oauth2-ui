<template>
  <slot v-if="getUserAuthBtnList"/>
  <el-tooltip v-else-if="!props.hide"  :content="$t('message.tooltip.no_permission')" placement="top"  >
    <div>
      <div style="color: gray;  opacity: 0.2;pointerEvents: none " @click.stop="handleClickStop">
        <slot/>
      </div>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts" name="auth">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import cryptoJS from "crypto-js";

// 定义父组件传过来的值
const props = defineProps({
	value: {
		type: String,
		default: () => '',
	},
  hide: {
    type: Boolean,
    default: ()=> false,
  }
});

// 定义变量内容
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);

// 获取 pinia 中的用户权限
const getUserAuthBtnList = computed(() => {
	// const userNameEncrypt = userInfos.value.userNameEncrypt;
	// const userNameDecrypt = userNameEncrypt
	// 	? cryptoJS.AES.decrypt(userNameEncrypt, 'kortrong123A').toString(
	// 			cryptoJS.enc.Utf8
	// 	  )
	// 	: null;
	// // 如果是超级管理员，直接通过
	// if (
	// 	userNameDecrypt &&
	// 	('admin' == userNameDecrypt ||
	// 		userInfos.value.roles?.join(',').indexOf(userNameDecrypt) > -1)
	// ) {
	// 	return true;
	// }
	// return userInfos.value.authBtnList.some((v: string) => v === props.value);
  if (stores.isAdmin())
    return true
  return userInfos.value.authBtnList.some((v: string) => v === props.value);
});

// 操作拦截，防止前端样式被破解修改
const handleClickStop = (event)=>{
  if(!getUserAuthBtnList.value){
    event.event.preventDefault()
  }
}
</script>
