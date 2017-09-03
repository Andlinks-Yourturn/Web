import React from 'react';
import { Input, Button } from 'mtui/index';
import login from '../services/login';
import { setLocal, getLocal, remove } from '../utils/storage';
import { hashHistory } from 'react-router';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                account: '',
                password: ''
            }
        }
        this.inputChange = this.inputChange.bind(this);
        this.homePages = {donor: '/donator/home', teacher: '/teacher/home', student: '/student/home'};
    }

    inputChange(e, name){
        this.setState({
            formData: Object.assign(this.state.formData, {[name]: e.target.value})
        });
    }

    // 登录
    login() {
        if(this.state.formData.account && this.state.formData.password) {
            login(this.state.formData)
                .then((res) => {
                    if(res.status === 'SUCCESS' && res.result) {
                        if(getLocal('userInfo')) {
                            remove('userInfo');
                        }

                        setLocal('userInfo', res.result);
                        if(res.result.userType) {
                            hashHistory.push(this.homePages[res.result.userType]);
                        }
                    }

                    if(res.status === 'ERROR') {
                        if(res.info) {
                            console.error("LOGIN--INFO:", res.info);
                        }else {
                            console.error('登录发生错误！');
                        }
                    }
                })
        }
    }

    render() {
        return (<div className="login-form">
            <div className="form-header">
                <h3>
                    <span className="header-line left"></span>
                    Sign In
                    <span className="header-line right"></span>
                </h3>

            </div>

            <form className="form-box">
                <Input onChange={ (e) => this.inputChange(e, 'account') } name="username" type="text" placeholder="Username" block="true"/>
                <Input onChange={ (e) => this.inputChange(e, 'password')} name="password" type="password" placeholder="Password" block="true"/>
                <Button block="true" onClick={ this.login.bind(this) }>Login</Button>
            </form>
        </div>);
    }
}