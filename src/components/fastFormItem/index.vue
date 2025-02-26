<template>
  <div class="w100">

    <!--下拉单选-->
    <el-select ref="selectRef" v-if="formItem.formOption.formType === FormItemType.SELECT && !infoMode"
               v-model="value"
               filterable
               :remote="true"
               :placeholder="formItem.formOption.props?.remoteMethod?$t('message.formI18nPlaceholder.select_search'):$t('message.formI18nPlaceholder.select_search')"
               :loading="selectSearchLoading"
               :remote-method="remoteMethod"
               remote-show-suffix
               clearable
               @change="onSelectChange(formItem['prop'])"
               :suffix-icon="CaretBottom"
               size="small"
               :disabled="formItem.formOption.disable"
    >
      <el-option v-for="optionItem in formItem.dataOptions"
                 :key="optionItem.value"
                 :label="optionItem.label"
                 :value="optionItem.value"/>
      <el-option v-if="formItem.dataOptions?.length===0" disabled>
        <el-button text bg size="small" @click="onAddOption">
          + {{ $t('message.formI18nPlaceholder.select_addoption') }}
        </el-button>
      </el-option>
      <template v-if="formItem.dataOptions?.length!== 0 && formItem.formOption.props?.addOption?.dataConfig" #footer>
        <el-button text bg size="small" @click="onAddOption">
          + {{ $t('message.formI18nPlaceholder.select_addoption') }}
        </el-button>
      </template>

    </el-select>

    <!-- 双选框 -->
    <div v-else-if="formItem.formOption.formType == FormItemType.SELECT2" :disabled="infoMode">
      <div class="flex">
        <el-input-number
            v-model="formItem.formOption.props.numLow"
            :min="0"
            :max="formItem.formOption.props.numHigh"
            :style="{width: '80px'}"
            size="small"
            controls-position="right"
            value-on-clear="0"
        />
        <div>——</div>
        <el-input-number
            v-model="formItem.formOption.props.numHigh"
            :min="formItem.formOption.props.numLow"
            :max="100"
            :style="{width: '80px'}"

            size="small"
            controls-position="right"
            value-on-clear="100"
        />
        <el-button class="ml5" v-model="formItem.formOption.props.searchType" @click="changeSearchDatatype">仅昨日
        </el-button>
      </div>

    </div>


    <!-- 选项添加对话框 -->
    <EditDialog
        v-if="formItem.formOption.formType === FormItemType.SELECT && !infoMode && formItem.formOption.props?.addOption?.dataConfig"
        ref="editRefAdd" :dataConfig="formItem.formOption.props.addOption.dataConfig"
        @add="addOptionAddRequest"></EditDialog>


    <!-- 详情模式下，用el-tag替代el-select-->
    <el-tag v-if="formItem.formOption.formType === FormItemType.SELECT && infoMode"
            :type="getStyleInDataOptions(props.formItem.dataOptions,value)">
      {{ value !== null ? getLabelInDataOptions(props.formItem.dataOptions, value || 0) : '-' }}
    </el-tag>


    <!-- 日期选择 -->
    <el-date-picker v-else-if="formItem.formOption.formType == FormItemType.DATE && !infoMode"
                    v-model="value" type="date"
                    :placeholder="$t('message.formI18nPlaceholder.data')"
                    :disabled="infoMode"
                    :value-format="formItem.formOption.props?.format"
    />

    <div v-else-if="formItem.formOption.formType == FormItemType.DATE && infoMode">
      -
    </div>

    <!-- 日期时间-->
    <el-date-picker
        v-else-if="formItem.formOption.formType == FormItemType.DATETIME && !infoMode"
        v-model="value"
        type="datetime"
        :placeholder="infoMode ? '-' : $t('message.formI18nPlaceholder.data_time')"
        :value-format="formItem.formOption.props?.format || ''"
        :disabled="infoMode"
    />

    <div v-else-if="formItem.formOption.formType == FormItemType.DATETIME && infoMode">
      -
    </div>
    <!-- 时间选择-->
    <el-time-picker v-else-if="formItem.formOption.formType == FormItemType.TIME"
                    v-model="value" :placeholder="$t('message.formI18nPlaceholder.time')"
                    :disabled="infoMode" value-format="HH:mm:ss"
    />


    <!--数字输入框-->
    <div v-else-if="formItem.formOption.formType == FormItemType.INPUT_NUMBER">
      <el-input-number v-model="value"
                       :precision="formItem.formOption.props.precision"
                       :disabled="infoMode"
                       :controls="!infoMode"
                       controls-position="right"
                       :placeholder="infoMode?'-':''"
                       size="small"
                       :min="formItem.formOption.props.min"
                       :max="formItem.formOption.props.max">
      </el-input-number>
      {{ formItem?.formOption.props.unit }}
    </div>

    <!--地图坐标器-->
    <div v-else-if="formItem.formOption.formType == FormItemType.LOCATION">
      <el-tag v-model="value" v-if="value">{{ JSON.parse(value).lng + ',' + JSON.parse(value).lat }}</el-tag>
      <el-tag v-else>-</el-tag>
      <el-button v-if="!infoMode" class="ml4" type="success" plain size="small" @click="getLocation">
        <el-icon>
          <MapLocation/>
        </el-icon>
        地图选择
      </el-button>
    </div>

    <!-- 开关 -->
    <div v-else-if="formItem.formOption.formType == FormItemType.SWITCH" :disabled="infoMode">
      <el-switch v-model="value" :disabled="infoMode"/>
    </div>

    <!--输入框-->
    <el-input v-else-if="formItem.formOption.formType == FormItemType.INPUT"
              v-model="value"
              :placeholder="infoMode ? '-' : (formItem.formOption.props?.placeholder ||  $t('message.formI18nPlaceholder.input') )"
              clearable
              :type="formItem.formOption?.props?.type"
              @keyup.enter.native="$emit('handleQuery')"
              :disabled="infoMode"
              size="small"
              :maxlength="formItem.formOption.props?.maxlength||200"
    >
      <template v-if="formItem.formOption?.props?.prepend" #prepend>{{ formItem.formOption?.props?.prepend }}</template>
      <template v-if="formItem.formOption?.props?.append" #append>{{ formItem.formOption?.props?.append }}</template>
      <template v-if="formItem.formOption?.props?.prefix" #prefix>{{ formItem.formOption?.props?.prefix }}</template>
      <template v-if="formItem.formOption?.props?.suffix" #suffix>{{ formItem.formOption?.props?.suffix }}</template>
    </el-input>

    <!--单选框-->
    <el-radio-group v-else-if="formItem.formOption.formType == FormItemType.RADIO && !infoMode" v-model="value"
                    @change="onRadioChange" size="small">
      <el-radio-button v-for="optionItem in formItem.dataOptions"
                       :key="optionItem.value"
                       :label="optionItem.value"
                       :disabled="infoMode"

      >
        {{ optionItem.label }}
      </el-radio-button>
    </el-radio-group>

    <!-- 详情模式下，用el-tag替代el-radio-->
    <el-tag v-else-if="formItem.formOption.formType === FormItemType.RADIO && infoMode" effect="plain" class="mr4">
      <!--{{ // getCheckboxLabels(formItem.dataOptions)[0]?.label || '-' }}-->
      {{ getLabelInDataOptions(formItem.dataOptions, value) || '-' }}
    </el-tag>

    <!---级连选择器-->
    <el-cascader v-else-if="formItem.formOption.formType == FormItemType.CASCADER"
                 :props="formItem.formOption.props.props" v-model="value" :options="formItem.dataOptions"/>

    <!---城市选择器-->
    <el-cascader ref="citycascaderRef" v-else-if="formItem.formOption.formType == FormItemType.CITY_SELECT"
                 @change="handleCityChange" :props="cityProps" v-model="value" :disabled="infoMode"
                 :suffix-icon="CaretBottom" clearable
    ></el-cascader>

    <!---多选框-->
    <el-checkbox-group v-else-if="formItem.formOption.formType == FormItemType.CHECK_BOX && !infoMode" v-model="value">
      <el-checkbox class="mb10" v-for="optionItem in formItem.dataOptions"
                   :key="optionItem.value"
                   :label="optionItem.value"
                   :value="optionItem.value"
                   border
                   v-show="!optionItem.disabled"
      >
        {{ optionItem.label }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 详情模式下，用el-tag替代el-checkbox-->
    <el-tag v-else-if="formItem.formOption.formType === FormItemType.CHECK_BOX && infoMode"
            v-for="optionItem in getCheckboxLabels(formItem.dataOptions)" v-bind:key="optionItem.value"
            effect="plain"
            class="mr4"
    >
      {{ optionItem.label }}
    </el-tag>

    <!--下拉多选-->
    <el-select v-if="formItem.formOption.formType === FormItemType.MULTI_SELECT && !infoMode"
               v-model="value"
               filterable
               :remote="true"
               :loading="selectSearchLoading"
               :remote-method="remoteMethod"
               remote-show-suffix
               multiple
               style="width: 100%"
               :suffix-icon="CaretBottom"

    >
      <el-option v-for="optionItem in formItem.dataOptions"
                 :key="optionItem.value"
                 :label="optionItem.label"
                 :value="optionItem.value"
      />

    </el-select>


    <!-- 详情模式下，用el-tag替代el-MULTI_SELECT-->
    <!--    <el-tag v-else-if="formItem.formOption.formType === FormItemType.MULTI_SELECT && infoMode"-->
    <!--            v-for="(optionItem,index) in getCheckboxLabels(formItem.dataOptions)"-->
    <!--            effect="plain"-->
    <!--            class="mr4"-->
    <!--            :key="index"-->
    <!--    >-->

    <!--    </el-tag>-->

    <el-tag v-else-if="formItem.formOption.formType === FormItemType.MULTI_SELECT && infoMode"
            :type="getStyleInDataOptions(props.formItem.dataOptions,value)">
      {{ value ? getLabelInDataOptions(props.formItem.dataOptions, value || 0) : '-' }}
    </el-tag>


    <!-- 表格选择器 -->
    <div v-else-if="formItem.formOption.formType == FormItemType.TABLE_SELECT">
      <div :class="infoMode?  'tableSelectInfoMode': 'tableSelectEditMode'">
        <div class="flex flex-v-center w100 flex-warp " @click="handleTableSelectButton">
          <el-tag class="mr10 mt2 mb2" v-for="(item,index) in state.tableSelectShowData" :closable="!infoMode"
                  :key="index"
                  @close="handleTableSelectTagClose(index)">
            {{ item[formItem.formOption.props.keyWord] || item['description'] }}
          </el-tag>

          <div v-if="state.tableSelectShowData.length==0&&!infoMode"
               class="ml8 tableSelect_placehoder">{{ $t('message.formI18nPlaceholder.table_select') }}
          </div>

        </div>
        <el-icon v-if="!infoMode">
          <CaretBottom/>
        </el-icon>
      </div>
    </div>

    <!-- 表格选择器弹窗选择 -->
    <el-dialog v-if="formItem.formOption.formType == FormItemType.TABLE_SELECT" v-model="dialogTableVisible"
               title="请选择" draggable
               width="80%">
      <component ref="dialogTableRef"
                 :is="formItem.formOption.props.DialogComponent"
                 :dataModel="formItem.formOption.props.dataModel"
                 :hideControl="formItem.formOption.props.hideControl"
                 :isChooseMode="true"
                 :isSingleSelect="!formItem.formOption.props.multiple"
                 :queryParam="tableSelectDialogParam"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button
              @click="dialogTableVisible = false">{{ $t('message.formI18n.table_select_but_cancel') }}</el-button>
          <el-button type="primary" @click="handleTableDialogSummit">
            {{ $t('message.formI18n.table_select_but_add') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片预览上传组件-->
    <div v-else-if="formItem.formOption.formType == FormItemType.IMAGE_UPLOAD">
      <!-- 需要有div控件来放value，出发computer的get方法，同步value给fileList-->
      <el-image v-show="infoMode" v-for="(item, index) in value"
                :key="index"
                :src="item"
                fit="cover"
                :preview-src-list="value"
                class="mr4"
                :initial-index="index"
                style="width:80px"
      />


      <div v-show="infoMode&&(value?.length==0||!value)" style="color: #c8c9cc; display: flex; align-items: center"
           class="flex-v-center">
        <el-icon class="mr4">
          <PictureFilled/>
        </el-icon>
        {{ $t('message.upload.empty_tips') }}
      </div>

      <el-upload v-show="!infoMode"
                 v-model:file-list="fileList" action="#"
                 :on-change="handleImageUploadChange"
                 :on-remove="handleImageRemove"
                 :on-preview="handlePictureCardPreview"
                 :auto-upload="false"
                 list-type="picture-card"
                 :limit="formItem.formOption.props.limit"
      >
        <el-icon :size="30">
          <UploadFilled/>
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible" modal-append-to-body>
        <el-image class="w100" :src="dialogImageUrl" fit="contain"/>
      </el-dialog>
    </div>


    <!-- 文件上传组件-->
    <div v-else-if="formItem.formOption.formType==FormItemType.FILE_UPLOAD">
      <!-- 需要有div控件来放value，出发computer的get方法，同步value给fileList-->
      <div v-show="infoMode" v-for="(item,index) in value" :key="index">
        <el-icon>
          <Memo/>
        </el-icon>
        {{ item.name }}
        <el-button @click="handleFileOpenClick(item)" type="primary">{{ $t('message.table.but_info') }}</el-button>
      </div>


      <el-upload
          v-show="!infoMode"
          v-model:file-list="fileList"
          action="#"
          :on-change="handleFileUploadChange"
          :on-remove="handleFileRemove"
          :limit="10"
          :auto-upload="false"
      >
        <el-button type="primary">{{ $t('message.formI18n.file_upload_but') }}</el-button>
        <template #tip>
          <div>{{ $t('message.formI18n.file_upload_alarm') }}</div>
        </template>
      </el-upload>


    </div>

    <!--tip-->
    <div v-if="formItem.formOption.tips" class="flex flex-v-center">
      <el-icon style="color: #dadada;margin-right: 4px">
        <Warning/>
      </el-icon>
      <span style="font-size: 12px;color: #b1b3b8"> {{ formItem.formOption.tips }}</span>
    </div>

    <!--地图坐标选择器-->
    <LocationDialog ref="locationRef" @updateLocation="updateLocation"></LocationDialog>


  </div>
</template>

<script setup lang="ts">

/**
 * Form Item生成式组件，根据给定的配置生成表单项
 */
import {FormItemType} from "/@/types/fastForm";
import {computed, defineAsyncComponent, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {getLabelInDataOptions, getStyleInDataOptions} from "/@/utils/lowcode";
import {getByParentId} from "/@/api/area";
import type {UploadProps} from 'element-plus'
import {UploadFilled, Memo, ArrowDown, PictureFilled, MapLocation, CaretBottom, Warning} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import EditDialog from '/@/components/editDialog/index.vue'
import {useI18n} from 'vue-i18n';
import {useFormStore} from "/@/stores/formStore";
import {fastFormDataConfig} from "/@/types/fastForm";


const formStore = useFormStore()

const editRefAdd = ref()
const selectRef = ref()

const {t} = useI18n();

//双选框
const numLow = ref(0);
const numHigh = ref(100);
const searchType = ref(-1);

// 坐标选择器
const locationRef = ref()
const LocationDialog = defineAsyncComponent(() => import('/@/components/LocationDialog/index.vue'));

// 定义接收的props，并指定类型
const props = defineProps<{
  prop?: string,
  formItem: fastFormDataConfig,
  modelValue: string | number | any[] | undefined,
  infoMode?: Boolean,
  size?: string
}>();

const fileList = ref([]) // 图片上传器的文件缓存


/**
 * 更新回显值
 * @param ids
 */
const updateTableSelectShowValue = (ids: string[] | string | object []) => {
  if (ids !== null && ids !== undefined && ids?.length !== 0) {
    if (props.formItem.formOption.props?.remoteMethod) {
      // 参数提供查询方法
      props.formItem.formOption.props.remoteMethod({
        page: 1,
        pageSize: 9999,
        id: JSON.stringify(ids),
        ...(props.formItem.formOption.props?.queryParams || {}),
      }).then(res => {
        state.tableSelectShowData = res.data
      });
    } else if (props.formItem.formOption.props.valueType === 'object') {
      state.tableSelectShowData = ids as any[]
      state.tableSelectShowLabel = "已选择" + ids.length + "个参数"
    }
  }
}


watch(() => props.infoMode, (newValue, oldValue) => {
  if (newValue) {
    if (props.formItem.formOption.formType === FormItemType.TABLE_SELECT) {
      console.log('watch table')
      if (props.formItem.formOption.props.multiple) {
        updateTableSelectShowValue(props.modelValue as any[])
      } else {
        updateTableSelectShowValue(props.modelValue as string)
      }
    } else if (props.formItem.formOption.formType === FormItemType.IMAGE_UPLOAD) {
      if (props.modelValue) {
        const imgValue = typeof props.modelValue === 'string' ? JSON.parse(props.modelValue) : props.modelValue
        fileList.value = imgValue.map((item, index) => {
          return {
            url: item
          }
        })
      }
    }
  }
})

const selectSearchLoading = ref(false)

const emit = defineEmits(['update:modelValue', 'handleQuery', 'updateCityLabelArray', 'selectChange'])


const value = computed({
  get() {
    if (props.formItem.formOption.formType === FormItemType.CITY_SELECT && typeof props.modelValue === "string") {
      return JSON.parse(props.modelValue)
    } else if (props.formItem.formOption.formType === FormItemType.SELECT2 && typeof props.modelValue === "string") {
      return JSON.parse(props.modelValue)
    } else if (props.formItem.formOption.formType === FormItemType.CHECK_BOX) {
      return (props.modelValue === null || props.modelValue === undefined) ? [] : JSON.parse(props.modelValue as string)
    } else if (props.formItem.formOption.formType === FormItemType.MULTI_SELECT) {
      return (props.modelValue === null || props.modelValue === undefined) ? [] : props.modelValue
    } else if (props.formItem.formOption.formType === FormItemType.IMAGE_UPLOAD) {
      // 图片上传控件，将value和fileList分开，获取到的value同步给控件的fileList
      if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') {
        return props.modelValue
      } else {
        const imgValue = typeof props.modelValue === 'string' ? JSON.parse(props.modelValue) : props.modelValue
        return typeof props.modelValue === 'string' ? JSON.parse(props.modelValue) : props.modelValue
      }
    } else if (props.formItem.formOption.formType === FormItemType.FILE_UPLOAD) {
      // 文件上传控件，将value和fileList分开，获取到的value同步给控件的fileList
      if (props.modelValue === null || props.modelValue === undefined) {
        return props.modelValue
      } else {
        return typeof props.modelValue === 'string' ? JSON.parse(props.modelValue) : props.modelValue
      }
    } else if (props.formItem.formOption.formType === FormItemType.TABLE_SELECT) {
      if (props.formItem.formOption.props.multiple) {
        return (props.modelValue === null || props.modelValue === undefined) ? [] : props.modelValue
      } else {
        return (props.modelValue === null || props.modelValue === undefined) ? '' : props.modelValue
      }
    } else {
      return props.modelValue
    }
  },
  set(value) {
    if (props.formItem.formOption.formType === FormItemType.SELECT) {
      emit('update:modelValue', value)
    } else if (props.formItem.formOption.formType === FormItemType.CITY_SELECT) {
      emit('update:modelValue', JSON.stringify(value || undefined))
    } else if (props.formItem.formOption.formType === FormItemType.SELECT2) {
      emit('update:modelValue', JSON.stringify(value))
    } else if (props.formItem.formOption.formType === FormItemType.CHECK_BOX) {
      emit('update:modelValue', JSON.stringify(value || []))
    } else if (props.formItem.formOption.formType === FormItemType.MULTI_SELECT) {
      emit('update:modelValue', value || [])
    } else if (props.formItem.formOption.formType === FormItemType.TABLE_SELECT) {
      console.log('table_select set:', value)
      if (props.formItem.formOption.props.multiple) {
        emit('update:modelValue', value || [])
        updateTableSelectShowValue(value as any[])
      } else {
        emit('update:modelValue', value)
        updateTableSelectShowValue(value as string)
      }
    } else {
      if (props.formItem.formOption?.props?.saveStore) {
        console.log('store缓存选项', {[props.formItem['prop']]: value})
        formStore.setParamObject({[props.formItem['prop']]: value})
      }
      emit('update:modelValue', value)
    }
  }
})


// 详情模式下,el-tag的值
const state = reactive({
  label: "",
  cssClass: "",
  tableSelectShowData: [],
  tableSelectShowLabel: ''
})


// 加载完
onMounted(() => {
  // select时，默认先获取参数options
  if (props.formItem.formOption.formType === FormItemType.SELECT || props.formItem.formOption.formType === FormItemType.MULTI_SELECT) {
    if (props.formItem.formOption.props?.remoteMethod) {
      // 赋予默认值
      remoteMethod('', props.modelValue as string);
    } else {
      state.label = getLabelInDataOptions(props.formItem.dataOptions, props.modelValue as string)
    }
  } else if (props.formItem.formOption.formType === FormItemType.TABLE_SELECT) {
    console.log('onMounted', props.modelValue)
    if (props.formItem.formOption.props.multiple) {
      updateTableSelectShowValue(props.modelValue as any[])
    } else {
      updateTableSelectShowValue(props.modelValue as string)
    }
  } else if (props.formItem.formOption.formType === FormItemType.TIME) {
    if (props.modelValue === undefined || props.modelValue === null)
      emit('update:modelValue', "00:00:00")
  }
  fileList.value = []
  // state.tableSelectShowData = []
})


/**
 * Radio Change事件
 * 如需保存到store，则更新
 * @param value
 */
const onRadioChange = (value) => {
  console.log("RadioChange", value)
  if (props.formItem.formOption?.props?.saveStore) {
    formStore.paramObject[props.formItem['prop']] = props.modelValue
  }
}

/**
 * 从checkbox的options中提取value的label
 * @param dataOptions
 */
const getCheckboxLabels = (dataOptions) => {
  if (dataOptions && props.modelValue !== null && props.modelValue !== undefined) {
    return dataOptions.filter(item => (props.modelValue as string[]).includes(item.value))
  } else {
    return []
  }
}


// select 的远程搜索方法
const remoteMethod = (query: string, id: string | string[]) => {
  // const queryParams = params || props.formItem.formOption.props?.params || {}
  if (props.formItem.formOption.props?.remoteMethod) {
    // 参数提供查询方法
    props.formItem.formOption.props.remoteMethod({
      page: 1,
      pageSize: id ? 9999 : 10,
      [props.formItem.formOption.props!.keyWord]: query,
      id: id ? JSON.stringify(id) : id,
      ...(props.formItem.formOption.props?.queryParams || {})
    }).then(res => {
      props.formItem!.dataOptions = res.data.map((item) => {
        return {
          value: item.id,
          label: item[props.formItem.formOption.props!.keyWord],
        }
      })

      // 非编辑模式下用于给elTag之类的控件赋值
      state.label = getLabelInDataOptions(props.formItem.dataOptions, props.modelValue as string)
    });

  }
}


// 城市选择器参数
let parentId = -1
const cityProps =
    {
      lazy: true,
      emitPath: true,
      value: "areaId",
      label: 'areaName',
      lazyLoad(node, resolve) {
        const {level, value} = node
        if (value) {
          parentId = value
        }
        getByParentId({parentId: parentId}).then(res => {
          const nodes = res.data.map((item) => ({
            ...item,
            leaf: level >= 2,
          }))
          resolve(nodes)
        })
      }
    }


const citycascaderRef = ref()
// 如需提交城市label数组，则将值传给父组件进行接受设置
const handleCityChange = (value: any) => {
  // 将选中的城市label返回给父组件
  if (citycascaderRef.value.getCheckedNodes().length > 0)
    emit('updateCityLabelArray', citycascaderRef.value.getCheckedNodes()[0].pathLabels)
}


// 图片选择器
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleImageUploadChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  if (props.formItem.formOption.props?.remoteMethod) {
    let formData = new FormData();
    formData.append('file', uploadFile.raw);
    props.formItem.formOption.props.remoteMethod(formData).then(res => {
      // 移除fileList最后一个对象(upload会自动往fileList增加一个blob的图片对象，需移除掉)
      if (fileList.value.length > 0) {
        fileList.value.pop()
      }
      fileList.value.push({"url": res.data.fileUrl})
      // 将得到的url放到value中
      emit('update:modelValue', JSON.stringify(fileList.value.map(item => item.url)))
    });
  }
}
const handleImageRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  // 同步移除modelValue的url
  // TODO: 调用删除接口
  emit('update:modelValue', JSON.stringify(fileList.value.map(item => item.url)))

}


const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}


// 文件上传相关方法
const handleFileUploadChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  if (props.formItem.formOption.props?.remoteMethod) {
    let formData = new FormData();
    formData.append('file', uploadFile.raw);
    props.formItem.formOption.props.remoteMethod(formData).then(res => {
      // 移除fileList最后一个对象(upload会自动往fileList增加一个blob的图片对象，需移除掉)
      if (fileList.value.length > 0) {
        fileList.value.pop()
      }
      // 获取文件名
      fileList.value.push({"url": res.data.fileUrl, "name": uploadFile.name, "size": uploadFile.size})
      // 将得到的url放到value中
      emit('update:modelValue', JSON.stringify(fileList.value))
    }).catch(error => {
      // 上传失败提示
      ElMessage.error('文件上传失败,请检查文件大小是否超出限制')
      if (fileList.value.length > 0) {
        fileList.value.pop()
      }

    });
  }
}

const handleFileRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  // 同步移除modelValue的url
  // TODO: 调用删除接口
  emit('update:modelValue', JSON.stringify(uploadFiles))
}


/**
 * 文件打开按钮事件
 */
const handleFileOpenClick = (item: any) => {
  window.open(item.url)
}

const dialogTableVisible = ref(false)


// const tableSelectShowData = ref([]) // 表格选择器的value回显值变量
const tableSelectDialogParam = ref("")

const dialogTableRef = ref()

/**
 * 表格展示器选择按钮事件
 */
const handleTableSelectButton = () => {
  if (!props.infoMode) {
    //  判断是否需要查询参数，如需要则从store中读取
    if (props.formItem.formOption.props.queryParam) {
      // 判断store中是否有该值，如无则提示错误
      if (formStore.paramObject[props.formItem.formOption.props.queryParam]) {
        dialogTableVisible.value = true
        // 读取pinia的store
        tableSelectDialogParam.value = formStore.paramObject[props.formItem.formOption.props.queryParam]
      } else {
        // ElMessage.error('请选择前置条件')
        ElMessage.error(t('message.formI18n.table_select_but_tag') + props.formItem.formOption.props?.queryParamName)
      }
    } else {
      dialogTableVisible.value = true
    }
  }
}

/**
 * 表格选择器Dialog确认事件
 *
 */
const handleTableDialogSummit = () => {

  // 加个tid属性
  const preSelectRows = dialogTableRef.value.selectRows.map(item => ({tid: item.id, ...item}))
  // const idsArray = preSelectRows.map(item => item.tid)

  console.log('preSelectRows', preSelectRows)

  // 判断是否为单选模式，如果单选模式选择多个则提示错误
  if (!props.formItem.formOption.props.multiple && preSelectRows.length > 1) {
    ElMessage.error(t('message.formI18n.table_dialog_tag'))
    return
  }

  if (props.formItem.formOption.props.multiple) {
    // 多选模式
    let allRows = []
    if (props.modelValue === undefined || props.modelValue === null) {
      // 首次赋值
      allRows = preSelectRows
    } else {
      // 添加赋值
      if (typeof props.modelValue === 'string') {
        allRows = (JSON.parse(props.modelValue as string)).concat(preSelectRows)
      } else {
        allRows = (props.modelValue as [any]).concat(preSelectRows)
      }
    }


    // 去重
    const newTableRows = allRows.reduce((acc, current) => {
      let existingItemIndex = acc.findIndex(item => item.id === current.id)
      if (existingItemIndex === -1) {
        acc.push(current)
      }
      return acc
    }, [])


    if (props.formItem.formOption.props.valueType === 'object') {
      emit('update:modelValue', newTableRows)
      updateTableSelectShowValue(newTableRows)
    } else {
      const idsArray = newTableRows.map(item => item.tid)
      emit('update:modelValue', idsArray)
      updateTableSelectShowValue(idsArray)
    }

  } else {
    // 单选模式，返回object
    if (props.formItem.formOption.props.valueType === 'object') {
      emit('update:modelValue', preSelectRows[0])
      updateTableSelectShowValue(preSelectRows)
    } else {
      // 单选模式，只返回id
      const idsArray = preSelectRows.map(item => item.tid)
      emit('update:modelValue', idsArray[0])
      updateTableSelectShowValue(idsArray[0])
    }

  }

  dialogTableVisible.value = false

}


const handleTableSelectTagClose = (index: number) => {
  if (index !== null) {
    if (props.formItem.formOption.props.multiple) {
      let valueList = (props.modelValue as any[]).slice()
      valueList.splice(index, 1)
      emit('update:modelValue', valueList)
      state.tableSelectShowData.splice(index, 1)
    } else {
      emit('update:modelValue', "")
      state.tableSelectShowData.splice(index, 1)
    }
  } else {
    emit('update:modelValue', [])
    state.tableSelectShowData = []
    state.tableSelectShowLabel = ''
  }

}

/**
 * select添加选项
 */
const onAddOption = (propName: string) => {
  // 回调给父组件
  // emit('addOption',propName)
  selectRef.value.blur()
  editRefAdd.value.handleAdd();
}

const addOptionAddRequest = (query: any) => {
  if (props.formItem.formOption.props?.addOption.addRequest) {
    props.formItem.formOption.props?.addOption.addRequest(query).then(res => {
      ElMessage.success(t('message.formI18n.add_success'))
      editRefAdd.value.handleClose();
      // 重新搜索加载options
      if (props.formItem.formOption.props?.remoteMethod) {
        // 赋予默认值
        remoteMethod('', props.modelValue as string);
      } else {
        state.label = getLabelInDataOptions(props.formItem.dataOptions, props.modelValue as string)
      }
    })
  }
}


const onSelectChange = (prop: any) => {
  if (props.formItem.formOption?.props?.saveStore) {
    console.log('store缓存选项', {[props.formItem['prop']]: value})
    formStore.setParamObject({[props.formItem['prop']]: value})
  }
  emit('selectChange', prop, props.modelValue)
}

// 显示地图坐标拾取弹窗
const getLocation = () => {
  locationRef.value.handleInfo()
}

const updateLocation = (location) => {
  // emit('update:modelValue', location)
  emit('update:modelValue', JSON.stringify(location))
  // emit('updateLocation', location)
}

// 双选框方法
const changeSearchDatatype = () => {
  // 切换搜索类型
  if (searchType.value === -1) {
    // 当前是全部，切换到昨日
    searchType.value = 0;
  } else {
    // 当前是昨日，切换回全部
    searchType.value = -1;
  }

  // 根据搜索类型更新 numLow 和 numHigh 的值
  if (searchType.value === 0) {
    // 如果是昨日搜索，可能需要设置特定的日期范围
    // 这里只是一个示例，实际逻辑可能需要从服务器获取昨日日期
    // 并更新 numLow 和 numHigh
    // 假设昨日的数据范围总是从 1 到 100
    numLow.value = 1;
    numHigh.value = 100;
  } else {
    // 如果是全部搜索，可以重置 numLow 和 numHigh 到它们的最大值范围
    numLow.value = 0;
    numHigh.value = 100;
  }

  // 在这里可以调用其他方法，比如重新加载数据等
};

</script>

<style scoped>
:deep(.el-upload--picture-card) {
  width: 80px;
  height: 80px;
}

:deep(.el-upload) {
  width: 80px;
  height: 80px;
  line-height: 80px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 80px;
  height: 80px;
  line-height: 80px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
  width: 80px;
  height: 80px;
  line-height: 80px;
}

:deep(.avatar) {
  width: 80px;
  height: 80px;
}

.tableSelectEditMode {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  min-height: 32px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
}

.tableSelectInfoMode {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  padding-left: 6px;
  border-bottom-width: 0px;
  border-style: solid;
  border-top-width: 0px;
  border-right-width: 0px;
  border-left-width: 0px;
  border-radius: 0px;
  border-color: rgb(234, 234, 234);
  height: 32px;
}

.tableSelect_placehoder {
  color: var(--el-text-color-placeholder);
  font-size: inherit;
}
</style>
