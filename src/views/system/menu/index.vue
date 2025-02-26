<template>
  <div class="system-menu-container layout-pd">
    <el-card shadow="never">
      <div class="system-menu-search mb15">
        <el-input size="default" v-model="state.menuName" placeholder="请输入菜单名称" style="max-width: 180px">
        </el-input>
        <el-button size="default" type="primary" class="ml10" @click="selectMenus">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button icon="ele-Refresh" size="default" @click="resetQuery">{{ $t('message.formI18n.but_reset') }}
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddMenu(null)">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增菜单
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%"
                row-key="path" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column label="菜单名称" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row.meta.icon"/>
            <span class="ml10">{{ $t(scope.row.meta.title) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column label="组件路径" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限标识" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="scope.row.menuType==='menu'">{{
                (scope.row.meta.roleNames && scope.row.meta.roleNames.length > 0) ? scope.row.meta.roleNames.join('，') : ''
              }}</span>
            <span v-else>
              {{
                  scope.row.btnPower
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="排序" show-overflow-tooltip width="80">
          <template #default="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="类型" show-overflow-tooltip width="80">
          <template #default="scope">
            <el-tag :type="scope.row.menuType === 'menu' ? 'success' : ''" size="small">
              {{ scope.row.menuType === 'menu' ? '菜单' : '按钮' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.table.but_operation')" show-overflow-tooltip width="140">
          <template #default="scope">
            <Auth :value="'btn.menu.add'">
              <el-button size="small" text type="primary" @click="onOpenAddMenu(scope.row)">
                {{ $t('message.formI18n.but_add') }}
              </el-button>
            </Auth>
            <!-- <Auth :value="'btn.menu.edit'"> -->
            <el-button size="small" text type="primary"
                       @click="onOpenEditMenu('edit', scope.row)">{{ $t('message.formI18n.but_edit') }}
            </el-button>
            <!-- </Auth> -->
            <Auth :value="'btn.menu.del'">
              <el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)">
                {{ $t('message.formI18n.but_delete') }}
              </el-button>
            </Auth>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <MenuDialog ref="menuDialogRef" @refresh="getMenuList()"/>
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import {defineAsyncComponent, ref, onMounted, reactive, nextTick} from 'vue';
import {RouteRecordRaw} from 'vue-router';
import {ElMessageBox, ElMessage} from 'element-plus';
import {storeToRefs} from 'pinia';
import {useRoutesList} from '/@/stores/routesList';
import {setBackEndControlRefreshRoutes} from "/@/router/backEnd";
import {useMenuApi} from '/@/api/menu/index';
import {i18n} from '/@/i18n/index';
// import { nextTick } from 'process';
// 局部引入 权限组件
import Auth from "/@/components/auth/auth.vue";
// 引入组件
const MenuDialog = defineAsyncComponent(() => import('/@/views/system/menu/dialog.vue'));
// 引入 api 请求接口
const menuApi = useMenuApi();
// 定义变量内容
const stores = useRoutesList();
const {routesList} = storeToRefs(stores);
const menuDialogRef = ref();
const state = reactive({
  tableData: {
    data: [] as RouteRecordRaw[],
    loading: true,
  },
  menuName: null,
});

// 获取路由数据，真实请从接口获取
const getTableData = () => {
  // 从接口，不从routerList拿，因为没有按钮
  getMenuList(null);
  setTimeout(() => {
    state.tableData.loading = false;
  }, 1000);
};
// 菜单查询
const selectMenus = () => {
  let data = {}
  if (state.menuName != '' && state.menuName != null) {
    data.title = i18n.global.t(state.menuName)
  }
  getMenuList(data);
}
// 获取菜单列表
const getMenuList = (params: any | undefined) => {
  menuApi.getAdminMenu(params).then(res => {
    console.log(res)
    state.tableData.loading = true;
    state.tableData.data = res.data;
  })
  setTimeout(() => {
    state.tableData.loading = false;
  }, 1000);
}
// 打开新增菜单弹窗
const onOpenAddMenu = (row: RouteRecordRaw) => {
  if(row){
    menuApi.getMenuById( row.id).then(res => {
      menuDialogRef.value.openDialog('add', res.data);
    });
  }else{
    menuDialogRef.value.openDialog('add');
  }
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row: RouteRecordRaw) => {
  menuApi.getMenuById(row.id).then(res => {
    menuDialogRef.value.openDialog('edit', res.data);
  });

};
// 删除菜单方法
const deleteMenu = (id: number) => {
  menuApi.deleteMenu(id).then((res: any) => {
    console.log(res)
    if (res.data == true) {
      ElMessage.success('删除成功');
    } else {
      ElMessage.error('删除失败');
    }
    // getMenuList();
    setBackEndControlRefreshRoutes()
  });

}
// 删除当前行
const onTabelRowDel = (row: RouteRecordRaw) => {
  ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        // 删除操作api
        deleteMenu(row.id);
        // 这是没从后端接口获取的
        // getTableData();
        nextTick(() => {

        });
        // await setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
        // setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试
      })
      .catch(() => {
      });
};
// 页面加载时
onMounted(() => {
  getTableData();
});

/** 重置按钮操作 */
const resetQuery = (queryForm: any) => {
  // resetForm("queryForm");
  state.menuName = null;
  getTableData();
}
</script>
