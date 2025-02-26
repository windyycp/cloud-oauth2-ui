<template>
  <div class="flex flex-column flex-v-start">
    <div v-for="(item,index) in props.fileList"
         class="w100 mr20 p4 flex flex-h-center flex-v-center flex-h-between file_img"
         :key="index">

      <div class="flex">
        <img style="width:24px;height: 24px" class="mr10" :src="DocumentICON" @click="handleFileOpenClick(item.url)"/>
        <div class="filename">
          {{ item.name }}
        </div>
      </div>
      <div>
        <Auth :value="'btn.documents.view'">
          <el-button size="small" type="primary" class="ml20" @click="handleFileOpenClick(item.url)">{{$t('message.table.but_info')}}</el-button>
        </Auth>
<!--        <el-popconfirm title="确定删除所选文件吗?" @confirm="handleFileDelete(item.url)">-->
<!--          <template #reference>-->
<!--            <el-button size="small" type="danger" class="ml20" >{{$t('message.formI18n.but_delete')}}</el-button>-->
<!--          </template>-->
<!--        </el-popconfirm>-->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import DocumentICON from '/@/assets/document_icon.svg'

const props = defineProps(['fileList'])

const emit = defineEmits(['handleDelete'])

/**
 * 文件打开按钮事件
 */
const handleFileOpenClick = (item: any) => {
  window.open(item)
}

// const handleFileDelete = (url: any) => {
//   emit('handleDelete', url)
// }

</script>


<style scoped lang="scss">
.filename {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
}

.file_img:hover {
  background-color: rgba(175, 162, 162, 0.14);
  border-radius: 4px;
}
</style>
