import React from 'react';
import LoginForm from './LoginForm';
import "./login.scss";

export default class LoginIndex extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-login">
            <h2>YOURTURN</h2>
            <LoginForm></LoginForm>
            <footer>
                <small>&copy; 2017 安链科技数据有限公司版权所有.保留一切权利.增值电信业务经营许可证:粤B2-20170163 软件著作权</small>
            </footer>
        </div>
    }
}