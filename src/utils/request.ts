import axios, {AxiosInstance} from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Session} from '/@/utils/storage';
import qs from 'qs';

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 50000,
    headers: {'Content-Type': 'application/json'},
    paramsSerializer: {
        serialize(params) {
            return qs.stringify(params, {allowDots: true});
        },
    },
});

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {

        // 在发送请求之前添加token
        if (Session.get('token')) {
            config.headers!['Authorization'] = `Bearer ${Session.get('token')}`;
        }

        // 根据请求路径切换不同的请求地址
        const mcsUrlPreFixes = ["/Monitor"]
        const mcsMatched = mcsUrlPreFixes.find(prefix => config.url?.indexOf(prefix) === 0);
        if (config.url?.indexOf("/file") === 0) {
            config.baseURL = import.meta.env.VITE_FILE_URL;
        } else if(mcsMatched){
            config.baseURL = import.meta.env.VITE_MCS_URL
        }

        // 请求page参数转为科创标准请求体
        if (config.method?.toLowerCase() === 'get' && config.params?.pageNum) {
            config.params = {
                ...config.params, page: config.params.pageNum,
            };
            delete config.params.pageNum
        }
        return config;
    },
    
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data;
        if (res.code && res.code !== '0000' && res.code !== 200) {
            // `token` 过期或者账号已在别处登录
            if (res.code === 401 || res.code === 4001) {
                Session.clear(); // 清除浏览器全部临时缓存
                window.location.href = '/'; // 去登录页
                ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
                    .then(() => {
                    })
                    .catch(() => {
                    });
            }
            ElMessage.error(res.message);
            return Promise.reject(service.interceptors.response);
        } else {
            // return res;
            // 将科创响应体格式转为通用响应体格式
            if (res.pagination && typeof res.pagination === 'object') {
                const paginationData = {
                    page: res.pagination.index,
                    pageSize: res.pagination.size,
                    total: res.pagination.count,
                };
                return {
                    ...res,
                    ...paginationData
                }
            } else {
                return res;
            }
        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.message.indexOf('timeout') != -1) {
            ElMessage.error('网络超时');
        } else if (error.message == 'Network Error') {
            ElMessage.error('网络连接错误');
        } else {
            if (error.response.status === 401) {
                Session.clear();
                window.location.href = import.meta.env.VITE_LOGIN_PATH;
                return Promise.reject(error);
            }
            if (error.response.data) ElMessage.error(error.response.statusText || error.response.data.message);
            else ElMessage.error('接口路径找不到');
        }
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;
