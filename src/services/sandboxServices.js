import request from "../utils/request";

// sandbox
// http://127.0.0.1:8004/api/sandbox/sand_box/
export async function sandbox(params) {
    return request(`/api/sandbox/sand_box`, {
        method: 'POST',
        data: params,
    });
}
// document_summary
// http://127.0.0.1:8004/api/sandbox/document_summary/
export async function document_summary(params) {
    return request(`/api/sandbox/document_summary`, {
        method: 'POST',
        data: params,
    });
}
// conversation_data_extraction
// http://127.0.0.1:8004/api/sandbox/conversation_data_extraction/
export async function conversation_data_extraction(params) {
    return request(`/api/sandbox/conversation_data_extraction`, {
        method: 'POST',
        data: params,
    });
}