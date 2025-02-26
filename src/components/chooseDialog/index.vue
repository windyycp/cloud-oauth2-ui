<template>
  <div class="flex w100 flex-warp ml20">
    <el-dialog v-model="state.open"  title="请选择" width="60%">
      <component ref="dialogTableRef" :is="DialogComponent"
                 :hideControl="true" :isChooseMode="true" :hideSearchForm="true"/>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.open = false">{{$t('message.formI18n.but_cancel')}}</el-button>
        <el-button type="primary" @click="handleReferenceAdd">
          {{$t('message.dialog.but_add')}}
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="">
import {
  reactive,
  ref, computed
} from 'vue';

const emit = defineEmits(['show', 'cancel', 'handleReferenceAdd'])
const props = defineProps(['DialogComponent'])
const dialogTableRef = ref(null)


// 定义变量
const state = reactive<any>({
  open: false,
})


const show = () => {
  state.open = true;
}


const cancel = () => {
  state.open = false;
}

const handleReferenceAdd = () =>{
  emit('handleReferenceAdd',dialogTableRef.value.selectRows)
  state.open = false
}

defineExpose({
  show,
  cancel
})
</script>

<style>
</style>
