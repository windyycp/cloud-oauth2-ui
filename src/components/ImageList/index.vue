<template>
  <div class="flex  flex-v-start">
    <div v-for="(item,index) in parsedImageUrls" class="mr20 p4 flex flex-h-center flex-v-center file_img"
         :key="index">
      <!--      <img style="width:36px;height: 36px" class="mr4" :src="item" @click="handleImageClick(item)"/>-->
      <el-image v-if="!isAvatar" style="width:48px;height: 48px" :src="item" fit="contain" @click="handleImageClick(item)"/>
      <el-avatar v-if="isAvatar" :size="32" :src="item"  fit="contain" @click="handleImageClick(item)"/>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" append-to-body>
    <el-image class="w100" :src="dialogImageUrl" fit="contain"/>
  </el-dialog>
</template>
<script setup lang="ts">
import {ref, watch, onMounted, computed} from "vue";

const props = defineProps(['imageUrl','isAvatar'])

const dialogVisible = ref(false)
const dialogImageUrl = ref('')

// 使用computed属性来处理imageUrls，确保无论传入的是字符串还是数组，都能正确处理
const parsedImageUrls = computed(() => {
  // 如果imageUrls是字符串，尝试解析为JSON
  if (typeof props.imageUrl === 'string' && props.imageUrl !== '') {
    try {
      const parsed = JSON.parse(props.imageUrl);
      // 确保解析后的结果是数组
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // 解析失败，返回空数组
      console.error('Parsing error:', e);
      return [];
    }
  }
  // 如果imageUrls本身就是数组，直接返回
  else if (Array.isArray(props.imageUrl)) {
    return props.imageUrl;
  }
  // 其他情况，返回空数组
  return [];
});

/**
 * 图片打开按钮事件
 */
const handleImageClick = (imgUrl) => {
  dialogImageUrl.value = imgUrl
  dialogVisible.value = true
}

</script>


<style scoped lang="scss">
</style>
