<template>
  <div class="flex w100 flex-warp ml20">
    <el-dialog v-model="state.open" :title="state.title" width="60%" draggable append-to-body @close="cancel"
    >
      <AMap ref="amapref" @updateLat="updateLat" @updateLng="updateLng"/>
      <template #footer>
        <div class="mt20 flex flex-h-end">
          <el-button type="primary" @click="confirm">{{ $t('message.dialog.but_confirm') }}</el-button>
          <el-button @click="cancel">{{ $t('message.dialog.but_cancel') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="">
import {
  reactive,
  ref,
} from 'vue';
import {useI18n} from 'vue-i18n';
import AMap from '/@/components/AMapContainer/index.vue'

const {t} = useI18n();

const emit = defineEmits(['updateLocation'])

const amapref = ref('')

// 定义变量
const state = reactive<any>({
  open: false,
  // 表单参数
  form: {},
  pointLng: 0, // 选中点经度
  pointLat: 0, // 选中点纬度
})


// 取消按钮
const cancel = (formEl: any) => {
  state.open = false;
}

/** 新增按钮操作 */
const handleAdd = () => {
  state.open = true;
}

const updateFormData = (data: any) => {
  state.form = data;
}

// 页面修改按钮触发弹窗
const handleUpdate = (id: any) => {
  state.open = true;
  state.title = t('message.dialog.title_info');
}

const handleInfo = () => {
  state.open = true;
  state.title = t('message.dialog.title_info');
}


const handleClose = (done: () => void) => {
  state.open = false;
}

const updateLng = (lng) => {
  state.pointLng = lng
}

const updateLat = (lat) => {
  state.pointLat = lat
}

const confirm = () => {
  // 通知父组件
  emit('updateLocation', {lng: state.pointLng, lat:state.pointLat })
  state.open = false;
}

defineExpose({
  handleAdd,
  handleUpdate,
  handleClose,
  handleInfo,
  updateFormData,
})
</script>


<style>
/*@media screen and (max-width: 767px) {*/
/*  .form-item{*/
/*    width: 90%;*/
/*  }*/
/*}*/

/*@media screen and (min-width: 768px) and (max-width: 1365px){*/
/*  .form-item{*/
/*    width: 90%;*/
/*  }*/
/*}*/

/*@media screen and (min-width: 1366px) {*/
/*  .form-item{*/
/*    width: 95%;*/
/*  }*/
/*}*/
</style>
