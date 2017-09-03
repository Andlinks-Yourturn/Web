/**
 * Created by zuilafeng on 2017/8/29.
 */
import qs from 'qs';
import axios from 'axios';
import { Tip, LoadingModal } from 'mtui/index';
import { isNotEmpty, isEmpty, isString } from './util';

export const HttpMethod = {
    GET: 'get',
    POST: 'post',
    PUT: 'put'
};

// 全局的loading
function showLoading() {
    LoadingModal.show('loading');
}

// 全局的loading
function hideLoading() {
    LoadingModal.hide();
}

function errorTip(obj) {
    // 服务端返回的异常
    if (obj.handleError) {
        // Tip.error(obj.msg || '服务器异常！');
    }
}

/**
 * @desc 使用axios第三方库访问后台服务器, 返回封装过后的Promise对象.
 * @param {string} url 请求的接口地址, 格式: "/xxx..."
 * @param {string} domain 跨域请求的域名地址, 如: www.baidu.com
 * @param {string} type HTTP请求方式, 默认GET.
 * @param {object} data 请求的数据, object对象格式
 * @param {function} onUpload 上传文件过程中的回调函数, 接收progressEvent参数.
 * @param {function} onDownload 下载文件过程中的回调函数, 接收progressEvent参数.
 * @param {function} cancel 取消请求的回调函数, 接收cancel参数, 当执行cancel()参数时请求被取消.
 * @param {number} timeout 配置请求超时时间, 为毫秒数, 默认从配置文件读取.
 * @param {boolean} cache 是否开启缓存, 开启后同样的请求(url相同, 参数相同), 第二次请求时会直接返回缓存数据, 不会请求后台数据, 默认false.
 * @param {boolean} handleError 是否自动处理接口报错情况, 默认true.
 * @return {object} - 返回一个promise的实例对象
 */
export function AJAX({ url = null,
                         domain = null,
                         type = HttpMethod.GET,
                         dataToString = false,
                         data = null,
                         onUpload = null,
                         onDownload = null,
                         cancel = null,
                         timeout = 20 * 1e3,
                         cache = false,
                         loading = true,
                         handleError = true }) {

    var getData;
    var postData;
    var cancelToken;
    var crossDomain = false;

    // data
    if (type === HttpMethod.POST) {
        postData = data;
        if (dataToString) {
            postData = qs.stringify(data, { allowDots: true });
        }
    } else {
        getData = data;
    }

    // 是否跨域
    if (isNotEmpty(domain)) {   // 跨域访问
        crossDomain = true;
    }

    // 开发模式采用跨域
    if (__DEV__) {
        // 开发模式都是跨域调用后台接口
        crossDomain = true;
        if (isEmpty(domain)) {
            // domain = API_PATH;
        }
    }

    // 是否缓存
    if (cache) {
        url += '?t=' + new Date().getTime();
    }

    if(loading){
        showLoading();
    }

    var promise = new Promise(function (resolve, reject) {

        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // ';
        var httpRequest = axios({
            method: type,
            baseURL: domain, // 跨域请求地址，域名 xxx.com
            url: url,
            timeout: timeout,
            params: getData,
            data: postData,
            withCredentials: crossDomain,
            onUploadProgress: onUpload,
            onDownloadProgress: onDownload,
            cancelToken: cancelToken
        }).then(function (ret) {

            hideLoading();
            let data = ret.data;
            if (!data) {
                reject(ret);
            } else {
                if (isString(data)) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        try {
                            /* eslint-disable no-eval */
                            data = eval('(' + data + ')');
                            /* eslint-enable no-eval */
                        } catch (e) {
                            console.error('返回的不是json格式！', e);
                            errorTip({
                                msg: '返回的不是json格式！',
                                handleError: handleError
                            });
                            reject(e);
                            return;
                        }
                    }
                }

                if (data.status === 500) {
                    Tip.error('Internal Server Error');
                    reject(data);
                    return;
                }
                // 返回成功
                if (data.status === 'SUCCESS') {
                    if(data.info) {
                        Tip.success(data.info)
                    }
                    resolve(data);
                    return;
                }

                // 错误
                if (data.status === 'ERROR') {
                    if(data.info) {
                        Tip.error(data.info);
                    }
                    resolve(data);
                    return;
                }

                // 如果没有success 字段，判断是否是合格的object
                if(typeof data === 'object') {
                    resolve(data);
                    return;
                }

                // 返回失败
                errorTip({ handleError: handleError, msg: data.resultDesc });

                reject(data);

            }
        }).catch(function (error) {
            hideLoading();
            reject(error);
        });
    });

    return promise;
}
