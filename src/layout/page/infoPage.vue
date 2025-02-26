<template>
  <div class="app-container w100 h100 p10">
    <el-card shadow="never">
      <div class="flex flex-between w100 ">
        <!--标题-->
        <div class="mb20 MTitle strong"><slot name="title"></slot></div>

        <!--操作栏-->
        <span>
          <slot name="control"></slot>
        </span>

      </div>
      <!--表单-->
      <slot name="form"></slot>
    </el-card>
  </div>
</template>

<script setup lang="ts">

</script>
<style scoped lang="scss">

</style>
