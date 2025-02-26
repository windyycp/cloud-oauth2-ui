<template>
	<div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
		<img :src="logowhite" class="layout-logo-medium-img" style="margin-left: 7%;" />
		<span
			class="color-white strong font18"
			style="font-family: YouSheBiaoTiHei, YouSheBiaoTiHei; font-style: italic;"
			>{{ $t('message.menu.globalTitle')}}</span>
	</div>
	<div class="layout-logo-size" v-else @click="onThemeConfigChange">
		<img :src="logowhite" class="layout-logo-size-img" />
	</div>
</template>

<script setup lang="ts" name="layoutLogo">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import logowhite from '/@/assets/LogoWhite.svg';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
	let { isCollapse, layout } = themeConfig.value;
	return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
});
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
	if (themeConfig.value.layout === 'transverse') return false;
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
};
</script>

<style scoped lang="scss">
.layout-logo {
	width: 260px; //bc
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: left;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--el-color-primary);
	font-size: 16px;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	span {
		white-space: nowrap;
		display: inline-block;
	}
	&:hover {
		span {
			color: var(--el-color-primary-light-9);
		}
	}
	&-medium-img {
		width: 16px;
		margin-right: 5px;
	}
}
.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	&-img {
		width: 20px;
		margin: auto;
	}
	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
