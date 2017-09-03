/**
 * Created by zuilafeng on 2017/8/30.
 */
import { AJAX, HttpMethod } from '../utils/ajax';

function register(param) {
    return AJAX({
        url: '/api/user/register',
        type: HttpMethod.POST,
        dataToString: true,
        data: param
    });
}

export default register;