import { AJAX, HttpMethod } from '../utils/ajax';

/**
 * @description 获取学生列表
 * @param param
 * @returns {Object}
 */
function fetchStudentList(param) {
    return AJAX({
        url: '/api/user/listStudent',
        type: HttpMethod.GET,
        data: param || null
    })
}

function fetchNoMineStudents(param) {
    return AJAX({
        url: '/api/user/listNotMine',
        type: HttpMethod.GET,
        data: param || null
    })
}
export { fetchStudentList, fetchNoMineStudents };