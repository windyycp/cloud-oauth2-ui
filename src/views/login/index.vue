<template>
  <div class="login-container flex" style="position:relative">
    <el-image class="w100 h100" fit="cover" :src="bgImg"></el-image>
    <div style="position: absolute">
      <el-image style="margin:40px" fit="none" :src="logo"></el-image>
    </div>
    <div style="position: absolute;" class="w100 h100 flex ">
      <el-row class="w100">
        <el-col :xs="20" :sm="16" :md="14" :lg="12" :xl="12">
          <div class="flex flex-h-center flex-v-center w100 h100">
            <div class="login-right-warp-mian">
              <div class="font20 color-white">{{ $t('message.welcome.text1') }}</div>
              <div class="font20 color-white">{{ $t('message.menu.globalTitle') }}</div>
              <div class="login-right-warp-main-form">
                <Account/>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="4" :sm="8" :md="10" :lg="12" :xl="12">
          <div/>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script setup lang="ts" name="loginIndex">
import {defineAsyncComponent, onMounted, reactive, computed, watch, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {NextLoading} from '/@/utils/loading';
import logoCN from '/@/assets/ketron_logo.png';
import logoEn from '/@/assets/logo-en.png';

const {locale, t} = useI18n();

import bgImg from '/@/assets/login_bg.png';
import {useI18n} from "vue-i18n";

// 引入组件
const Account = defineAsyncComponent(() => import('/@/views/login/component/account.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const {themeConfig} = storeToRefs(storesThemeConfig);
const state = reactive({
  tabsActiveName: 'account',
  isScan: false,
  globalI18n: 'zh-cn',
});


const logo = computed(() => {
  switch (locale.value) {
    case 'en':
      return logoEn
    case 'zh-cn':
      return logoCN
  }
})



// 页面加载时
onMounted(() => {
  NextLoading.done();
});
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  background: var(--el-color-white);

}


</style>
