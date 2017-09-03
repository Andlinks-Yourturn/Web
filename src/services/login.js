/**
 * Created by zuilafeng on 2017/8/30.
 */
import { AJAX, HttpMethod } from '../utils/ajax';

function login(param) {
    return AJAX({
        url: '/api/login',
        dataToString: true,
        type: HttpMethod.POST,
        data: param
    });
}

export default login;
