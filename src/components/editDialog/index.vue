<template>
  <div class="flex w100">
    <el-dialog v-model="state.open" :title="state.title" width="60%" draggable append-to-body @close="cancel">
      <el-form ref="formRef" :model="state.form" label-width="140px" size="default" :inline="true">
        <div v-if="state.form.id != null || mode==='add'" class="flex w100 flex-warp"
             v-for="(value,key,index) in formList" :key="key">
          <div v-show="Object.keys(formList).length>1" class="w100 strong mb20">{{ key }}</div>
          <el-form-item v-for="(item, index) in value"
                        :rules="item.formOption && item.formOption.rules ? item.formOption.rules : []" :key="index"
                        :label="(item.propAlias?$t('message.dataModel.'+item.propAlias):$t('message.dataModel.'+item.prop))+':'"
                        :prop="item.prop" :style="item.style?item.style:''"
                        class="flex-v-start form-item">
            <FastFormItem :formItem="item" v-model="state.form[item.prop]" :infoMode="mode=='info'"
                            :formValue="state.form[item.prop]" style="width: 100%"
                            @updateCityLabelArray="updateCityLabelArray" :prop="item.prop"
            ></FastFormItem>
          </el-form-item>
          <el-divider v-if="index!=Object.keys(formList).length-1"></el-divider>
        </div>
      </el-form>
      <template #footer>
        <div class="mt20 flex flex-h-end" v-show="mode==='edit' || mode==='add'">
          <el-button type="primary" @click="submitForm(formRef)">{{ $t('message.dialog.but_confirm') }}</el-button>
          <el-button @click="cancel">{{ $t('message.dialog.but_cancel') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="">
import {
  reactive,
  ref, defineAsyncComponent, inject, computed, onMounted
} from 'vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const FastFormItem = defineAsyncComponent(() => import('/@/components/fastFormItem/index.vue'))
const emit = defineEmits(['getList', 'update', 'add', 'getInfo'])

import {useFormStore} from "/@/stores/formStore";
import {fastFormDataConfig} from "/@/types/fastForm";

const formStore = useFormStore()

// 导入组件
const formRef = ref()
const mode = ref('add') // add | edit | info

const props = defineProps(['dataConfig'])

// 定义变量
const state = reactive<any>({
  open: false,
  // 表单参数
  form: {},
})

// 一个计算属性 ref
// const formList = computed(() => {
//   return mode.value == "info" ? props.dataConfig.filter(item => item.isDetailParam) : props.dataConfig.filter(item => item.isCreateParam)
// })
var formList = computed(() => {
  // 筛选出详情还是编辑参数列表
  const filterDataConfig = mode.value == "info" ? props.dataConfig.filter(item => item.isDetailParam) : props.dataConfig.filter(item => item.isCreateParam)

  // 按tagLabel分组
  const groupedArray: { [key: string]: fastFormDataConfig[] } = filterDataConfig.reduce((acc, item) => {
    const tagLabel = (item.formOption && item.formOption.tagLabel)? item.formOption.tagLabel : '基础信息';
    if (!acc[tagLabel]) {
      acc[tagLabel] = []
    }
    acc[tagLabel].push(item)
    return acc;
  }, {})

  return groupedArray

})


// 取消按钮
const cancel = (formEl: any) => {
  state.open = false;
  // 清除store中的缓存参数
  formStore.resetParamObject()
  resetForm();
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  state.open = true;
  state.title = t('message.dialog.but_add');
  mode.value = "add";
}

const updateFormData = (data: any) => {
  state.form = {...state.form, ...data}

  // if (state.form.longitude && state.form.latitude) {
  //   state.form.location = JSON.stringify({
  //     lng: state.form.longitude,
  //     lat: state.form.latitude
  //   })
  // }

}

// 页面修改按钮触发弹窗
const handleUpdate = (id: any) => {
  reset();
  state.open = true;
  state.title = t('message.dialog.title_info');
  emit('getInfo', id)
  mode.value = "edit";

}

const handleInfo = (id: any) => {
  reset();
  state.open = true;
  state.title = t('message.dialog.title_info');
  emit('getInfo', id)
  mode.value = "info";
}


/** 提交按钮 */
const submitForm = (formEl: any | undefined) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      if (state.form.id != null) {
        emit('update', state.form);
      } else {
        emit('add', state.form)
      }
    }
  })
}
// 表单重置
const reset = () => {
  // 将form对象的参数值全部设置为null
  for (const key in state.form) {
    state.form[key] = null;
  }
  // 清空formStore缓存
  formStore.resetParamObject()

}
// 清空表单
const resetForm = () => {
  if (formRef.value == undefined) return
  formRef.value.resetFields()
}


const handleClose = (done: () => void) => {
  state.open = false;
}

// 如果有城市选择器，则从该函数获取城市选中的label数组
const updateCityLabelArray = (cityLabelArray: any) => {
  state.form.cityLabelArray = cityLabelArray
}

// // 如果由经纬坐标选择器，则更新经度、纬度到form的longitude、latitude
// const updateLocation = (location: { lng: any, lat: any }) => {
//   // location经纬度对象需转换为两个参数
//   if (location) {
//     state.form.longitude = location.lng
//     state.form.latitude = location.lat
//   }
// }

const updateFormDataAndOpen = (data: any) => {
  state.form = {...state.form, ...data};
  state.open = true;
}


defineExpose({
  handleAdd,
  handleUpdate,
  handleClose,
  handleInfo,
  updateFormData,
  updateFormDataAndOpen,
})
</script>


<style scoped>
@media screen and (max-width: 767px) {
  .form-item {
    width: 90%;
    align-items: flex-start !important;
  }
}

@media screen and (min-width: 768px) and (max-width: 1365px) {
  .form-item {
    width: 80%;
    align-items: flex-start !important;
  }
}

@media screen and (min-width: 1366px) {
  .form-item {
    width: 45%;
    align-items: flex-start !important;
  }
}
</style>
