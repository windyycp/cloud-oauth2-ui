<template>
  <div class="layout-navbars-breadcrumb-user pr15" :style="{ flex: layoutUserFlexNum }">
    <!-- <el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="onComponentSizeChange">
      <div class="layout-navbars-breadcrumb-user-icon">
        <i class="iconfont icon-ziti" title="组件大小"></i>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="large" :disabled="state.disabledSize === 'large'">大型</el-dropdown-item>
          <el-dropdown-item command="default" :disabled="state.disabledSize === 'default'">默认</el-dropdown-item>
          <el-dropdown-item command="small" :disabled="state.disabledSize === 'small'">小型</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
      <el-icon title="菜单搜索">
        <ele-Search />
      </el-icon>
    </div> -->
    <!-- AI助手-->
<!--    <div class="layout-navbars-breadcrumb-user-icon" @click="onAIChatClick">-->
<!--      <img :src="AIIcon"  class="mr5"/>-->
<!--    </div>-->
    <div v-if="userInfos.userName=='admin'" class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSetingClick">
      <i class="icon-skin iconfont" title="布局配置"></i>
    </div>
    <!-- <div class="layout-navbars-breadcrumb-user-icon" ref="userNewsBadgeRef" v-click-outside="onUserNewsClick">
      <el-badge :is-dot="true">
        <el-icon title="消息">
          <ele-Bell />
        </el-icon>
      </el-badge>
    </div>
    <el-popover
      ref="userNewsRef"
      :virtual-ref="userNewsBadgeRef"
      placement="bottom"
      trigger="click"
      transition="el-zoom-in-top"
      virtual-triggering
      :width="300"
      :persistent="false"
    >
      <UserNews />
    </el-popover>
    <div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
      <i
        class="iconfont"
        :title="state.isScreenfull ? '关全屏' : '开全屏'"
        :class="!state.isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
      ></i>
    </div> -->
    <!--国际化设置-->
    <el-dropdown  :show-timeout="70" :hide-timeout="50" trigger="click" @command="onLanguageChange">
      <div class="layout-navbars-breadcrumb-user-icon">
        <i
            class="iconfont"
            :class="state.disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'"
            :title="$t('message.user.title1')"
        ></i>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh-cn" :disabled="state.disabledI18n === 'zh-cn'">简体中文</el-dropdown-item>
          <el-dropdown-item command="en" :disabled="state.disabledI18n === 'en'">English</el-dropdown-item>
<!--          <el-dropdown-item command="zh-tw" :disabled="state.disabledI18n === 'zh-tw'">繁體中文</el-dropdown-item>-->
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
<!--				<img :src="userInfos.photo" class="layout-navbars-breadcrumb-user-link-photo mr5" />-->
        <img :src="userAvatar" class="layout-navbars-breadcrumb-user-link-photo mr5"/>
				{{ userInfos.nickName || userInfos.userName }}
				<el-icon class="el-icon--right">
					<ele-ArrowDown/>
				</el-icon>
			</span>
      <template #dropdown>
        <el-dropdown-menu
        >
          <el-dropdown-item :command="'/system/user/info/'+userInfos.id"><span style="color: var(--el-color-primary)" class="strong">{{$t('message.menu.userCenter')}}</span></el-dropdown-item>
          <!-- <el-dropdown-item command="/kortrong"><span style="color: var(--el-color-primary)" class="strong">{{$t('message.menu.helperDoc')}}</span></el-dropdown-item> -->

<!--      <el-dropdown-item command="/kortrong"><span style="color: var(&#45;&#45;el-color-primary)" class="strong">{{$t('message.menu.webSite')}}</span></el-dropdown-item>-->
          <!-- <el-dropdown-item command="/home">首页</el-dropdown-item>
          <el-dropdown-item command="wareHouse">代码仓库</el-dropdown-item>
          <el-dropdown-item command="/404">404</el-dropdown-item>
          <el-dropdown-item command="/401">401</el-dropdown-item> -->
          <el-dropdown-item divided command="logOut" ><span style="color: #c45656" class="strong">{{$t('message.menu.logout')}}</span></el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <Search ref="searchRef"/>

  </div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUser">
import {defineAsyncComponent, ref, unref, computed, reactive, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {ElMessageBox, ElMessage, ClickOutside as vClickOutside} from 'element-plus';
import screenfull from 'screenfull';
import {storeToRefs} from 'pinia';
import {useUserInfo} from '/@/stores/userInfo';
import {useThemeConfig} from '/@/stores/themeConfig';
import mittBus from '/@/utils/mitt';
import {Session, Local} from '/@/utils/storage';
import { useI18n } from 'vue-i18n';
import {useLoginApi} from '/@/api/login/index';

import userAvatar from '/@/assets/user_avatar.png';
const AIchatDialogRef = ref()


// 引入组件
const UserNews = defineAsyncComponent(() => import('/@/layout/navBars/topBar/userNews.vue'));
const Search = defineAsyncComponent(() => import('/@/layout/navBars/topBar/search.vue'));

// 定义变量内容
const userNewsRef = ref();
const userNewsBadgeRef = ref();
const { locale, t } = useI18n();
const router = useRouter();
const stores = useUserInfo();
const storesThemeConfig = useThemeConfig();
const {userInfos} = storeToRefs(stores);
const {themeConfig} = storeToRefs(storesThemeConfig);
const searchRef = ref();
const loginApi = useLoginApi();
const state = reactive({
  isScreenfull: false,
  disabledSize: 'large',
  disabledI18n: 'zh-cn',

});

// 设置分割样式
const layoutUserFlexNum = computed(() => {
  let num: string | number = '';
  const {layout, isClassicSplitMenu} = themeConfig.value;
  const layoutArr: string[] = ['defaults', 'columns'];
  if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
  else num = '';
  return num;
});
// 全屏点击时
const onScreenfullClick = () => {
  if (!screenfull.isEnabled) {
    ElMessage.warning('暂不不支持全屏');
    return false;
  }
  screenfull.toggle();
  screenfull.on('change', () => {
    if (screenfull.isFullscreen) state.isScreenfull = true;
    else state.isScreenfull = false;
  });
};
// 消息通知点击时
const onUserNewsClick = () => {
  unref(userNewsRef).popperRef?.delayHide?.();
};

// 显示AI助手弹窗
const onAIChatClick =()=>{
  AIchatDialogRef.value.handleShow();

}

// 布局配置 icon 点击时
const onLayoutSetingClick = () => {
  mittBus.emit('openSetingsDrawer');
};
// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
  if (path === 'logOut') {
    ElMessageBox({
      closeOnClickModal: false,
      closeOnPressEscape: false,
      title: t('message.user.logOutTitle'),
      message: t('message.user.logOutMessage'),
      showCancelButton: true,
      confirmButtonText: t('message.user.logOutConfirm'),
      cancelButtonText: t('message.user.logOutCancel'),
      buttonSize: 'default',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText =  t('message.user.logOutExit');
          setTimeout(() => {
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 300);
          }, 700);
        } else {
          done();
        }
      },
    })
        .then(async () => {
          loginApi.signOutAuth({account: userInfos.value.userName}).then((res: any) => {
            // 判断res.data是否为null
            if (res?.code == '0000'){
              // 清除缓存/token等
              Session.clear();
              // 使用 reload 时，不需要调用 resetRoute() 重置路由
              window.location.href = res?.data  || '/';
            }
          }).catch(() => {
            ElMessage.error('退出登录失败');
          });

          // // 清除缓存/token等
          // Session.clear();
          // // 使用 reload 时，不需要调用 resetRoute() 重置路由
          // window.location.href = '/login';
        })
        .catch((e) => {
          console.log("logout:",e)
        });
  } else if (path === 'wareHouse') {
    window.open('https://gitee.com/lyt-top/vue-next-admin');
  } else if(path === '/kortrong'){
    window.open('https://www.kortrong.com');
  } else {
    router.push(path);
  }
};
// 菜单搜索点击
const onSearchClick = () => {
  searchRef.value.openSearch();
};
// 组件大小改变
const onComponentSizeChange = (size: string) => {
  Local.remove('themeConfig');
  themeConfig.value.globalComponentSize = size;
  Local.set('themeConfig', themeConfig.value);
  initI18nOrSize('globalComponentSize', 'disabledSize');
  window.location.reload();
};
// 语言切换
const onLanguageChange = (lang: string) => {
  Local.remove('themeConfig');
  themeConfig.value.globalI18n = lang;
  Local.set('themeConfig', themeConfig.value);
  locale.value = lang;
  initI18nOrSize('globalI18n', 'disabledI18n');

};
// 初始化组件大小/i18n
const initI18nOrSize = (value: string, attr: string) => {
  (<any>state)[attr] = Local.get('themeConfig')[value];
};
// 页面加载时
onMounted(() => {
  if (Local.get('themeConfig')) {
    initI18nOrSize('globalComponentSize', 'disabledSize');
    initI18nOrSize('globalI18n', 'disabledI18n');
  }
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &-link {
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;

    &-photo {
      width: 24px;
      height: 24px;
    }
  }

  &-icon {
    padding: 0 10px;
    cursor: pointer;
    color: var(--next-bg-topBarColor);
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;

    &:hover {
      background: var(--next-color-user-hover);

      i {
        display: inline-block;
        animation: logoAnimation 0.3s ease-in-out;
      }
    }
  }

  :deep(.el-dropdown) {
    color: var(--next-bg-topBarColor);
  }

  :deep(.el-badge) {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }

  :deep(.el-badge__content.is-fixed) {
    top: 12px;
  }
}
</style>
