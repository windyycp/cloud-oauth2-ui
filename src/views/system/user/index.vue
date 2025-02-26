<template>
	<div class="app-container w100 p10">
		<el-card shadow="Never" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-input size="default" placeholder="请输入用户名称" style="max-width: 180px" v-model="state.key"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchUsers">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button icon="ele-Refresh" size="default" @click="resetQuery">{{$t('message.formI18n.but_reset')}}</el-button>
				<Auth :value="'btn.user.add'">
					<el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增用户
					</el-button>
				</Auth>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" size="default">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="userName" label="账户名称" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="nickName" label="用户昵称" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="roleName" label="角色" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="postName" label="部门" show-overflow-tooltip></el-table-column>
				<el-table-column prop="departmentName" label="岗位" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="phone" label="手机号" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="email" label="邮箱" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="status" label="用户状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="用户描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createAt" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('message.table.but_operation')" width="100">
					<template #default="scope">
						<Auth :value="'btn.user.edit'">
							<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
								@click="onOpenEditUser('edit', scope.row)">{{$t('message.formI18n.but_edit')}}</el-button>
						</Auth>
						<Auth :value="'btn.user.del'">
							<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
								@click="onRowDel(scope.row)">{{$t('message.formI18n.but_delete')}}</el-button>
						</Auth>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="onHandleSizeChange" small @current-change="onHandleCurrentChange" class="mt15 flex-h-end"
				:pager-count="5" :page-sizes="[10, 20, 30]" 
				v-model:current-page="state.tableData.param.pageNum"
				v-model:page-size="state.tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper" 
				:total="state.tableData.total" background >
			</el-pagination>
		</el-card>
		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
	import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
	import { ElMessageBox, ElMessage } from 'element-plus';
	import { useUserApi } from '/@/api/user/index';
	// 局部引入 权限组件
	import Auth from "/@/components/auth/auth.vue";
	// 引入组件
	const UserDialog = defineAsyncComponent(() => import('/@/views/system/user/dialog.vue'));
	const size = 'default'

	// 引入 api 请求接口
	const userApi = useUserApi();

	// 定义变量内容
	const userDialogRef = ref();
	const state = reactive<any>({

		tableData: {
			data: [],
			total: 0,
			loading: false,
			param: {
				pageNum: 1,
				pageSize: 10,
			},
		},
		// 状态列表
		statusList: [],
		// 查询关键词
		key: '' as string,
	});

	// 初始化表格数据
	const getTableData = () => {
		state.tableData.loading = true;
		// 后端接口用户分页
		getUsersPage(state.tableData.param);
		setTimeout(() => {
			state.tableData.loading = false;
		}, 500);
	};
	const searchUsers = () => {
		state.tableData.param.name = state.key
		getUsersPage(state.tableData.param)
	}
	const getUsersPage = (params : any | undefined) => {
		return new Promise((resolve) => {
			userApi.getUsers(params).then(res => {
				state.tableData.data = res?.data.list;
				state.tableData.total = res?.data.total;
				state.tableData.loading = false;
				console.log(state.tableData.total);
			});
		});
	}
	// 打开新增用户弹窗
	const onOpenAddUser = (type : string) => {
		userDialogRef.value.openDialog('add');
	};
	// 打开修改用户弹窗
	const onOpenEditUser = (type : string, row : RowUserType) => {
		userApi.getUserById(row.id).then(res => {
			const userInfo = res.data;
			userInfo.department = row.department;
			userInfo.posts = row.posts;
			userDialogRef.value.openDialog('edit', userInfo);
		})
	};
	// 删除用户
	const onRowDel = (row : RowUserType) => {
		ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.userName}”，是否继续?`, '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(() => {
				// 删除操作
				deleteUser(row.id)
			})
			.catch(() => { });
	};
	// 删除操作
	const deleteUser = (id : number) => {
		userApi.deleteUser(id).then((res : any) => {
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
		// 获取用户信息
		getTableData();

	});

	/** 重置按钮操作 */
	const resetQuery = (queryForm : any) => {
		// resetForm("queryForm");
		state.key = '';
		state.tableData.param.name = ''
		getTableData();
	}
</script>

<style scoped lang="scss">
	.system-user-container {
		:deep(.el-card__body) {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: auto;

			.el-table {
				flex: 1;
			}
		}
	}
</style>
