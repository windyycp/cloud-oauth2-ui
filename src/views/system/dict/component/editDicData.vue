<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id!=null?'修改':'添加')+'字典'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="90px">
				<el-form-item label="字典类型">
					<el-input v-model="ruleForm.dictType" :disabled="true" />
				</el-form-item>
				<el-form-item label="数据标签" prop="dictLabel">
					<el-input v-model="ruleForm.dictLabel" placeholder="请输入数据标签" />
				</el-form-item>
				<el-form-item label="数据标识" prop="dictCode">
					<el-input v-model="ruleForm.dictCode" placeholder="请输入数据标识" />
				</el-form-item>
				<el-form-item label="数据键值" prop="dictValue">
					<el-input v-model="ruleForm.dictValue" placeholder="请输入数据键值" />
				</el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
					<el-input v-model="ruleForm.cssClass" placeholder="请输入样式属性" />
				</el-form-item>
				<el-form-item label="显示排序" prop="dictSort">
					<el-input-number v-model="ruleForm.dictSort" controls-position="right" :min="0" />
				</el-form-item>

				<el-form-item label="系统默认">
					<el-switch v-model="ruleForm.isDefault"></el-switch>
				</el-form-item>
				<el-form-item label="状态">
					<el-switch v-model="ruleForm.status"></el-switch>
				</el-form-item>
				<!--  <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1" >启用</el-radio>
            <el-radio :label="0" >禁用</el-radio>
          </el-radio-group>
        </el-form-item> -->
				<el-form-item label="备注" prop="remark">
					<el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit"
						size="default">{{ruleForm.id!==0?'修 改':'添 加'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
	import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
	import { getData, addData, editData } from '/@/api/system/dict/data';
	import { ElMessage } from "element-plus";
	interface RuleFormState {
		id : number;
		dictLabel : string;
		dictValue : string;
		dictCode : string;
		dictSort : number;
    	cssClass: string;
		isDefault : boolean;
		status : boolean;
		remark : string;
		dictType : string;
	}
	interface DicState {
		isShowDialog : boolean;
		ruleForm : RuleFormState;
		rules : {}
	}

	export default defineComponent({
		name: 'systemEditDicData',
		props: {
			dictType: {
				type: String,
				default: () => ''
			}
		},
		setup(prop, { emit }) {
			const formRef = ref<HTMLElement | null>(null);
			const state = reactive<DicState>({
				isShowDialog: false,
				ruleForm: {
					id: null,
					dictLabel: '',
					dictValue: '',
					dictCode: '',
					dictSort: 0,
					isDefault: true,
					status: true,
					remark: '',
					dictType: prop.dictType
				},
				rules: {
					dictLabel: [
						{ required: true, message: "数据标签不能为空", trigger: "blur" }
					],
					dictValue: [
						{ required: true, message: "数据键值不能为空", trigger: "blur" }
					],
					dictSort: [
						{ required: true, message: "数据顺序不能为空", trigger: "blur" }
					]
				}
			});
			// 打开弹窗
			const openDialog = (row : RuleFormState | null) => {
				resetForm();
				if (row) {

					console.log(row.id)
					getData(row.id).then((res : any) => {
						state.ruleForm = res.data
					})
					// state.ruleForm = row;
				}
				state.isShowDialog = true;
			};
			const resetForm = () => {
				state.ruleForm = {
					id: null,
					dictLabel: '',
					dictValue: '',
					dictSort: 0,
					isDefault: false,
					status: true,
					remark: '',
					dictType: prop.dictType
				}
			};
			// 关闭弹窗
			const closeDialog = () => {
				state.isShowDialog = false;
			};
			// 取消
			const onCancel = () => {
				closeDialog();
			};
			// 新增
			const onSubmit = () => {
				const formWrap = unref(formRef) as any;
				if (!formWrap) return;
				formWrap.validate((valid : boolean) => {
					if (valid) {
						if (state.ruleForm.id) {
							//修改
							editData(state.ruleForm).then(() => {
								ElMessage.success('字典数据修改成功');
								closeDialog(); // 关闭弹窗
								emit('dataList')
							})
						} else {
							//添加
							addData(state.ruleForm).then(() => {
								ElMessage.success('字典数据添加成功');
								closeDialog(); // 关闭弹窗
								emit('dataList')
							})
						}
					}
				});
			};
			return {
				openDialog,
				closeDialog,
				onCancel,
				onSubmit,
				formRef,
				...toRefs(state),
			};
		},
	});
</script>