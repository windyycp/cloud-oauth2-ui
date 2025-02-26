<template>
  <div class="app-container w100 h100 p10">

    <div class="list-form">
      <!-- 搜索栏 -->
      <el-form :model="state.queryParams" ref="queryForm" :size="size" :inline="true" v-show="state.showSearch"
                >
        <el-form-item v-for="item in queryConfig.filteredDataConfig"
                       :label="(item.propAlias?$t('message.dataModel.'+item.propAlias):$t('message.dataModel.'+item.prop))+':'"
                      :prop="item.prop" :key="item.prop">
          <FastFormItem :formItem="item" v-model="state.queryParams[item.prop]" @handleQuery="handleQuery">
          </FastFormItem>
        </el-form-item>
        <el-form-item v-if="queryConfig.filteredDataConfig.length > 0">
          <Auth :value="'btn.syslog.query'">
            <el-button type="primary" icon="ele-Search" :size="size" @click="handleQuery">
              {{ $t('message.formI18n.but_search') }}
            </el-button>
            <el-button icon="ele-Refresh" :size="size" @click="resetQuery(queryForm)">
              {{ $t('message.formI18n.but_reset') }}
            </el-button>
          </Auth>
        </el-form-item>
      </el-form>

      <!-- 工具栏 -->
      <!-- <el-row :gutter="10" class="mb8" v-if="!props.hideControl">
        <el-col :span="1.5">
          <Auth :value="'btn.syslog.add'">
            <el-button type="primary" plain icon="ele-Plus" :size="size" @click="handleAdd">{{$t('message.formI18n.but_add')}}</el-button>
          </Auth>
        </el-col>
        <el-col :span="1.5">
          <Auth :value="'btn.syslog.edit'">
            <el-button type="success" plain icon="ele-Edit" :size="size" :disabled="state.single" @click="handleUpdate">{{$t('message.formI18n.but_edit')}}
            </el-button>
          </Auth>
        </el-col>
        <el-col :span="1.5">
          <Auth :value="'btn.syslog.del'">
            <el-popconfirm :title="$t('message.popconfirm.but_delete')" @confirm="handleDelete">
              <template #reference>
                <el-button type="danger" plain icon="ele-Delete" :size="size" :disabled="state.multiple">{{$t('message.formI18n.but_delete')}}
                </el-button>
              </template>
            </el-popconfirm>
          </Auth>
        </el-col>
      </el-row> -->
    </div>


    <!-- 表格 -->
    <div class="list-bg w100 flex-column" style="">
      <el-table  ref="tableRef" class="w100 h100" v-loading="state.loading" :data="state.tableList" border
                @selection-change="handleSelectionChange" @row-click="handleRowClick">
        <el-table-column v-if="!props.hideControl || props.isChooseMode" type="selection" width="55" align="center" />
        <el-table-column v-for="col in dataConfig.filter((obj: any) => !obj.isHideTable)"  :prop="col.prop" :show-overflow-tooltip = "col?.tableOptions?.showOverFlowTooltip"
                         :label="col.propAlias?$t('message.dataModel.'+col.propAlias):$t('message.dataModel.'+col.prop)"
                         :key="col.prop" :width="col?.tableOptions?.width">
          <template #default="scope" v-if="col.tableOptions && col.tableOptions.slots">
            <component :is="col.tableOptions.slots.default({ row: scope.row })"/>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('message.table.but_operation')" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <Auth :value="'btn.syslog.view'">
              <el-button class="mr5" type="primary" link @click="handleInfo(scope.row.id)">{{$t('message.table.but_info')}}
              </el-button>
            </Auth>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <el-pagination
          @size-change="onHandleSizeChange" small
          @current-change="onHandleCurrentChange" class="mt15 flex-h-end"
          :pager-count="5" :page-sizes="[10, 20, 30]" background v-model:current-page="state.queryParams.pageNum"
          v-model:page-size="state.queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="state.total">
      </el-pagination>
    </div>



    <!-- 添加或修改对话框 -->
    <EditDialog ref="editRef"
                :dataConfig="dataConfig"
                @getList="getList"
                @update="updateRequest"
                @add="addRequest"
                @getInfo="getInfo"></EditDialog>

  </div>
</template>

<script lang="ts" setup name="">
import {reactive, onMounted, ref, defineAsyncComponent} from 'vue';
import {ElMessage, ElTable,} from 'element-plus'
import Auth from "/@/components/auth/auth.vue";

// 导入api
import {page, del, update, add, get} from "/@/api/syslog";

// 导入模型
import {getAllDataConfig, getQueryDataConfig} from "/@/model/sysLog/dataConfig";

const EditDialog = defineAsyncComponent(() => import('/@/components/editDialog/index.vue'));
const FastFormItem = defineAsyncComponent(() => import('/@/components/fastFormItem/index.vue'))

const size = "small"
const editRef = ref()
const queryForm = ref()

// 选中的行
const selectRows = ref([])
const tableRef = ref<InstanceType<typeof ElTable>>()

// 定义组件参数，可复写默认的dataModel
const props = defineProps(['dataModel', 'hideControl', 'isChooseMode','isSingleSelect'])

// 定义变量
const state = reactive<any>({
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 0,
  // 表格数据
  tableList: [],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    number: null,
    createAt: null,
    updateAt: null,
  },
  // 表单参数
  form: {},
  // 表单校验
  rules: {},
})

// 读取配置
const dataConfig = getAllDataConfig(props.dataModel);
const queryConfig = getQueryDataConfig(dataConfig)

// 加载完
onMounted(() => {
  getList();
})

/** 查询列表 */
const getList = () => {
  state.loading = true;
  page(state.queryParams).then(res => {
    state.total = res.total;
    state.tableList = res.data;
    state.loading = false;
  });
}

// 打开详情框
const handleInfo = (id: any) => {
  editRef.value.handleInfo(id);
}

// 查询详情
const getInfo = (id: any) => {
  get(id).then((res: any) => {
    // 将结果返回给子组件
    editRef.value.updateFormData(res.data)
  });
}

// 打开新增框
const handleAdd = () => {
  editRef.value.handleAdd();
}

// 执行新增
const addRequest = (formData: any) => {
  add(formData).then(res => {
    ElMessage.success("新增成功")
    editRef.value.handleClose();
    getList()
  });
}

// 打开修改框
const handleUpdate = (row: any) => {
  var id = row.craftsId || state.ids
  editRef.value.handleUpdate(id);
}

// 执行修改
const updateRequest = (formData: any) => {
  update(formData).then(res => {
    ElMessage.success("修改成功")
    editRef.value.handleClose();
    getList()
  });
}

// 取消按钮
// const cancel = (formEl : any) => {
// 	state.open = false;
// 	reset();
// 	if (formEl.value == undefined) return
// 	formEl.resetFields();
// }

/** 删除按钮操作 */
const handleDelete = (row: any) => {
  const ids = row.id || state.ids;
  del(ids).then(res => {
    ElMessage.success("删除成功")
    getList();
  });
}

// 表单重置
const reset = () => {
  state.form = {
    id: null,
    barCode: null,
    productNo: null,
    workOrderNo: null,
    createAt: null,
    createBy: null,
    updateAt: null,
    updateBy: null
  };
  // state.resetForm("form");
}

/** 搜索按钮操作 */
const handleQuery = () => {
  state.queryParams.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = (queryFormRef: any) => {
  queryFormRef.resetFields();
  handleQuery();
}

// 多选框选中数据
const handleSelectionChange = (selection) => {
  state.ids = selection.map(item => item.id)
  state.single = selection.length !== 1
  state.multiple = !selection.length
  selectRows.value = selection;

  if (props.isSingleSelect && selection.length > 1) {
    // 单选模式
    tableRef.value!.clearSelection()
    tableRef.value!.toggleRowSelection(selection[selection.length - 1], true)
    selectRows.value = [selection[selection.length - 1]];
  } else {
    selectRows.value = selection;
  }
}

// 选择行
const handleRowClick = (row: any) => {
  tableRef.value!.toggleRowSelection(row, !selectRows.value.includes(row))
}

// 页大小改变
const onHandleSizeChange = (val: number) => {
  getList();
};

// 分页改变
const onHandleCurrentChange = (val: number) => {
  getList();
};

// 关闭
const handleClose = (done: () => void) => {
  done()
}

defineExpose({
  selectRows,
})

</script>

<style lang="scss" scoped></style>
