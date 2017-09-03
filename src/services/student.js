import { AJAX, HttpMethod } from '../utils/ajax';

/**
 * @description 增加学生
 * @param param
 * @returns {Object}
 */
function addStudent(param) {
    return AJAX({
        url: '/api/user/addStudent',
        type: HttpMethod.POST,
        dataToString: true,
        data: param
    });
}

/**
 * @description 获取成功申请的项目列表
 * @param param
 * @returns {Object}
 */
function fetchSuccessApplyList(param) {
    return AJAX({
        url: '/api/sch/stuSearch',
        type: HttpMethod.GET,
        data: param || null
    });
}

/**
 * @description 获取未申请的项目列表
 * @param param
 * @returns {Object}
 */
function fetchNoApplyList(param) {
    return AJAX({
        url: '/api/sch/noApply',
        type: HttpMethod.GET,
        data: param || null
    });
}


function applyProject(param) {
    return AJAX({
        url: `/api/sch/${ param.id }`,
        type: HttpMethod.POST,
        data: null
    });
}

export { addStudent, fetchSuccessApplyList, fetchNoApplyList, applyProject };