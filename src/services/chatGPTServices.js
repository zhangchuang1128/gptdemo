import request from "../utils/request";
// http://127.0.0.1:8004/api/chat_gpt/chat/
// 发送消息Chat-GPT
export async function chatgpt(params) {
    return request(`/api/chat_gpt/chat`, {
        method: 'POST',
        data: params,
    });
}
// 发送消息BI-GPT

// http://127.0.0.1:8004/api/bi_gpt/chat/
export async function bigpt(params) {
    return request(`/api/bi_gpt/chat`, {
        method: 'POST',
        data: params,
    });
}
// 发送消息EM-GPT
// http://127.0.0.1:8004/api/em_gpt/chat
export async function emgpt(params) {
    return request(`/api/em_gpt/chat`, {
        method: 'POST',
        data: params,
    });
}
// 获取翻译语言列表
// http://127.0.0.1:8004/api/em_gpt/translation_language/
export async function getLanguage(params) {
    return request(`/api/em_gpt/translation_language`, {
        method: 'GET',
        params: params,
    });
}
//em queries-单独问答功能
// http://127.0.0.1:8004/api/em_gpt/queries/
export async function emqueries(params) {
    return request(`/api/em_gpt/queries`, {
        method: 'POST',
        data: params,
    });
}
// 检测运行状态
// http://127.0.0.1:8004/api/em_gpt/check/
export async function em_check(params) {
    return request(`/api/em_gpt/check`, {
        method: 'GET',
    });
}
// 角色预选
export async function preselectedRole(params) {
    return request(`/api/users/message_template`, {
        method: 'GET',
    });
}