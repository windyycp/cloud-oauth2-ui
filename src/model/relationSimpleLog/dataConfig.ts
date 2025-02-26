import {
    createTableOptions,
    getDict,
    getLabelInDataOptions,
    getStyleInDataOptions,
} from "/@/utils/lowcode";
import {uploadPublic} from "/@/api/file";
import {ElSwitch, ElTag} from 'element-plus';
import {reactive, ref, h, defineAsyncComponent} from 'vue';
import {fastFormDataConfig} from "/@/types/fastForm"
import {list} from "/@/api/simple/index";
import {list as loglist} from "/@/api/syslog/index";

const fileList = defineAsyncComponent(() => import('/@/components/fileList/index.vue'))
import userAvatar from '/@/assets/user_avatar.png';

const ImageList = defineAsyncComponent(() => import('/@/components/ImageList/index.vue'))
const simpleComponent = defineAsyncComponent(() => import('/@/views/simple/list/index.vue'));
const logComponent = defineAsyncComponent(() => import('/@/views/sysLog/list/index.vue'));

// 引入数据模型
import {DataModel} from "./dataModel";
import {markRaw} from "vue-demi";


// Step01: 定义公共参数
const SexOptions = ref<any>([]);
const LevelOptions = ref<any>([]);


// Step02: 定义页面数据配置
const dataConfig = (dataModel) => reactive<fastFormDataConfig[]>((dataModel).map((item) => {
    switch (item.prop) {
        case "simpleId":
            return {
                ...item,
                formOption: {
                    ...item.formOption,
                    props: {
                        DialogComponent: markRaw(simpleComponent),
                        multiple: false,
                        hideControl: true,
                        isChooseMode: true,
                        remoteMethod: list,
                        keyWord: 'name',
                    }
                },
            }

        case "logId":
            return {
                ...item,
                formOption: {
                    ...item.formOption,
                    props: {
                        DialogComponent: markRaw(logComponent),
                        multiple: false,
                        hideControl: true,
                        isChooseMode: true,
                        remoteMethod: loglist,
                        keyWord: 'id',
                    }
                },
            }


        default:
            return item
    }
}))


//Step03:  实现公共参数获取方法
const getCommonParam = () => {
    getDict("sys_user_sex").then(DictOptions => {
        SexOptions.value = DictOptions
    })

    getDict("common_level").then(DictOptions => {
        LevelOptions.value = DictOptions
    })

};


/**
 * 返回全部的DataModel
 * @param propsDataModel keys 可选，用于替换
 */
export const getAllDataConfig = (propsDataModel) => {
    getCommonParam();
    return dataConfig(propsDataModel || DataModel);
}

/**
 * 获取查询属性的DataModel
 * @param dataModel
 */
export const getQueryDataConfig = (dataModel) => {
    return reactive<any>({
        filteredDataConfig: dataModel.filter(item => item.isQueryParam)
    })
}


/**
 *  获取排除DataModelPropList的DataModel
 */
export const getModelWithout = (DataModelPropList: string[]) => {
    getCommonParam();
    return dataConfig(DataModel.filter(item => !DataModelPropList.includes(item.prop)));
}

// 获取部分model
export const getSomeDataModelConfig = (DataModelPropList: string[]) => {
    getCommonParam();
    return dataConfig(DataModel.filter(item => DataModelPropList.includes(item.prop)));
}
