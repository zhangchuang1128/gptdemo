import request from "../utils/request";
// http://127.0.0.1:8004//api/favorites/list/
// 收藏新增
export async function addFavorites(params) {
    return request(`/api/favorites/list`, {
        method: 'POST',
        data: params,
    });
}
// 收藏列表
// http://127.0.0.1:8004/api/favorites/list/?page=1&size=10&type=1&question=编辑&start_time=2023-08-02 14:22:00&end_time=2023-08-02 14:55:00
export async function favoritesList(params) {
    return request(`/api/favorites/list`, {
        method: 'GET',
        params: params,
    });
}
// 根据问题删除收藏
// http://127.0.0.1:8004/api/favorites/favorite_delete_question/
export async function deleteFavoritesByQuestion(params) {
    return request(`/api/favorites/favorite_delete_question`, {
        method: 'POST',
        data: params,
    });
}

// 根据id删除收藏
// http://127.0.0.1:8004/api/favorites/list/:pk/
export async function deleteFavoritesById(params) {
    return request(`/api/favorites/list/${params}`, {
        method: 'DELETE',
    });
}