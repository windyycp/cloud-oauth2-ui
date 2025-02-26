import dayjs, { Dayjs, UnitType } from 'dayjs';

/**
 * 时间日期转换
 * @param date 当前时间，new Date() 格式
 * @param format 需要转换的时间格式字符串
 * @description format 字符串随意，如 `YYYY-mm、YYYY-mm-dd`
 * @description format 季度："YYYY-mm-dd HH:MM:SS QQQQ"
 * @description format 星期："YYYY-mm-dd HH:MM:SS WWW"
 * @description format 几周："YYYY-mm-dd HH:MM:SS ZZZ"
 * @description format 季度 + 星期 + 几周："YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ"
 * @returns 返回拼接后的时间字符串
 */
export function formatDate(date: Date, format: string): string {
	let we = date.getDay(); // 星期
	let z = getWeek(date); // 周
	let qut = Math.floor((date.getMonth() + 3) / 3).toString(); // 季度
	const opt: { [key: string]: string } = {
		'Y+': date.getFullYear().toString(), // 年
		'm+': (date.getMonth() + 1).toString(), // 月(月份从0开始，要+1)
		'd+': date.getDate().toString(), // 日
		'H+': date.getHours().toString(), // 时
		'M+': date.getMinutes().toString(), // 分
		'S+': date.getSeconds().toString(), // 秒
		'q+': qut, // 季度
	};
	// 中文数字 (星期)
	const week: { [key: string]: string } = {
		'0': '日',
		'1': '一',
		'2': '二',
		'3': '三',
		'4': '四',
		'5': '五',
		'6': '六',
	};
	// 中文数字（季度）
	const quarter: { [key: string]: string } = {
		'1': '一',
		'2': '二',
		'3': '三',
		'4': '四',
	};
	if (/(W+)/.test(format))
		format = format.replace(RegExp.$1, RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' + week[we] : '周' + week[we]) : week[we]);
	if (/(Q+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 4 ? '第' + quarter[qut] + '季度' : quarter[qut]);
	if (/(Z+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 3 ? '第' + z + '周' : z + '');
	for (let k in opt) {
		let r = new RegExp('(' + k + ')').exec(format);
		// 若输入的长度不为1，则前面补零
		if (r) format = format.replace(r[1], RegExp.$1.length == 1 ? opt[k] : opt[k].padStart(RegExp.$1.length, '0'));
	}
	return format;
}

/**
 * 获取当前日期是第几周
 * @param dateTime 当前传入的日期值
 * @returns 返回第几周数字值
 */
export function getWeek(dateTime: Date): number {
	let temptTime = new Date(dateTime.getTime());
	// 周几
	let weekday = temptTime.getDay() || 7;
	// 周1+5天=周六
	temptTime.setDate(temptTime.getDate() - weekday + 1 + 5);
	let firstDay = new Date(temptTime.getFullYear(), 0, 1);
	let dayOfWeek = firstDay.getDay();
	let spendDay = 1;
	if (dayOfWeek != 0) spendDay = 7 - dayOfWeek + 1;
	firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay);
	let d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000);
	let result = Math.ceil(d / 7);
	return result;
}

/**
 * 将时间转换为 `几秒前`、`几分钟前`、`几小时前`、`几天前`
 * @param param 当前时间，new Date() 格式或者字符串时间格式
 * @param format 需要转换的时间格式字符串
 * @description param 10秒：  10 * 1000
 * @description param 1分：   60 * 1000
 * @description param 1小时： 60 * 60 * 1000
 * @description param 24小时：60 * 60 * 24 * 1000
 * @description param 3天：   60 * 60* 24 * 1000 * 3
 * @returns 返回拼接后的时间字符串
 */
export function formatPast(param: string | Date, format: string = 'YYYY-mm-dd'): string {
	// 传入格式处理、存储转换值
	let t: any, s: number;
	// 获取js 时间戳
	let time: number = new Date().getTime();
	// 是否是对象
	typeof param === 'string' || 'object' ? (t = new Date(param).getTime()) : (t = param);
	// 当前时间戳 - 传入时间戳
	time = Number.parseInt(`${time - t}`);
	if (time < 10000) {
		// 10秒内
		return '刚刚';
	} else if (time < 60000 && time >= 10000) {
		// 超过10秒少于1分钟内
		s = Math.floor(time / 1000);
		return `${s}秒前`;
	} else if (time < 3600000 && time >= 60000) {
		// 超过1分钟少于1小时
		s = Math.floor(time / 60000);
		return `${s}分钟前`;
	} else if (time < 86400000 && time >= 3600000) {
		// 超过1小时少于24小时
		s = Math.floor(time / 3600000);
		return `${s}小时前`;
	} else if (time < 259200000 && time >= 86400000) {
		// 超过1天少于3天内
		s = Math.floor(time / 86400000);
		return `${s}天前`;
	} else {
		// 超过3天
		let date = typeof param === 'string' || 'object' ? new Date(param) : param;
		return formatDate(date, format);
	}
}

/**
 * 时间问候语
 * @param param 当前时间，new Date() 格式
 * @description param 调用 `formatAxis(new Date())` 输出 `上午好`
 * @returns 返回拼接后的时间字符串
 */
import { useI18n } from 'vue-i18n';
export function formatAxis(param: Date): string {
	const { t } = useI18n();
	let hour: number = new Date(param).getHours();
	if (hour < 6) return t('message.greeting.weehours');
	else if (hour < 9) return t('message.greeting.zaoshang');
	else if (hour < 12) return t('message.greeting.morning');
	else if (hour < 14) return t('message.greeting.zhongwu');
	else if (hour < 17) return t('message.greeting.afternoon');
	else if (hour < 19) return t('message.greeting.evening');
	else if (hour < 22) return t('message.greeting.wanshang');
	else return t('message.greeting.night');
}

/**
 * 返回时间差 格式分钟
 * @param end
 * @param start
 */
export function getTimeDifference(end, start) {
	if (end && start) {
		const endDate = new Date(end).getTime();
		const startDate = new Date(start).getTime();
		const diffTime = Math.abs(endDate - startDate);
		const diffMinute = Math.floor(diffTime / (1000 * 60));
		return diffMinute;
	} else {
		return '-';
	}
}

/**
 * 时间差格式化
 * @param date1
 * @param date2
 */
export function formatTimeDifference(startDate, endDate) {
	var differenceInMilliseconds = Math.abs(endDate - startDate);

	console.log('differenceInMilliseconds',differenceInMilliseconds)
	var timeUnits = [
		{ unit: '年', milliseconds: 3.154e10 }, // 大约365.25天
		{ unit: '个月', milliseconds: 2.628e9 }, // 大约30.4375天，此计算方式对月份不太准确，可根据实际需求改进
		{ unit: '天', milliseconds: 86400000 },
		{ unit: '小时', milliseconds: 3600000 },
		{ unit: '分钟', milliseconds: 60000 },
		{ unit: '秒', milliseconds: 1000 },
	];

	for (var i = 0; i < timeUnits.length; i++) {
		var unit = timeUnits[i];
		var value = differenceInMilliseconds / unit.milliseconds;

		if (value >= 1) {
			var remainder = differenceInMilliseconds % unit.milliseconds;
			if (i < timeUnits.length - 1 && remainder > 0) {
				// 如果还有下一级单位并且剩余毫秒数大于0，则向下级单位进一
				value = Math.ceil(value);
			} else {
				value = Math.round(value);
			}

			// 返回格式化的中文结果，如“2天”，“1年”
			return `${value} ${unit.unit}${value !== 1 ? ' ' : ''}`;
		}
	}

	return '不到1秒';
}

/**
 * 格式化日期（用于请求时）
 * 将日期参数转换为请求时候所需的时间戳格式
 * @param date 日期
 * @param startEndOf 重置单位
 * @returns
 */
export function formatDateParams(date: number | Dayjs, startEndOf: UnitType) {
	const dateCopy = dayjs(date);

	return {
		beginDate: dateCopy.startOf(startEndOf).unix(),
		endDate: dateCopy.endOf(startEndOf).unix(),
	};
}
