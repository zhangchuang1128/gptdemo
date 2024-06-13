import request from "../utils/request";
// http://127.0.0.1:8004/api/histories/list/?page=1&size=10&type=1&question=中国&start_time=2023-08-02 14:22:00&end_time=2023-08-02 16:55:00
export async function getHistoryList(params) {
    return request(`/api/histories/list`, {
        method: 'GET',
        params: params,
    });
}
// 历史记录删除
// http://127.0.0.1:8004/api/histories/list/:pk/
export async function delete_histories(params) {
    return request(`/api/histories/list/${params}`, {
        method: 'DELETE',
    });
}