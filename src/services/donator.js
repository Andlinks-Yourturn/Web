import { AJAX, HttpMethod } from '../utils/ajax';


/**
 * @description 增加项目
 * @param param POST DATA
 * @returns {Object}
 */
function addProject(param) {
    return AJAX({
        url: '/api/donation',
        type: HttpMethod.POST,
        dataToString: true,
        data: param
    });
}

/**
 * @description 充值
 * @param param
 * @returns {Object}
 */
function recharge(param) {
    return AJAX({
        url: '/api/user/recharge',
        type: HttpMethod.PUT,
        dataToString: true,
        data: param
    })
}

/**
 * @description 获取我的项目列表
 * @param param
 * @returns {Object}
 */
function fetchMyProjectList(param) {
    return AJAX({
        url: '/api/donation/myProject',
        type: HttpMethod.GET,
        data: param || null
    })
}

/**
 * @description 获取所有的项目列表
 * @param param
 * @returns {Object}
 */
function fetchAllProjectList(param) {
    return AJAX({
        url: '/api/donation',
        type: HttpMethod.GET,
        data: param || null
    })
}

/**
 * @description 为项目捐款
 * @param param
 * @returns {Object}
 */
function donateForProject(param) {
    return AJAX({
        url: `api/donation/${ param.id }`,
        type: HttpMethod.PUT,
        data: param || null
    })
}

export { addProject, recharge, fetchMyProjectList, fetchAllProjectList, donateForProject } ;