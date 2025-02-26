import {EpPropMergeType} from "element-plus/es/utils";
import {getDictCacheByType} from "/@/api/system/dict/type";
import {fastFormDataConfig} from "/@/types/fastForm";

/**
 * 自定义table column渲染函数
 * 精简代码用
 * @param renderFunction
 */
export function createTableOptions(renderFunction) {
    return {
        slots: {
            default: ({row}) => {
                return renderFunction(row)
            }
        }
    };
}

/**
 * 从dataOptions中获取label
 * @param dataOptions
 * @param value
 */
export const getLabelInDataOptions = (dataOptions: { value: string, label: string }[], value: string) => {
    return dataOptions?.filter((obj: { value: string, label: string }) => obj.value == String(value))?.[0]?.label;
};


/**
 * 从dataOptions中获取cssClass
 * @param dataOptions
 * @param value
 */
export const getStyleInDataOptions = (dataOptions: {
    value: string,
    cssClass: string
}[], value: string): EpPropMergeType<StringConstructor, "success" | "warning" | "info" | "danger", unknown> => {
    if (dataOptions) {
        return <EpPropMergeType<StringConstructor, "success" | "warning" | "info" | "danger", unknown>>dataOptions.filter((obj: {
            value: string,
            cssClass: string
        }) => obj.value == value)?.[0]?.cssClass;
    } else {
        return 'info'
    }
};

/**
 * 返回前端所需字典格式
 * @param sysDictData
 */
export const mapDictItemToOption = (sysDictData) => {
    return sysDictData.map((item) => {
        return {
            label: item.dictLabel,
            value: item.dictValue,
            cssClass: item.cssClass,
        };
    });
}


/**
 * 返回字典参数
 * @param dictName
 */
export const getDict = (dictName: string) => {
    return new Promise((resolve, reject) => {
        getDictCacheByType(dictName).then((res: any) => {
            if (res.data != undefined && res.data != null) {
                resolve(mapDictItemToOption(res.data.sysDictDatas))
            } else {
                reject(null)
            }
        });
    })
}


/**
 * 获取编辑属性的DataModel
 * @param dataModel
 */
export const getEditDataConfig = (dataModel: fastFormDataConfig[], infoMode: boolean): fastFormDataConfig[] => {
    return infoMode
        ? dataModel.filter(item => item.isDetailParam)
        : dataModel.filter(item => item.isCreateParam)
}

/**
 * 关闭DataModel所有的创建、查询属性
 * @param dataModel
 */
export const getDisCreateDataConfig = (dataModel: fastFormDataConfig[]): fastFormDataConfig[] => {
    return dataModel.map(item => {
        const copy = {...item};
        copy.isCreateParam = false;
        copy.isQueryParam = false;
        return copy;
    });

}

/**
 * 按tagLabel分组
 * @param filterDataConfig
 */
export const getConfigWithLabelTag = (filterDataConfig:fastFormDataConfig[]):{ [key: string]: fastFormDataConfig[] } => {
    // 按tagLabel分组
    return filterDataConfig.reduce((acc, item) => {
        const tagLabel = item.formOption.tagLabel || '基本信息';
        if (!acc[tagLabel]) {
            acc[tagLabel] = []
        }
        acc[tagLabel].push(item)
        return acc;
    }, {})
}
