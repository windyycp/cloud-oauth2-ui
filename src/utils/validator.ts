/**
 * 校验手机号
 * @param rule
 * @param value
 * @param callback
 */
export const validatorPhone = (rule, value, callback) => {
    const reg = /^1[1-9]\d{9}$/;
    if (!reg.test(value)) {
        callback(new Error('请输入有效的11位手机号码'));
    } else {
        callback();
    }
}
