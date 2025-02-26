<template>
	<svg class="svg-icon" :class="className" aria-hidden="true">
		<use :xlink:href="`#icon-${icon}`" />
	</svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { CssUnits } from '@kotron/fortress-ui';

const props = withDefaults(
	defineProps<{
		icon: string;
		className?: string;
		size?: string | number;
	}>(),
	{
		size: 20,
	}
);

const size = computed(() => {
	if (isNaN(props.size as number)) {
		return props.size;
	} else {
		return CssUnits.rem(props.size as number);
	}
});
</script>

<style lang="scss" scoped>
.svg-icon {
	overflow: hidden;
	fill: currentColor;
	width: v-bind(size);
	height: v-bind(size);
}
</style>
