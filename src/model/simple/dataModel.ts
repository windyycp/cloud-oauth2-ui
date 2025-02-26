import {fastFormDataConfig} from "/@/types/fastForm";
import {FormItemType} from "/@/types/fastForm";

/**
 * 页面数据模型
 * 静态属性
 */
export const DataModel: fastFormDataConfig[] = [
    {
        label: '姓名',
        prop: "name",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                {required: true, message: "姓名不能为空", trigger: "blur"},
            ]
        },
    },
    {
        label: '电话',
        prop: "phone",
        isQueryParam: true,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.INPUT,
            rules: [
                {required: true, message: "电话不能为空", trigger: "blur"},
            ],
            props: {
                maxlength: 11
            }
        },
    },
    {
        label: '性别',
        prop: "sex",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.SELECT,
            rules: [
                {required: false, message: "性别不能为空", trigger: "blur"},
            ],
        },
    },
    {
        label: '出生日期',
        prop: "birthday",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.DATE,
            rules: [
                {required: false, message: "出生日期不能为空", trigger: "blur"},
            ],
        },
    },
    {
        label: '登录时间',
        prop: "loginintime",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.DATETIME,
            props: {
                format: 'YYYY-MM-DD HH:mm:ss',
            },
            rules: [
                {required: false, message: "登录时间不能为空", trigger: "blur"},
            ],
        },
    },
    {
        label: '账号开关',
        prop: "switchStatus",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.SWITCH,
            rules: [
                {required: false, message: "登录时间不能为空", trigger: "blur"},
            ],
        },
    },
    {
        label: '等级',
        prop: "level",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.RADIO,
            rules: [
                {required: false, message: "等级不能为空", trigger: "blur"},
            ],
        },
    },
    {
        label: '照片',
        prop: "photo",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        formOption: {
            formType: FormItemType.IMAGE_UPLOAD,
            rules: [
                {required: false, message: "照片不能为空", trigger: "blur"},
            ],
        },
    },
    {
        label: '附件',
        prop: "files",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        isHideTable: true,
        formOption: {
            formType: FormItemType.FILE_UPLOAD,
            rules: [
                {required: false, message: "附件不能为空", trigger: "blur"},
            ],
        },
    },
    {
        label: '关联示例',
        prop: "rsimpleId",
        isQueryParam: false,
        isCreateParam: true,
        isDetailParam: true,
        isHideTable: true,
        formOption: {
            tagLabel: "关联信息",
            formType: FormItemType.TABLE_SELECT,
            rules: [
                {required: false, message: "关联示例不能为空", trigger: "blur"},
            ],
        },
    },

]
