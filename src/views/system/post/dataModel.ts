import {fastFormDataConfig} from "/@/types/fastForm";
import {FormItemType} from "/@/types/fastForm";

/**
 * 页面数据模型
 */
export const dataModel: fastFormDataConfig[] = [
    {
        label: '岗位名称',
        prop: "postName",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                {required: true, message: "岗位名称不能为空", trigger: "blur"},
            ]
        },
    },
    {
        label: '岗位编码',
        prop: "postCode",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                {required: true, message: "岗位编码不能为空", trigger: "blur"},
            ]
        },
    },
    {
        label: '岗位状态',
        prop: "postStatus",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.SWITCH,
            rules: [
                {required: true, message: "岗位状态不能为空", trigger: "blur"},
            ]
        },
    },
]
