import { createApp } from 'vue';
import { Clock } from '@kotron/global';

import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { i18n } from '/@/i18n/index';
import { directive } from '/@/directive/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import '/@/theme/index.scss';

import 'virtual:svg-icons-register';

const app = createApp(App);

directive(app);
other.elSvg(app);

// @ts-ignore
app.use(pinia).use(router).use(ElementPlus).use(i18n).mount('#app');

Clock.use(1000 * 10);
