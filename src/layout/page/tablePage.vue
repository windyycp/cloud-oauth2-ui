<template>
  <div class="app-container w100 h100 p10">

    <div class="list-form" v-if="!props.isChooseMode">
      <div class="table-page-title">
        <!--主标题-->
        <slot name="headerTitle"></slot>
      </div>
      <!-- 搜索栏 -->
      <slot name="searchForm"></slot>
    </div>

    <!-- 表格 -->
    <div class="list-bg w100 flex-column" style="">
      <div class="flex w100 flex-v-center flex-h-between">
        <div class="table-page-title-2">
          <!--表格标题-->
          <slot name="tableTitle"></slot>
        </div>
        <!-- 工具栏 -->
        <slot name="control"></slot>
      </div>
      <!--表格-->
      <slot name="table"></slot>
      <!--分页-->
      <slot name="pagination"></slot>

    </div>

    <div v-if="!props.isChooseMode" style="height: 100px"></div>

  </div>
</template>

<script setup lang="ts">
/**
 * 定义组件参数
 * * dataModel:可复写默认的dataModel
 * * hideControl：隐藏控制层
 * * isChooseMode：是否为弹窗选择模式
 * * isSingleSelect： 是否为单选模式
 */
const props = defineProps(['hideControl', 'isChooseMode','isSingleSelect'])

</script>

<style scoped lang="scss">

</style>
