import {reactive, onMounted, ref, defineAsyncComponent, h} from 'vue';
import { fastFormDataConfig} from "/@/types/fastForm"

import {DataModel} from "./dataModel";
import {getDict} from "/@/utils/lowcode";

//***** Step01: 定义公共参数 *****//
const CommonLevelOptions = ref<any>([]);


//***** Step02: 定义页面数据配置 *****//
 const dataConfig = (dataModel) =>  reactive<fastFormDataConfig[]>((dataModel).map((item) => {
  switch (item.prop) {
    // case "level":
    //   return {
    //     ...item,
    //     tableOptions: createTableOptions((row) => {
    //           return h(ElTag, {size: 'small',type: getStyleInDataOptions(CommonLevelOptions.value, row.faultLevel?.toString())}, () => getLabelInDataOptions(CommonLevelOptions.value, row.faultLevel))
    //         }
    //     ),
    //     dataOptions: CommonLevelOptions
    //   }


    default:
      return item
  }
}))


//***** Step03： 实现公共参数获取方法 *****//
const getCommonParam = () => {

    // getDictCacheByType("common_level").then((res: any) => {
    //   if (res.data != undefined && res.data != null) {
    //     CommonLevelOptions.value = res.data.sysDictDatas.map((item) => {
    //       return {
    //         label: item.dictLabel,
    //         value: item.dictValue,
    //         cssClass: item.cssClass,
    //       };
    //     });
    //   }
    // });

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

export const dataCofnigUtils = {
    getAllDataConfig,
    getQueryDataConfig,
    getModelWithout,
    getSomeDataModelConfig
}
