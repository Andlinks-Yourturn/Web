import React from 'react';
import RegisterForm from './RegisterForm';
import './register.scss';


export default class Register extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-register">
            <h2>YOURTURN</h2>
            <RegisterForm />
            <footer>
                <small>&copy; 2017 安链科技数据有限公司版权所有.保留一切权利.增值电信业务经营许可证:粤B2-20170163 软件著作权</small>
            </footer>
        </div>
    }
}