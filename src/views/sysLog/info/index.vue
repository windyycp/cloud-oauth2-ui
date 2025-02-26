<template>
  <div class="app-container w100 h100 p10">
    <el-card shadow="never">
      <div class="flex flex-between w100 ">
        <div class="mb20 MTitle strong">操作日志信息</div>
        <span>
          <Auth :value="'btn.syslog.edit'">
            <el-button type="primary" v-if="state.infoMode" :icon="Edit" link @click="handleEdit"> {{$t('message.formI18n.but_edit')}}</el-button>
            <el-button type="info" v-if="!state.infoMode" :icon="Edit" link @click="handleCancel">{{$t('message.formI18n.but_cancel')}}</el-button>
            <el-button type="success" v-if="!state.infoMode" :icon="Edit" link @click="submitForm(formRef)">{{$t('message.formI18n.but_save')}}</el-button>
          </Auth>
        </span>

      </div>
        <el-form ref="formRef" :model="state.form" size="default" :disabled="false">
          <div v-if="state.form.id != null" class="w100 flex flex-warp  ">
            <div class="flex w100 flex-warp ml10" v-for="(value, key) in formList" :key="key">
              <div v-show="Object.keys(formList).length > 1" class="w100 mb20 strong">{{ key }}</div>
              <el-form-item v-for="(item, index) in value"
                class="item_style"
                :style="item.style ? item.style : ''"
                :rules="item.formOption && item.formOption.rules ? item.formOption.rules : []"
                :key="index"
                :label="(item.propAlias?$t('message.dataModel.'+item.propAlias):$t('message.dataModel.'+item.prop))+'：'"
                :prop="item.prop"
                label-width="140px">
                  <FastFormItem :formItem="item" v-model="state.form[item.prop]"
                  :infoMode="state.infoMode"
                  :formValue="state.form[item.prop]">
                </FastFormItem>
              </el-form-item>
              <el-divider v-show="key !== '配置要求'"></el-divider>
            </div>
          </div>
       </el-form>
    </el-card>

    <!--
    <el-card shadow="never">
      <div class="flex flex-between w100 ">
        <div class="mb20 MTitle strong">test</div>
      </div>
      <div>test</div>
    </el-card>
    -->

  </div>
</template>

<script lang="ts" setup name="syslog-info">
import { reactive, onMounted, ref, defineAsyncComponent, computed } from 'vue';
import { get, update, } from "/@/api/syslog/index";
import { useRouter } from "vue-router";
import { Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getConfig } from "/@/views/sysLog/dataConfig";
import { dataModel } from "/@/views/sysLog/dataModel";
import Auth from "/@/components/auth/auth.vue";
import {fastFormDataConfig} from "/@/types/fastForm";

const formRef = ref()
const FastFormItem = defineAsyncComponent(() => import('/@/components/fastFormItem/index.vue'))

// 定义组件参数，可复写默认的dataModel
const props = defineProps(['dataModel', 'hideControl'])

// 定义变量
const state = reactive<any>({
  // 遮罩层
  loading: true,
  // 表单参数
  form: {},
  infoMode: true,
  id: null,
})

// 页面数据配置
const dataConfig = getConfig(props.dataModel ? props.dataModel : dataModel);

// 筛选出详情字段
var formList = computed(() => {
  // 筛选出详情还是编辑参数列表
  const filterDataConfig = state.infoMode
    ? dataConfig.filter(item => item.isDetailParam)
    : dataConfig.filter(item => item.isCreateParam)


  // 按tagLabel分组
  const groupedArray: { [key: string]: fastFormDataConfig[] } = filterDataConfig.reduce((acc, item) => {
    const tagLabel = item.formOption.tagLabel || '基本信息';
    if (!acc[tagLabel]) {
      acc[tagLabel] = []
    }
    acc[tagLabel].push(item)
    return acc;
  }, {})

  return groupedArray
})

// 加载完
onMounted(() => {
  // 获取路由参数
  const router = useRouter()
  const params = router.currentRoute.value.params
  state.id = params.id
  // 获取详情
  getInfo();
})

// 获取详情
const getInfo = () => {
  get(state.id).then(res => {
    state.form = res.data;
    state.infoMode = true;
  })
}

// 打开编辑
const handleEdit = () => {
  state.infoMode = false;
}

// 取消编辑
const handleCancel = () => {
  state.infoMode = true;
}

// 表单验证
const submitForm = (formEl: any | undefined) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      updateRequest(state.form);
    }
  })
}

// 执行更新
const updateRequest = (formData: any) => {
  update(formData).then(res => {
    state.infoMode = true;
    ElMessage.success("修改成功")
  });
}

</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}

.item_style {
  flex-basis: 30%;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .item_style {
    flex-basis: 45%;
  }
}

</style>
