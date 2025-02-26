import {fastFormDataConfig} from "/@/types/fastForm";
import {FormItemType} from "/@/types/fastForm";

/**
 * 页面数据模型
 * 静态属性
 */
export const DataModel: fastFormDataConfig[] = [
    {
        label: '示例Id',
        prop: "simpleId",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: false,
        isHideTable: true,
        formOption: {
            formType: FormItemType.TABLE_SELECT,
            rules: [
                {required: true, message: "用户Id不能为空", trigger: "blur"},
            ]
        },
    },
    {
        label: '日志Id',
        prop: "logId",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: false,
        isHideTable: true,
        formOption: {
            formType: FormItemType.TABLE_SELECT,
            rules: [
                {required: true, message: "用户Id不能为空", trigger: "blur"},
            ]
        },
    },
]
