import request from "../utils/request";

// 登出
export function userLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// 登录
// http://127.0.0.1:8004/api/users/login/
export async function login(params) {
    return request(`/api/users/login`, {
        method: 'POST',
        data: params,
    });
}
// 用户信息
// http://127.0.0.1:8004/api/users/info/、
export async function getUser(params) {
    return request(`/api/users/info`, {
        method: 'GET',
        params: params,
    });
}