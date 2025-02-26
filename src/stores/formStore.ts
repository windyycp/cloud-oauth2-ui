import {defineStore} from 'pinia';

/**
 * 表单组件选中参数，用于组件间传递
 * @methods setParamObject 设置选中的参数
 */
export const useFormStore = defineStore('formStore', {
    state: () => ({
        paramObject: {
            systemUse: undefined,
            targetDailyRevenue: undefined,
            targetMonthRevenue: undefined,
            targetDailyCharging: undefined,
            targetDailyDisCharging: undefined
        }
    }),
    actions: {
        async setParamObject(data: object) {
            this.paramObject = {...this.paramObject, ...data}
        },
        async resetParamObject(){
            for (const key in this.paramObject) {
                if (this.paramObject.hasOwnProperty(key)) {
                    this.paramObject[key] = undefined;
                }
            }
        }
    },
});
