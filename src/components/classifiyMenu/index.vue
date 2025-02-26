<template>
  <div class="flex flex-column" style="background-color: #fff;border-radius: 4px">
    <div class="p10" v-for="(item, index) in data" :key="index">
      <div class="menuItem " v-if="state.selectedMeneIndex == index">
        <el-tag v-if="item.group" type="success" size="small">#{{ item.group }}</el-tag>
        <span class="ml4 strong"> {{ item.label }}</span>
        <el-tag style="margin-left: auto" v-if="item.append" :type="item.appendType" size="small">{{ item.append }}
        </el-tag>
      </div>
      <div class="menuItem_unselected" v-else @click="select(index)">
        <el-tag v-if="item.group" type="info" size="small">#{{ item.group }}</el-tag>
        <span class="ml4 strong"> {{ item.label }}</span>
        <el-tag style="margin-left: auto" v-if="item.append" :type="item.appendType" effect="plain" size="small">
          {{ item.append }}
        </el-tag>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {onMounted, reactive, watch} from "vue";
import {Loading, OfficeBuilding, Refrigerator} from "@element-plus/icons-vue";

const props = defineProps(['data', 'loading'])

const emit = defineEmits(['select'])


const state = reactive({
  selectedMeneIndex: null
})


const select = (index: number) => {
  state.selectedMeneIndex = index
  emit('select', index)
}

watch(() => props.data, (newValue, oldValue) => {
  if (oldValue.length == 0 && newValue.length > 0) {
    state.selectedMeneIndex = 0
    emit('select', 0)
  }
})

onMounted(() => {
  if (props.data.length > 0) {
    state.selectedMeneIndex = 0
    emit('select', 0)
  }
})

const changeSelect = (index: number) => {
  state.selectedMeneIndex = index
  emit('select', index)
}

defineExpose({
  changeSelect
})

</script>

<style scoped lang="scss">
.menuItem {
  background-color: var(--el-color-primary-light-9);
  border-radius: 4px;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
}


.menuItem_unselected {
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;

}

.menuItem_unselected:hover {
  background-color: var(--el-color-primary-light-9);
  border-radius: 4px;
  padding: 10px;
}
</style>
