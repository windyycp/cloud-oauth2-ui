<template>
	<div class="system-dept-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="deptDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级部门">
							<el-cascader :options="state.deptData"
								:props="{ checkStrictly: true, value: 'id', label: 'deptName' }"
								placeholder="请选择部门"
								clearable
								class="w100"
								v-model="state.ruleForm.deptLevel">
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门名称">
							<el-input v-model="state.ruleForm.deptName" placeholder="请输入部门名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="负责人">
							<el-input v-model="state.ruleForm.person" placeholder="请输入负责人" clearable></el-input>
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
						<el-form-item label="排序">
							<el-input-number v-model="state.ruleForm.sort" :min="0" :max="999" controls-position="right"
								placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门状态">
							<el-switch v-model="state.ruleForm.status" inline-prompt active-text="启"
								inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="部门描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入部门描述"
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

<script setup lang="ts" name="systemDeptDialog">
import { reactive, ref, nextTick } from 'vue';
import { ElMessage, ElTree } from 'element-plus'
import { page, add, update } from "/@/api/system/dept/index";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const deptDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		deptLevel: [] as string[], // 上级部门
		deptName: '', // 部门名称
		person: '', // 负责人
		phone: '', // 手机号
		email: '', // 邮箱
		sort: 0, // 排序
		status: true, // 部门状态
		remark: '', // 部门描述
	},
	deptData: [] as DeptTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, deptData: any, row: RowDeptType) => {
	state.dialog.type = type;
	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改部门';
		state.dialog.submitTxt = '修 改';
		state.deptData = deptData;
	} else {
    console.log("row",row);
		state.ruleForm = {
      deptLevel: row.deptLevel
    };
		state.dialog.title = '新增部门';
		state.dialog.submitTxt = '新 增';
		state.deptData = deptData;
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			// deptDialogFormRef.value.resetFields();
		});
	}
	state.dialog.isShowDialog = true;
};
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
	if (state.dialog.type === 'add') {
		add(state.ruleForm).then(res => {
			if (res.data = true) {
				closeDialog();
				emit('refresh');
				ElMessage.success("新增成功")
			} else {
				ElMessage.error("新增失败: " + res.message)
			}
		});
	}
	if (state.dialog.type === 'edit') {
		update(state.ruleForm).then(res => {
			if (res.data = true) {
				closeDialog();
				emit('refresh');
				ElMessage.success("修改成功")
			} else {
				ElMessage.error("修改失败: " + res.message)
			}
		});
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
