
import { AJAX, HttpMethod } from '../utils/ajax';

/**
 * @description 余额
 * @param param
 * @returns {Object}
 */
function fetchBalance(param) {
    return AJAX({
        url: '/api/user/balance',
        type: HttpMethod.GET,
        data: param || null
    });
}

/**
 * @description 设置State中的余额值
 * @param name
 */
function setBalance(name) {

    fetchBalance().then(res => {
        if(res.status === 'SUCCESS' && res.result) {
            this.setState({
                [name]: res.result.balance
            });
        }

        if(res.status === 'ERROR') {
            console.error('获取余额错误！');
        }
    })
}

/**
 * @description 分页
 * @param pageInfo
 * @param callback
 * @returns {boolean|Function}
 */
function goToPage(pageInfo, callback) {
    if(pageInfo.current) {
        return typeof callback === 'function' && function (queryParam, successCb, errorCb) {
            if(typeof queryParam === 'object') {
                if(queryParam.page !== undefined) {
                    queryParam.page = pageInfo.current - 1;
                }
                queryParam = Object.assign({}, queryParam, { page: pageInfo.current - 1 });
                callback(queryParam)(successCb, errorCb);
            }
        }
    }
}

export { setBalance, goToPage };