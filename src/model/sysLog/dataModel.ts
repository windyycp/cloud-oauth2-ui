import { fastFormDataConfig} from "/@/types/fastForm";
import { FormItemType } from "/@/types/fastForm";

/**
 * 页面数据模型
 */
export const DataModel: fastFormDataConfig[] = [
    {
        label: 'ID',
        prop: "id",
        tableOptions: {
            width: 90,
        },
    },
    {
        label: 'IP',
        prop: "ip",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                { required: false, message: "IP不能为空", trigger: "blur" },
            ]
        },
    },
    //  {
    //     label: '服务名称',
    //     prop: "service",
    //     isQueryParam: true,
    //     isCreateParam: true,
    //     isDetailParam: true,
    //     formOption: {
    //         formType: FormItemType.INPUT,
    //         rules: [
    //             {required: false, message: "服务名称不能为空", trigger: "blur"},
    //         ]
    //     },
    // },
    {
        label: '方法名称',
        prop: "method",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                { required: false, message: "方法名称不能为空", trigger: "blur" },
            ]
        },
    },
    {
        label: '请求路径',
        prop: "path",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                { required: false, message: "请求路径不能为空", trigger: "blur" },
            ]
        },
    },

    {
        label: '请求参数',
        prop: "param",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        tableOptions: {
            width: 300,
            showOverFlowTooltip: true,
        },
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                { required: false, message: "请求参数不能为空", trigger: "blur" },
            ]
        },
    },
    {
        label: '实体ID',
        prop: "beanId",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.SELECT,
            rules: [
                { required: false, message: "实体ID不能为空", trigger: "blur" },
            ]
        },
    },
    {
        label: '操作表名',
        prop: "tableName",
        propAlias: 'operationTable',
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
        },
    },
    {
        label: '操作方法',
        prop: "beanOperation",
        propAlias: 'operationMethod',
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
        },
    },
    {
        label: '数据变更',
        prop: "result",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        tableOptions:{
            showOverFlowTooltip: true
        },
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                { required: false, message: "数据变更不能为空", trigger: "blur" },
            ]
        },
    },
    {
        label: '操作人',
        propAlias:'operationName',
        prop: "nickName",
    },
    {
        label: '操作时间',
        propAlias:'operationTime',
        prop: "createAt",
    },
    {
        label: '备注',
        prop: "remark",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                { required: false, message: "备注不能为空", trigger: "blur" },
            ]
        },
    },

]
