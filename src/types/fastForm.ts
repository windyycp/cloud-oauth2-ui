import {CascaderProps} from "element-plus";

export const enum FormItemType {
    INPUT,
    SELECT,
    DATE,
    DATETIME,
    INPUT_NUMBER ,
    SWITCH,
    RADIO,
    SLIDER,
    SELECT2,
    // 级联选择器
    CASCADER,
    CITY_SELECT,
    IMAGE_UPLOAD,
    CHECK_BOX,
    MULTI_SELECT,
    // 表格展示，Dialog选择
    TABLE_SELECT,
    FILE_UPLOAD,
    // 时间选择
    TIME ,
    // 经纬度坐标
    LOCATION

}



/**
 * 通用页面数据配置
 */
export declare interface fastFormDataConfig {
    label: string,
    prop: string,

    // prop别名 用于i18n避免重名
    propAlias?: string,

    /**
     * 是否在table中隐藏
     */
    isHideTable?: boolean,

    tableOptions?: {
        /**
         * table column 自定义渲染插槽
         */
        slots?: any,
        /**
         * table中列宽
         */
        width?: string | number,

        /**
         * table最小宽度
         */
        minWidth?: string | number,

        /**
         * 禁止换行
         */
        showOverFlowTooltip?: boolean
    },

    /**
     * 是否为查询参数
     */
    isQueryParam?: boolean,

    /**
     * 是否为创建参数
     */
    isCreateParam?: boolean,


    isDetailParam?: boolean

    /**
     * 自定义样式
     * 用于form表单中
     */
    style?: any,

    /**
     * 表单配置
     */
    formOption?: {

        tagLabel?: string, // 表单tag标签
        /**
         * 表单类型
         */
        formType: FormItemType,
        /**
         * 表单校验规则
         */
        rules?: object[],

        /**
         * 是否禁止修改
         */
        disable?: boolean,

        // 提示
        tips?: string,
        /**
         * 其他配置项（根据不同类型而不同）
         */
        props?: {
            saveStore?: boolean // 选中值是否保存到store，用于其他组件作为查询条件

            /**
             * SELECT
             */
            remote?: boolean, // select 是否需要远程搜索方法
            remoteMethod?: (any) => Promise<any>, // 远程搜索方法
            keyWord?: string // 远程搜索方法的查询key和labelkey
            addOption?: {
                dataConfig?: any, // 添加选项的弹窗数据model
                addRequest?: (any) => Promise<any>, // 添加选项的弹窗添加方法
            },

            /**
             * INPUT_NUMBER
             */
            precision?: number, // 小数点位数
            max?: number,
            min?: number,
            unit?: string // 后缀单位

            /**
             * INPUT
             */
            prepend?: string, // 前置
            append?: string // 后置
            prefix?: string // 前缀
            suffix?: string // 后缀
            placeholder?: string // 提示语
            maxlength?: number // 最长长度

            type?: 'text' | 'textarea' | 'password' | 'button' | 'checkbox' | 'file' | 'number' | 'radio'


            /**
             * CASCADER 级联选择器
             */
            props?: CascaderProps,


            /**
             * TableSelect
             */
            DialogComponent?: any // dialog组件
            multiple?: boolean,
            queryParam?: string // 如有则从store中读取该key的值作为查询条件
            queryParamName?: string //  提示请先选择 queryParamName
            valueType?: 'id' | 'object' // 选择器返回值类型，object返回选中的对象数组，id返回对象数组
            dataModel?: any, // 覆盖组件的datamodel
            hideControl?: boolean,// 是否隐藏操作控件
            queryParams?: {}, // 自定义查询参数
            /**
             * DATATIME
             *
             */
            format?: string, // 指定绑定值的格式 eg："YYYY/MM/DD HH:mm:ss"

            /**
             * IMAGE_UPLOAD
             */
            limit?: number // 图片上传数量显示

            /**
             * SELECT2
             */
            numLow?: number, // 最小值
            numHigh?: number, // 最大值
            searchType?: -1 | 0, // 搜索类型 全部：-1   昨日：0  累计：1
        },

    },

    /**
     * 数据选项源
     */
    dataOptions?: { label: string, value: string, cssClass: string, disabled?: boolean }[],

}

