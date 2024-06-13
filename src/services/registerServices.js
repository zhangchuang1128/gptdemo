import request from "../utils/request";

// 注册
export async function register(params) {
    return request(`/api/users/register`, {
        method: 'POST',
        data: params,
    });
}
// 发送邮箱验证码
export async function getVerificationCode(params) {
    return request(`/api/users/get_mail_code`, {
        method: 'POST',
        data: params,
    });
}
