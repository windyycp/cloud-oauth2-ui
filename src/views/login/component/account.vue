<template>
  <el-form size="large" class="login-content-form">
    <el-form-item class="login-animation1">
      <el-input text :placeholder="$t('message.account.accountPlaceholder1')" v-model="state.ruleForm.userName"
                clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2">
      <el-input
          :type="state.isShowPassword ? 'text' : 'password'"
          :placeholder="$t('message.account.accountPlaceholder2')"
          v-model="state.ruleForm.userPassword"
          autocomplete="off"
          @keyup.enter.native="onSignIn"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock/>
          </el-icon>
        </template>
        <template #suffix>
          <i
              class="iconfont el-input__icon login-content-password"
              :class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
              @click="state.isShowPassword = !state.isShowPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <!-- <el-form-item class="login-animation3">
      <el-col :span="15">
        <el-input
          text
          maxlength="4"
          :placeholder="$t('message.account.accountPlaceholder3')"
          v-model="state.ruleForm.code"
          clearable
          autocomplete="off"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><ele-Position /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <el-button class="login-content-code" v-waves>1234</el-button>
      </el-col>
    </el-form-item> -->
    <el-form-item class="color-white;" style="">
      <el-radio-group v-model="state.globalI18n" @change="onLanguageChange">
        <el-radio label="zh-cn" size="small">中文</el-radio>
        <el-radio label="en" size="small">English</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button plain class="login-content-submit" v-waves @click="onSignIn" :loading="state.loading.signIn">
        <span>{{ $t('message.account.accountBtnText') }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="loginAccount">
import {reactive, computed, nextTick, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {useI18n} from 'vue-i18n';
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {initFrontEndControlRoutes} from '/@/router/frontEnd';
import {Local, Session} from '/@/utils/storage';
import {formatAxis} from '/@/utils/formatTime';
import {NextLoading} from '/@/utils/loading';
import pinia from '/@/stores';
import {useLoginApi} from '/@/api/login/index';

// 定义变量内容
const {locale,t} = useI18n();
const storesThemeConfig = useThemeConfig(pinia);
const {themeConfig} = storeToRefs(storesThemeConfig);
const {isRequestRoutes} = themeConfig.value;
const radio1 = ref(1)


// 引入 api 请求接口
const loginApi = useLoginApi();
const route = useRoute();
const router = useRouter();
const state = reactive({
  isShowPassword: false,
  ruleForm: {
    userName: '',
    password: '',
    userPassword: '',
    code: '',
    clientId: '',
    clientCallbackUrl: 'http://localhost:8888/callback'
  },
  loading: {
    signIn: false,
  },
  globalI18n: 'zh-cn',
});

onMounted(() => {
  var publicPath = import.meta.env.VITE_PUBLIC_PATH;
  var clientId = import.meta.env.VITE_AUTH_CLIENT;
  var host = window.location.host;
  var clientCallbackUrl = window.location.protocol + "//" + host + (publicPath === '/' ? '' : publicPath) + "/callback"
  state.ruleForm.clientCallbackUrl = clientCallbackUrl;
  state.ruleForm.clientId = clientId;
  state.ruleForm.state = new Date().getTime();

  // 获取国际化配置
  if (Local.get('themeConfig')) {
    state.globalI18n =  Local.get('themeConfig').globalI18n;
  }


})

// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});

// 登录
const onSignIn = async () => {
  state.loading.signIn = true;
  // 存储 token 到浏览器缓存
  // Session.set('token', Math.random().toString(36).substr(0));
  // 模拟数据，对接接口时，记得删除多余代码及对应依赖的引入。用于 `/src/stores/userInfo.ts` 中不同用户登录判断（模拟数据）
  // Cookies.set('userName', state.ruleForm.userName)1;
  // if (!themeConfig.value.isRequestRoutes) {
  if (!isRequestRoutes) {
    // 前端控制路由
    // 2、请注意执行顺序
    const isNoPower = await initFrontEndControlRoutes();
    signInSuccess(isNoPower);
  } else {
    // var clientId = state.ruleForm.clientId;
    // var userName = state.ruleForm.userName;
    // var userPassword = state.ruleForm.userPassword;
    // var callbackUrl = encodeURIComponent(state.ruleForm.clientCallbackUrl);
    // var authHost =  import.meta.env.VITE_AUTH_URL;
    // window.location.href = authHost + '/oauth/login?clientId=' + clientId + "&clientCallbackUrl=" + callbackUrl + "&userName=" + userName + "&userPassword=" + userPassword;

    //后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
    //进行用户的后端校验
    const res = await loginUser(state?.ruleForm);
    if (res) {
      // 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
      // const isNoPower = await initBackEndControlRoutes();
      // 执行完 initBackEndControlRoutes，再执行 signInSuccess
      // signInSuccess(isNoPower);
      if (res.serverCallbackUrl) {
        window.location.href = res.serverCallbackUrl;
      } else {
        ElMessage.error('无授权回调地址！');
      }

    } else {
      NextLoading.done();
      state.loading.signIn = false;
      ElMessage.error('用户名或密码错误！');
    }

  }
};

// 用户登录
const loginUser = (ruleForm: any | undefined) => {
  // 发起后端请求
  return new Promise((resolve) => {
    loginApi.signInAuth(ruleForm).then((res: any) => {
      // 判断res.data是否为null
      if (res?.code == '0000' && res?.data != null) {
        // const user=res?.data;
        // // 设置token
        // Session.set('token', user.token);
        // // 设置用户名
        // Cookies.set('userName', user.userName);
        // // 存入用户信息到session
        // Session.set('userInfo', user);
        
        // 防止csrf
        Session.set('state', ruleForm.state);
        state.loading.signIn = false;
        resolve(res);
      } else {
        state.loading.signIn = false;
        NextLoading.done();
        resolve(null);
      }
    }).catch(() => {
      state.loading.signIn = false
    });
  });

};


// 登录成功后的跳转
const signInSuccess = (isNoPower: boolean | undefined) => {
  if (isNoPower) {
    ElMessage.warning('抱歉，您没有登录权限');
    Session.clear();
  } else {
    // 初始化登录成功时间问候语
    let currentTimeInfo = currentTime.value;
    // 登录成功，跳到转首页
    // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
    if (route.query?.redirect) {
      router.push({
        path: <string>route.query?.redirect,
        query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
      });
    } else {
      router.push('/');
    }
    // 登录成功提示
    const signInText = t('message.signInText');
    ElMessage.success(`${currentTimeInfo}，${signInText}`);
    // 添加 loading，防止第一次进入界面时出现短暂空白
    NextLoading.start();
  }
  state.loading.signIn = false;
};

const onLanguageChange = (lang: string) => {
  console.log(lang)
  Local.remove('themeConfig');
  themeConfig.value.globalI18n = lang;
  Local.set('themeConfig', themeConfig.value);
  locale.value = lang;

};

</script>

<style scoped lang="scss">
:deep(.el-input__wrapper) {
  background-color: rgba(20, 57, 70, 0.78);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0);
}

:deep(input:-webkit-autofill) {
  -webkit-text-fill-color: white;
  transition: background-color 50000s ease-in-out 5000s;
}

:deep(input::-webkit-input-placeholder) {
  color: white;
}

:deep(.el-input__inner) {
  color: white;
}

:deep(.el-input__inner:focus) {
  border-color: white;
}

:deep(.el-input__inner:hover) {
  border-color: white;
}

// 单选
:deep(.el-radio) {
  // 默认文本样式
  .el-radio__label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
  }
  // icon 默认样式
  .el-radio__inner {
    background: #133145;
    border: 1px solid #f3fbfe;
  }
  // 选中文本样式
  .el-radio__input.is-checked + .el-radio__label {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #f3fbfe;
    font-weight: 500;
  }
  // 选中 icon 样式
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
    background-color: #f3fbfe;
  }
  // 覆盖默认 样式
  .el-radio__input.is-checked .el-radio__inner {
    border: 1px solid #f2fbfe;
    background-color: transparent;
  }
}



.login-content-form {
  margin-top: 20px;
  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}


</style>
