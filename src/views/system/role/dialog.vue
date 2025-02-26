<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色名称">
							<el-input v-model="state.ruleForm.roleName" placeholder="请输入角色名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色标识">
							<template #label>
								<el-tooltip effect="dark" content="用于 `router/route.ts` meta.roles"
									placement="top-start">
									<span>角色标识</span>
								</el-tooltip>
							</template>
							<el-input v-model="state.ruleForm.roleKey" placeholder="请输入角色标识" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序">
							<el-input-number v-model="state.ruleForm.sort" :min="0" :max="999" controls-position="right"
								placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色状态">
							<el-switch v-model="state.ruleForm.status" inline-prompt active-text="启"
								inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="角色描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入角色描述"
								maxlength="150"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单权限">
							<el-tree :data="state.menuData" :props="state.menuProps" show-checkbox
								@check-change="handleCheckChange" class="menu-data-tree" node-key="id"
								:default-checked-keys="state.default_menuIds" check-strictly=true />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemRoleDialog">
	import { reactive, ref } from 'vue';
	import { useRoleApi } from '/@/api/role/index';
	import { useMenuApi } from '/@/api/menu/index';
	import { i18n } from '/@/i18n';
	import { ElMessage, ElTree } from 'element-plus'
	// import { da } from 'element-plus/es/locale';
	// import { it } from 'node:test';
	const treeRef = ref<InstanceType<typeof ElTree>>()
	// 定义子组件向父组件传值/事件

	const emit = defineEmits(['refresh']);
	// 引入 api 请求接口
	const roleApi = useRoleApi();
	const menuApi = useMenuApi();
	// 定义变量内容
	const roleDialogFormRef = ref();
	const state = reactive({
		ruleForm: {
			roleName: '', // 角色名称
			roleKey: '', // 角色标识
			sort: 0, // 排序
			status: true, // 角色状态
			remark: '', // 角色描述
			menuIds: [], // 菜单id集合
		},
		menuData: [] as TreeType[],
		menuProps: {
			children: 'children',
			label: 'label',
			id: 0,
		},
		default_menuIds: [], // 菜单id集合
		dialog: {
			isShowDialog: false,
			type: '',
			title: '',
			submitTxt: '',
		},
	});
	interface Tree {
		id : number
		name : string
	}
	// 选中改变
	const handleCheckChange = (
		data : any,
		checked : boolean,
		indeterminate : boolean
	) => {
		if (checked) {
			const exist = state.ruleForm.menuIds.filter(item => {
				return item == data.id
			})
			if (exist == null || exist.length == 0) {
				state.ruleForm.menuIds.push(data.id)
				// let children = data.children
				// setChildren(children,data)
			}
			// state.ruleForm.menuIds.push(data.id)
		}
		else {
			state.ruleForm.menuIds = state.ruleForm.menuIds.filter(item => {
				return item != data.id;
			})
		}
		if (indeterminate && !checked) {
			const exist = state.ruleForm.menuIds.filter(item => {
				return item == data.id
			})
			if (exist == null || exist.length == 0) {
				state.ruleForm.menuIds.push(data.id)
			}
		}

		console.log(state.ruleForm.menuIds)
	}
	// 递归设置菜单孩子id
	const setChildren = (children:any,data:any) =>{
		if (children != null && children.length > 0) {
			data.children.map(item => {
				state.ruleForm.menuIds.push(item.id)
				setChildren(item.children,data)
			})
		}
	}
	// 打开弹窗
	const openDialog = (type : string, row : RowRoleType) => {
		if (type === 'edit') {
			state.ruleForm = row;
			state.dialog.title = '修改角色';
			state.dialog.submitTxt = '修 改';
			state.dialog.type = 'edit'
			// 封装菜单集合
			state.default_menuIds = state.ruleForm.menuIds
		} else {
			state.dialog.title = '新增角色';
			state.dialog.submitTxt = '新 增';
			state.dialog.type = 'add'
			// 清空表单，此项需加表单验证才能使用
			// nextTick(() => {
			// 	roleDialogFormRef.value.resetFields();
			// });
			// 清空
			refresh();
		}
		state.dialog.isShowDialog = true;
		menuApi.getAdminMenu().then(res => {
			state.menuData = getMenuData(res.data)
			console.log(state.menuData);
		});
		// state.menuData=getMenuData(null);
	};
	// 关闭弹窗
	const closeDialog = () => {
		state.dialog.isShowDialog = false;

	};
	// 取消
	const onCancel = () => {
		closeDialog();
		// console.log(roleDialogFormRef)
		refresh()

	};
	const refresh = () => {
		state.ruleForm.roleName = ''; // 角色名称
		state.ruleForm.roleKey = ''; // 角色标识
		state.ruleForm.sort = 0; // 排序
		state.ruleForm.status = true; // 角色状态
		state.ruleForm.remark = ''; // 角色描述
		state.ruleForm.menuIds = []; // 菜单id集合
		state.default_menuIds = [];	//默认选中菜单
	}
	// 提交
	const onSubmit = () => {
		closeDialog();
		// emit('refresh');
		console.log(state.menuData)
		if (state.menuProps != null && state.menuProps.id != 0) {

		}
		if (state.dialog.type === 'add') {
			console.log(state.ruleForm)
			roleApi.addRole(state.ruleForm).then(res => {
				if (res.data = true) {
					ElMessage.success("添加成功")
				} else {
					ElMessage.error("添加失败")
				}
				// 刷新table
				emit('refresh')
			})
		} else if (state.dialog.type === 'edit') {
			roleApi.editRole(state.ruleForm).then(res => {
				if (res.data = true) {
					ElMessage.success("修改成功")
				} else {
					ElMessage.error("修改失败")
				}
				// 刷新table
				emit('refresh')
			})
		}
	};
	// 获取菜单结构数据
	const getMenuData = (routes : any) => {
		const arr : any = [];
		routes.map((val : any) => {
			val['label'] = i18n.global.t(val.meta?.title as string);
			arr.push({ ...val });
			if (val.children) getMenuData(val.children);
		});
		return arr;
	};

	// 暴露变量
	defineExpose({
		openDialog,
	});
</script>

<style scoped lang="scss">
	.system-role-dialog-container {
		.menu-data-tree {
			width: 100%;
			border: 1px solid var(--el-border-color);
			border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
			padding: 5px;
		}
	}
</style>