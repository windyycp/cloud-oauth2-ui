<template>
  <div class="system-dept-container layout-padding">
    <el-card shadow="never" class="layout-padding-auto">
      <div class="system-dept-search mb15">
        <el-input size="default" placeholder="请输入部门名称" style="max-width: 180px"
                  v-model="state.queryParams.deptName"></el-input>
        <Auth :value="'btn.dept.query'">
          <el-button size="default" type="primary" class="ml10" @click="handleQuery">
            <el-icon>
              <ele-Search/>
            </el-icon>
            查询
          </el-button>
        </Auth>

        <Auth :value="'btn.dept.add'">
          <el-button size="default" type="success" class="ml10" @click="onOpenAddDept('add')">
            <el-icon>
              <ele-FolderAdd/>
            </el-icon>
            新增部门
          </el-button>
        </Auth>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%;" row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" default-expand-all>
        <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序" show-overflow-tooltip width="80">
          <template #default="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="部门状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="部门描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createAt" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('message.table.but_operation')" show-overflow-tooltip >
          <template #default="scope">
            <Auth :value="'btn.dept.query'">
              <el-button size="small"  type="success" @click="onOpenAddDept('add',scope.row)">
                {{ $t('message.formI18n.but_add') }}
              </el-button>
            </Auth>
            <Auth :value="'btn.dept.edit'">
              <el-button class="ml10" size="small"  type="warning"
                         @click="onOpenEditDept('edit', scope.row)">{{ $t('message.formI18n.but_edit') }}
              </el-button>
            </Auth>
            <Auth :value="'btn.dept.del'">
              <el-button class="ml10" size="small"  type="danger" @click="onTabelRowDel(scope.row)">
                {{ $t('message.formI18n.but_delete') }}
              </el-button>
            </Auth>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <DeptDialog ref="deptDialogRef" @refresh="getList(null);"/>
  </div>
</template>

<script setup lang="ts" name="systemDept">
import {defineAsyncComponent, ref, reactive, onMounted} from 'vue';
import {ElMessageBox, ElMessage} from 'element-plus';

import {page, del} from "/@/api/system/dept/index";

// 引入组件
const DeptDialog = defineAsyncComponent(() => import('/@/views/system/dept/dialog.vue'));

// 定义变量内容
const deptDialogRef = ref();
const state = reactive<SysDeptState>({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
  },
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 9999,
  },
});

// 打开新增菜单弹窗
const onOpenAddDept = (type: string,row: any) => {
  deptDialogRef.value.openDialog(type, state.tableData.data,row);
};
// 打开编辑菜单弹窗
const onOpenEditDept = (type: string, row: DeptTreeType) => {
  deptDialogRef.value.openDialog(type, state.tableData.data, row);
};
// 删除当前行
const onTabelRowDel = (row: DeptTreeType) => {
  ElMessageBox.confirm(`此操作将删除部门：${row.deptName}, 是否继续?`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        handleDel(row.id);
      })
      .catch(() => {
      });
};

/** 搜索按钮操作 */
const handleQuery = () => {
  state.queryParams.pageNum = 1;
  getList(null);
}

// 获取菜单列表
const getList = (params: any | undefined) => {
  state.tableData.loading = true;
  page(state.queryParams).then(res => {
    state.tableData.loading = false;
    state.tableData.data = res.data;
  })
}

const handleDel = (id: any | undefined) => {
  state.tableData.loading = true;
  del(id).then(res => {
    state.tableData.loading = false;
    if (res.code === '0000') {
      getList(null);
      ElMessage.success('删除成功');
    } else {
      ElMessage.error('删除失败: ' + res.message);
    }
  })
}


// 页面加载时
onMounted(() => {
  getList(null);
});
</script>
