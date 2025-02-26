<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户名称">
							<el-input v-model="state.ruleForm.userName" placeholder="请输入账户名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户昵称">
							<el-input v-model="state.ruleForm.nickName" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="关联角色">
							<el-select v-model="state.ruleForm.roles" multiple placeholder="请选择" clearable class="w100">
								<!-- <el-option label="超级管理员" value="admin"></el-option>
								<el-option label="普通用户" value="common"></el-option> -->
								<el-option v-for="item in state.roles" :label="item.name" :value="item.roleKey" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="所属岗位">
							<el-select v-model="state.ruleForm.posts" multiple placeholder="请选择" clearable class="w100">
								<el-option v-for="item in state.posts" :label="item.postName" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="所属部门">
							<el-cascader :options="state.deptData"
								:props="{ checkStrictly: true, multiple:true, emitPath:false, value: 'id', label: 'deptName' }"
								placeholder="请选择部门" 
								clearable 
								node-key="id"
								class="w100" 
								@check-change="deptCheckChange"
								v-model="state.ruleForm.department">
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱">
							<el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="性别">
							<el-select v-model="state.ruleForm.sex" placeholder="请选择" clearable class="w100">
								<!-- <el-option label="男" value="男"></el-option> -->
								<!-- <el-option label="女" value="女"></el-option> -->
								 <el-option
								      v-for="item in state.sexOptions"
								      :key="item.id"
								      :label="item.dictLabel"
								      :value="item.dictValue"
								    />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户密码">
							<el-input v-model="state.ruleForm.password" placeholder="请输入" type="password"
								clearable></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户过期">
							<el-date-picker v-model="state.ruleForm.overdueTime" type="date" placeholder="请选择"
								class="w100"> </el-date-picker>
						</el-form-item>
					</el-col> -->
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态">
							<el-switch v-model="state.ruleForm.status" inline-prompt active-text="启"
								inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="用户描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入用户描述"
								maxlength="150"></el-input>
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

<script setup lang="ts" name="systemUserDialog">
	import { reactive, ref, onMounted, nextTick } from 'vue';
	import { useUserApi } from '/@/api/user/index';
	import { useRoleApi } from '/@/api/role/index';
	import { ElMessage } from 'element-plus'
	import { getDictCacheByType } from '/@/api/system/dict/type';
	import { list } from "/@/api/system/dept/index";
	import { list as postList } from "/@/api/system/post/index";
	// import { mutable } from 'element-plus/es/utils';

	// 定义子组件向父组件传值/事件
	const emit = defineEmits(['refresh']);
	// 引入 api 请求接口
	const userApi = useUserApi();
	const roleApi = useRoleApi();
	// 定义变量内容
	const userDialogFormRef = ref();
	const state = reactive({
		ruleForm: {
			userName: '', // 账户名称
			nickName: '', // 用户昵称
			roles: [], // 关联角色
			department: [] as object[], // 部门
			phone: '', // 手机号
			email: '', // 邮箱
			sex: '', // 性别
			password: '', // 账户密码
			// overdueTime: '', // 账户过期
			status: true, // 用户状态
			remark: '', // 用户描述
			posts: [], // 用户岗位
		},
		// 性别列表
		sexOptions:[],
		// 角色集合
		roles: [] as any,
		posts: [], // 用户岗位
		deptData: [] as DeptTreeType[], // 部门数据
		dialog: {
			isShowDialog: false,
			type: '',
			title: '',
			submitTxt: '',
		},
	});

	// 打开弹窗
	const openDialog = (type : string, row : RowUserType) => {
		if (type === 'edit') {
			state.ruleForm = row;
			state.dialog.title = '修改用户';
			state.dialog.submitTxt = '修 改';
			state.dialog.type = 'edit';
		} else {
			state.dialog.title = '新增用户';
			state.dialog.submitTxt = '新 增';
			state.dialog.type = 'add';
			// 清除表单
			clear();
			// 清空表单，此项需加表单验证才能使用
			// nextTick(() => {
			// 	userDialogFormRef.value.resetFields();
			// });
		}
		state.dialog.isShowDialog = true;
		getData(row);
		
	};
	const clear = () => {
		let ruleForm = {
			userName: '', // 账户名称
			nickName: '', // 用户昵称
			roles: [], // 关联角色
			phone: '', // 手机号
			email: '', // 邮箱
			sex: '', // 性别
			password: '', // 账户密码
			// overdueTime: '', // 账户过期
			status: true, // 用户状态
			remark: '', // 用户描述
		}
		state.ruleForm = ruleForm
	}
	// 关闭弹窗
	const closeDialog = () => {
		state.dialog.isShowDialog = false;
	};
	// 取消
	const onCancel = () => {
		closeDialog();
	};
	// 提交
	const onSubmit = () => {
		closeDialog();
		// 新增
		if (state.dialog.type === 'add') {
			userApi.addUser(state.ruleForm).then(res => {
				if (res.data = true) {
					ElMessage.success("添加成功")
				} else {
					ElMessage.error("添加失败")
				}
				// 刷新table
				emit('refresh')
			}).catch((error)=>{
			})
		}
		// 编辑
		else if (state.dialog.type === 'edit') {
			userApi.editUser(state.ruleForm).then(res => {
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
	// 获取角色集合
	const getRoleList = () => {
		roleApi.getRoles().then(res => {
			res.data.list.map(item => {
				let data = {} as any;
				// data.id=item.id
				data.name = item.roleName
				data.roleKey = item.roleKey
				state.roles.push(data)
			})
		})
	};
	// 获取启用状态
	const getUserSexOptions = () => {
		var dictType = 'sys_user_sex';
		getDictCacheByType(dictType).then((res : any | undefined) => {
			state.sexOptions = res.data.sysDictDatas;
		})
	}
	// 页面加载时
	onMounted(() => {
		getRoleList();
		// 获取用户性别字典
		getUserSexOptions();
	});

	const getData = (row : RowUserType) => {
		// 查询部门数据
		list(null).then(res => {
			state.deptData = res.data;
		});

		// 查询岗位数据
		postList(null).then(res => {
			state.posts = res.data;
		});
	}

	const deptCheckChange = (a, b, c) => {
		console.log(a, b,c );
	}

	// 初始化部门数据
	// const getMenuData = () => {
	// 	state.deptData.push({
	// 		deptName: 'vueNextAdmin',
	// 		createTime: new Date().toLocaleString(),
	// 		status: true,
	// 		sort: Math.random(),
	// 		describe: '顶级部门',
	// 		id: Math.random(),
	// 		children: [
	// 			{
	// 				deptName: 'IT外包服务',
	// 				createTime: new Date().toLocaleString(),
	// 				status: true,
	// 				sort: Math.random(),
	// 				describe: '总部',
	// 				id: Math.random(),
	// 			},
	// 			{
	// 				deptName: '资本控股',
	// 				createTime: new Date().toLocaleString(),
	// 				status: true,
	// 				sort: Math.random(),
	// 				describe: '分部',
	// 				id: Math.random(),
	// 			},
	// 		],
	// 	});
	// };

	// 暴露变量
	defineExpose({
		openDialog,
	});
</script>