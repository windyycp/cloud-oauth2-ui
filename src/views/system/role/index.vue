<template>
	<div class="system-role-container layout-padding">
		<el-card shadow="never">
			<div class="">
				<div class="system-user-search mb15">
					<el-input v-model="state.tableData.param.search" size="default" placeholder="请输入角色名称"
						style="max-width: 180px"> </el-input>
					<el-button size="default" type="primary" class="ml10" @click="searchList">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
					<el-button icon="ele-Refresh" size="default" @click="resetQuery">{{$t('message.formI18n.but_reset')}}</el-button>
					<Auth :value="'btn.role.add'">
						<el-button size="default" type="success" class="ml10" @click="onOpenAddRole('add')">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增角色
						</el-button>
					</Auth>
				</div>
				<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
					<el-table-column type="index" label="序号" width="60" />
					<el-table-column prop="roleName" label="角色名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="roleKey" label="角色标识" show-overflow-tooltip></el-table-column>
					<el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
					<el-table-column prop="status" label="角色状态" show-overflow-tooltip>
						<template #default="scope">
							<el-tag type="success" v-if="scope.row.status">启用</el-tag>
							<el-tag type="info" v-else>禁用</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="角色描述" show-overflow-tooltip></el-table-column>
					<el-table-column prop="createAt" label="创建时间" show-overflow-tooltip></el-table-column>
					<el-table-column :label="$t('message.table.but_operation')" width="100">
						<template #default="scope">
							<Auth :value="'btn.role.edit'">
								<el-button :disabled="scope.row.roleName === '超级管理员'" size="small" text type="primary"
									@click="onOpenEditRole('edit', scope.row)">{{$t('message.formI18n.but_edit')}}</el-button>
							</Auth>
							<Auth :value="'btn.role.del'">
								<el-button :disabled="scope.row.roleName === '超级管理员'" size="small" text type="warning"
									@click="onRowDel(scope.row)">{{$t('message.formI18n.but_delete')}}</el-button>
							</Auth>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="onHandleSizeChange" small 
					@current-change="onHandleCurrentChange" 
					class="mt15 flex-h-end"
					:pager-count="10" :page-sizes="[10, 20, 30]" 
					v-model:current-page="state.tableData.param.pageNum"
					v-model:page-size="state.tableData.param.pageSize"
					layout="total, sizes, prev, pager, next, jumper" 
					:total="state.tableData.total" background>
				</el-pagination>
			</div>
			<RoleDialog ref="roleDialogRef" @refresh="getTableData()" />

		</el-card>
	</div>
</template>

<script setup lang="ts" name="systemRole">
	import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
	import { ElMessageBox, ElMessage } from 'element-plus';
	import { useRoleApi } from '/@/api/role/index';
	import { useMenuApi } from '/@/api/menu/index';
	// 局部引入 权限组件
	import Auth from "/@/components/auth/auth.vue";
	// 引入组件
	const RoleDialog = defineAsyncComponent(() => import('/@/views/system/role/dialog.vue'));
	// 引入 api 请求接口
	const roleApi = useRoleApi();

	// 定义变量内容
	const roleDialogRef = ref();
	const state = reactive<SysRoleState>({
		tableData: {
			data: [],
			total: 0,
			loading: false,
			param: {
				search: '',
				pageNum: 1,
				pageSize: 10,
			},
		},
	});
	// 初始化表格数据
	const getTableData = () => {
		state.tableData.loading = true;
		// 从后端接口来拿
		getRolePage(state.tableData.param);
		setTimeout(() => {
			state.tableData.loading = false;
		}, 500);
	};
	// 查询操作
	const searchList = () => {
		let data = state.tableData.param
		if (state.tableData.param.search != '' && state.tableData.param.search != null) {
			data.roleName = state.tableData.param.search
		}
		getRolePage(data);
		setTimeout(() => {
			state.tableData.loading = false;
		}, 500);

	}
	// 获取角色列表
	const getRolePage = (params : any | undefined) => {
		return new Promise((resolve) => {
			roleApi.getRoles(params).then(res => {
				state.tableData.data = res?.data.list;
				state.tableData.total = res?.data.total;
				return true;
			})
		})
	}
	// 打开新增角色弹窗
	const onOpenAddRole = (type : string) => {
		// roleDialogRef.value.openDialog(type);
		roleDialogRef.value.openDialog('add');
	};
	// 打开修改角色弹窗
	const onOpenEditRole = (type : string, row : Object) => {
		// roleDialogRef.value.openDialog(type, row);
		// 从后端获取 获取菜单相关信息
		roleApi.getRoleById(row.id).then(res => {
			console.log(res.data)
			roleDialogRef.value.openDialog('edit', res.data);
		})
		// roleDialogRef.value.openDialog('edit', row);
	};
	// 删除角色
	const onRowDel = (row : RowRoleType) => {
		ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.roleName}”，是否继续?`, '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(() => {
				// 删除操作
				deleteRole(row.id)
				// ElMessage.success('删除成功');
				// getTableData();
			})
			.catch(() => { });
	};
	const deleteRole = (id : number) => {
		roleApi.deleteRole(id).then((res : any) => {
			if (res.data = true) {
				ElMessage.success("删除成功")
				getTableData();
			} else {
				ElMessage.error("删除失败")
				getTableData();
			}
		})
	}
	// 分页改变
	const onHandleSizeChange = (val : number) => {
		state.tableData.param.pageSize = val;
		getTableData();
	};
	// 分页改变
	const onHandleCurrentChange = (val : number) => {
		state.tableData.param.pageNum = val;
		getTableData();
	};
	// 页面加载时
	onMounted(() => {
		getTableData();
	});

	/** 重置按钮操作 */
	const resetQuery = (queryForm : any) => {
		// resetForm("queryForm");
		state.tableData.param.search = '';
		state.tableData.param.roleName = null;
		getTableData();
	}
</script>

<style scoped lang="scss">
	.system-role-container {
		.system-role-padding {
			padding: 15px;

			.el-table {
				flex: 1;
			}
		}
	}
</style>
