<template>
  <div class="mb4 flex flex-h-between">
    <div>
      {{$t("message.map.key_word")}}
      <el-select
          v-model="state.searchKey"
          filterable
          remote
          reserve-keyword
          :remote-method="remoteMethod"
          style="width: 240px"
          size="small"
          @change="changeSelect"
      >
        <el-option
            v-for="(item,index) in state.options"
            :key="item.id"
            :label="item.name"
            :value="index"
        />
      </el-select>
    </div>

    <div>
      {{$t("message.map.lng")}}
      <el-input v-model="state.pointLng" disabled style="width: 80px" size="small"/>
      {{$t("message.map.lat")}}
      <el-input v-model="state.pointLat" disabled style="width: 80px" size="small"/>
    </div>

  </div>

  <div id="container"></div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, reactive} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

// 忽略报错，有用
window._AMapSecurityConfig = {
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_JS_CODE,
}

let map = null;
const key = import.meta.env.VITE_AMAP_KEY;

let autoComplete = null;
let placeSearch = null;

// 定义变量
const state = reactive<any>({
  center: [116.397428, 39.90923],
  pointLng: null, // 选中点经度
  pointLat: null, // 选中点纬度
  marker: null,
  getcoder: null,
  searchKey: '',
  auto: null,
  placeSearch: null,
  options: []
})

const emit = defineEmits(['updateLng', 'updateLat'])

onMounted(() => {
  AMapLoader.load({
    key: key, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale", "AMap.PlaceSearch", "AMap.Geocoder", "AMap.Marker", "AMap.AutoComplete"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
      .then((AMap) => {
        map = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "2D", // 是否为3D地图模式
          zoom: 11, // 初始化地图级别
          center: state.center, // 初始化地图中心点位置
        });

        // 监听地图点击事件
        map.on("click", (e) => {
          state.pointLng = e.lnglat.lng
          state.pointLat = e.lnglat.lat
          // 添加点
          addMarker(AMap)
          // 获取地址信息
          getAddress(AMap, e.lnglat.lng, e.lnglat.lat)
          // 通知父组件
          emit('updateLng', e.lnglat.lng)
          emit('updateLat', e.lnglat.lat)
        })


        // 实例化自动完成插件
        AMap.plugin(["AMap.AutoComplete"], function () {
          var autoOptions = {
            city: "全国",
          };
          autoComplete = new AMap.AutoComplete(autoOptions);
        })

        //构造地点查询类
        placeSearch = new AMap.PlaceSearch({
          map: map,
        });


      })
      .catch((e) => {
        console.log(e);
      });


});

const addMarker = (AMap) => {
  // 移除点
  if (state.marker) {
    state.marker.setMap(null)
    state.marker = null
  }

  state.marker = new AMap.Marker({
    position: [state.pointLng, state.pointLat],
    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
    offset: new AMap.Pixel(-13, -30),
  });
  state.marker.setMap(map);
}

const remoteMethod = (query) => {
  autoComplete.search(query, function (status, result) {
    //搜索成功时，result 即是对应的匹配数据
    state.options = result.tips
  });

}

const changeSelect = (e) => {
  placeSearch.search(state.options[e].name)
}

const getAddress = (AMap, lng, lat) => {
  state.getcoder = new AMap.Geocoder({
    city: '全国',
    radius: 1000,
    extensions: "all",
  });

  state.getcoder.getAddress([lng, lat], (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      state.searchKey = result.regeocode.formattedAddress
    } else {
      console.log('获取地址失败', status, result)
    }
  })
}

onUnmounted(() => {
  map?.destroy();
});
</script>

<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style>
