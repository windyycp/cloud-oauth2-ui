<template>
	<div class="system-menu-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" draggable>
			<el-form ref="menuDialogFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级菜单">
							<el-cascader :options="state.menuData"
								:props="{ checkStrictly: true, value: 'path', label: 'title' }" placeholder="请选择上级菜单"
								clearable class="w100" v-model="state.ruleForm.menuSuperior">
								<template #default="{ node, data }">
									<span>{{ data.title }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单类型">
							<el-radio-group v-model="state.ruleForm.menuType">
								<el-radio label="menu">菜单</el-radio>
								<el-radio label="btn">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单名称" prop="meta.title">
							<el-input v-model="state.ruleForm.meta.title" placeholder="格式：message.router.xxx"
								clearable></el-input>
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.menuType === 'menu'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由名称" prop="name">
								<el-input v-model="state.ruleForm.name" placeholder="路由中的 name 值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由路径" prop="path">
								<el-input v-model="state.ruleForm.path" placeholder="路由中的 path 值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由重定向">
								<el-input v-model="state.ruleForm.redirect" placeholder="请输入路由重定向" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="菜单图标">
								<IconSelector placeholder="请输入菜单图标" v-model="state.ruleForm.meta.icon" />
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="组件路径" prop="componentAlias">
								<el-input v-model="state.ruleForm.componentAlias" placeholder="组件路径" clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="链接地址">
								<el-input v-model="state.ruleForm.meta.isLink" placeholder="外链/内嵌时链接地址（http:xxx.com）"
									clearable :disabled="!state.ruleForm.isLink">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="权限标识" prop="meta.roles">
								<el-select v-model="state.ruleForm.meta.roles" multiple placeholder="取角色管理" clearable
									class="w100">
									<el-option v-for="item in state.rolekeys" :label="item.roleName" :value="item.roleKey" />
								</el-select>
							</el-form-item>
						</el-col>
					</template>
					<template v-if="state.ruleForm.menuType === 'btn'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="权限标识" prop="btnPower">
								<el-input v-model="state.ruleForm.btnPower" placeholder="请输入权限标识" clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="服务路径" prop="apiPathReg">
							<el-input v-model="state.ruleForm.apiPathReg" placeholder="服务路径" clearable></el-input>
						</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="服务方法" prop="apiMethod">
								<el-select v-model="state.ruleForm.apiMethod" placeholder="服务方法" clearable
									class="w100">
									<el-option v-for="item in state.ruleForm.apiMethods" :label="item" :value="item" />
								</el-select>
							</el-form-item>
						</el-col>

					</template>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单排序">
							<el-input-number v-model="state.ruleForm.sort" controls-position="right" placeholder="请输入排序"
								class="w100" />
						</el-form-item>
					</el-col>

					<template v-if="state.ruleForm.menuType === 'menu'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否隐藏">
								<el-radio-group v-model="state.ruleForm.meta.isHide">
									<el-radio :label="true">隐藏</el-radio>
									<el-radio :label="false">不隐藏</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="页面缓存">
								<el-radio-group v-model="state.ruleForm.meta.isKeepAlive">
									<el-radio :label="true">缓存</el-radio>
									<el-radio :label="false">不缓存</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否固定">
								<el-radio-group v-model="state.ruleForm.meta.isAffix">
									<el-radio :label="true">固定</el-radio>
									<el-radio :label="false">不固定</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否外链">
								<el-radio-group v-model="state.ruleForm.isLink" :disabled="state.ruleForm.meta.isIframe">
									<el-radio :label="true">是</el-radio>
									<el-radio :label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否内嵌">
								<el-radio-group v-model="state.ruleForm.meta.isIframe" @change="onSelectIframeChange">
									<el-radio :label="true">是</el-radio>
									<el-radio :label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(menuDialogFormRef)" size="default">{{ state.dialog.submitTxt
					}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import { defineAsyncComponent, reactive, onMounted, ref, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { i18n } from '/@/i18n/index';
import { setBackEndControlRefreshRoutes } from "/@/router/backEnd";
import { useMenuApi } from '/@/api/menu/index';
import { useRoleApi } from '/@/api/role/index';
import { ElMessage, ElTree } from 'element-plus'

// 引入 api 请求接口
const menuApi = useMenuApi();
const roleApi = useRoleApi();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const menuDialogFormRef = ref();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const state = reactive({
	// 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
	ruleForm: {
		menuSuperior: [], // 上级菜单
		menuType: 'menu', // 菜单类型
		name: '', // 路由名称
		component: '', // 组件路径
		componentAlias: '', // 组件路径别名
		isLink: false, // 是否外链
		sort: 0, // 菜单排序
		path: '', // 路由路径
		redirect: '', // 路由重定向，有子集 children 时
		meta: {
			title: '', // 菜单名称
			icon: '', // 菜单图标
			isHide: false, // 是否隐藏
			isKeepAlive: true, // 是否缓存
			isAffix: false, // 是否固定
			isLink: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
			isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
			roles: [], // 权限标识，取角色管理
		},
		btnPower: '', // 菜单类型为按钮时，权限标识
		apiMethods: ['GET', 'POST', 'PUT', 'DELETE'],
	},
	// 角色标识集合
	rolekeys: [],
	menuData: [] as RouteItems, // 上级菜单数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 获取 pinia 中的路由
const getMenuData = (routes: RouteItems) => {
	// console.log("routes" + JSON.stringify(routes))
	const arr: RouteItems = [];
	routes.map((val: RouteItem) => {
		val['title'] = i18n.global.t(val.meta?.title as string);
		arr.push({ ...val });
		if (val.children) getMenuData(val.children);
	});
	return arr;
};

// 打开弹窗
const openDialog = (type: string, row?: any) => {
  if (type === 'edit') {
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '修改菜单';
		state.dialog.submitTxt = '修 改';
		state.ruleForm.apiMethods = ['GET', 'POST', 'PUT', 'DELETE'];
	} else {
    state.dialog.title = '新增菜单';
		state.dialog.submitTxt = '新 增';
		clear();
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			menuDialogFormRef.value.resetFields();
      if(row)
        state.ruleForm.menuSuperior = row.menuSuperior;

    });
	}
	state.dialog.type = type;
 	state.dialog.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;

};
// 是否内嵌下拉改变
const onSelectIframeChange = () => {
	if (state.ruleForm.meta.isIframe) state.ruleForm.isLink = true;
	else state.ruleForm.isLink = false;
};
// 取消
const onCancel = () => {
	// 清楚数据
	clear();
	closeDialog();
};
// 提交
const onSubmit = (formEl: any | undefined) => {
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			closeDialog(); // 关闭弹窗
			let res = {};
			if (state.dialog.type === 'add') {
				// 把新增菜单的数据请求后端接口保存
				console.log("ruleForm",state.ruleForm)
				// 请求后端添加菜单的接口
				menuApi.addMenu(state.ruleForm).then(res => {
					if (res.data = true) {
						ElMessage.success("添加成功")
					} else {
						ElMessage.error("添加失败")
					}
					emit('refresh');
				})

			} else if (state.dialog.type === 'edit') {
				res = menuApi.editMenu(state.ruleForm).then(res => {
					if (res.data = true) {
						ElMessage.success("修改成功")
					} else {
						ElMessage.error("修改失败")
					}
					emit('refresh');
				})
			}
			nextTick(() => {
				setBackEndControlRefreshRoutes() // 刷新菜单，未进行后端接口测试

			})

		}
	});

};

// 重置表单数据
const clear = () => {
	let ruleForm = {
		menuSuperior: [], // 上级菜单
		menuType: 'menu', // 菜单类型
		name: '', // 路由名称
		component: '', // 组件路径
		componentAlias: '', // 组件路径别名
		isLink: false, // 是否外链
		sort: 0, // 菜单排序
		path: '', // 路由路径
		redirect: '', // 路由重定向，有子集 children 时
		meta: {
			title: '', // 菜单名称
			icon: '', // 菜单图标
			isHide: false, // 是否隐藏
			isKeepAlive: true, // 是否缓存
			isAffix: false, // 是否固定
			isLink: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
			isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
			roles: [], // 权限标识，取角色管理
		},
		btnPower: '', // 菜单类型为按钮时，权限标识
		apiMethods: ['GET', 'POST', 'PUT', 'DELETE'],
	}
	state.ruleForm = ruleForm
}
// 获取角色标识集合
const getRolekeys = () => {
	roleApi.getRoles().then(res => {
		// console.log(res)
		res.data.list.map((item: any) => {
			if("admin" !== item.roleKey){
				state.rolekeys.push(item)
			}
		})
	})
}

const rules = {
	meta: {
		title: [
			{ required: true, message: '请输入菜单名称', trigger: 'blur' }
		],
		roles: [
			{ required: false, message: '请选择权限标识', trigger: 'change' }
		],
	},

	name: [
		{ required: true, message: '请输入路由名称', trigger: 'blur' }
	],
	path: [
		{ required: true, message: '请输入路由路径', trigger: 'blur' }
	],
	componentAlias: [
		{ required: true, message: '请输入组件路径', trigger: 'blur' }
	],
	btnPower: [
		{ required: true, message: '请选择权限标识', trigger: 'change' }
	]
}



// 页面加载时
onMounted(() => {
	state.menuData = getMenuData(routesList.value);
	// 获取角色权限标识
	getRolekeys()
});

// 暴露变量
defineExpose({
	openDialog,
});

</script>
