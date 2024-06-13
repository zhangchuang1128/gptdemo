import request from "../utils/request";
// 获取文件列表
// http://127.0.0.1:8004/api/file/list/?type=em&page=1&size=10
export async function getfileList(params) {
    return request(`/api/file/list`, {
        method: 'GET',
        params: params,
    });
}

// 获取文裆库列表
// api/file/document_library/?document_type=em&page=1&size=10
export async function getDocumentLibraryList(params) {
    return request(`/api/file/document_library`, {
        method: 'GET',
        params: params,
    });
}

// 文裆库新增
// http://127.0.0.1:8004/api/file/document_library
export async function addDocumentLibraryRequest(params) {
    return request(`/api/file/document_library`, {
        method: 'POST',
        data: params,
    });
}

// 删除文档库
// http://127.0.0.1:8004/api/file/document_library/:id
export async function deleteDocumentLibrary(id) {
    return request(`/api/file/document_library/${id}`, {
        method: 'DELETE',
        data: id,
    });
}

// 删除文件
// http://127.0.0.1:8004/api/file/file_delete/
export async function delete_file(params) {
    return request(`/api/file/file_delete`, {
        method: 'POST',
        data: params,
    });
}

// em文件上传
// http://127.0.0.1:8004/api/file/batch_upload/
export async function uploadFile(formData) {
    return request(`/api/file/batch_upload`, {
        method: "POST",
        requestType: "form",
        data: formData,
    });
}

// bi文件上传
// http://127.0.0.1:8004/api/file/bi_gpt_uploads/
export async function biUploadFile(formData) {
    return request(`/api/file/bi_gpt_uploads`, {
        method: "POST",
        requestType: "form",
        data: formData,
    });
}

//   索引列表
// http://127.0.0.1:8004/api/file/file_search_list?page=1&size=10&filename=converted/admin/em/yunstorm_2.jpg.txt
export async function getIndexList(params) {
    return request(`/api/file/file_search_list`, {
        method: 'GET',
        params: params,
    });
}

// 根据索引删除
// http://127.0.0.1:8004/api/file/file_search_delete_key/
export async function delete_by_key(params) {
    return request(`/api/file/file_search_delete_key`, {
        method: 'DELETE',
        data: params,
    });
}

// 删除索引·根据文件名称
// http://127.0.0.1:8004/api/file/file_search_delete_filename/
export async function delete_by_filename(params) {
    return request(`/api/file/file_search_delete_filename`, {
        method: 'DELETE',
        data: params,
    });
}