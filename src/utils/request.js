/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import {extend} from 'umi-request';
import {notification} from 'antd';
import {message} from "antd";
import {userLogout} from "../services/loginServices";
// import apiHost from "./apiHost";

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
/**
 * @zh-CN 异常处理程序
 * @en-US Exception handler
 */

const errorHandler = (error) => {
    const {response} = error;
    if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;
        const {status, url} = response;
        notification.error({
            message: `Request error ${status}: ${url}`,
            description: errorText,
        });
    } else if (!response) {
        notification.error({
            description: '无法连接到服务器',
            message: '网络异常',
        });
    }
    return response;
};
/**
 * @en-US Configure the default parameters for request
 * @zh-CN 配置request请求时的默认参数
 */

const request = extend({
    // prefix: apiHost,
    errorHandler,
    // default error handling
    credentials: 'include', // Does the default request bring cookies
});

// request统一处理
request.interceptors.request.use((url, options) => {
    options.headers = {
        ...options.headers,
        Authorization: localStorage.getItem('token')
    };
    return {url, options}
});

// response统一处理
request.interceptors.response.use(async (response, options) => {
    const data = await response.clone().json();
    if (response.status === 401) {
        message.error('User authentication failed. Please log in again')
        // alert('用户验证失败，请重新登录')
        userLogout()
        window.location.href = '/login'
    }
    if (response.status !== 200) {
        message.error(data.msg)
    } else {
        return response
    }
    // return response;
}, {global: false});

export default request;
