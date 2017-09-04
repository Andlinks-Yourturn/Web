import React from 'react';
import { Input, Button, Validate, Tip } from 'mtui/index';
import register from '../services/register';
import { hashHistory } from 'react-router';

const ValidateGroup = Validate.ValidateGroup;

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nextShow: false,
            formData: {
                userName: '',
                password: '',
                linkPass: ''
            }
        };
        this.inputChange = this.inputChange.bind(this);
        this.repeatValue = {
            pwdRepeat: '',
            linkPassRepeat: ''
        };
    }


    inputChange(e, name){
        if(name === 'linkPassRepeat' || name === 'pwdRepeat') {
            this.repeatValue[name] = e.target.value;
            return;
        }

        this.setState({
            formData: Object.assign(this.state.formData, {[name]: e.target.value})
        });
    }

    showNext(status) {
        console.log('status', status);
        this.setState({
            nextShow: status
        });
    }

    regSubmit() {
        const formData = this.state.formData;

        if( this.repeatValue.pwdRepeat !== formData.password ) {
            Tip.error('再次密码输入不一致！');
            return;
        }

        if( this.repeatValue.linkPassRepeat !== formData.linkPass ) {
            Tip.error('再次密码输入不一致！');
            return;
        }

        if(formData.userName && formData.password && formData.linkPass) {
            register(formData)
                .then(res => {
                    if(res.status === 'SUCCESS' && res.result) {
                       hashHistory.push('/login');
                    }

                    if(res.status === 'ERROR') {
                        if(res.info) {
                            console.error('REGISTER-FORM', res.info);
                        }else {
                            console.error('注册错误！');
                        }
                    }
                })
        }
    }

    render() {
        return (<div className="register-form">
            <div className="form-header">
                <h3>
                    <span className="header-line left"></span>
                    Sign Up
                    <span className="header-line right"></span>
                </h3>

            </div>

            <form className="form-box">
                <div className="website-reg" style={{ display: this.state.nextShow ? 'none': 'block'}}>
                    <Input onChange={ (e) => this.inputChange(e, 'userName') } name="username" type="text" placeholder="Username" block="true"/>
                    <Input onChange={ (e) => this.inputChange(e, 'password')} name="password" type="password" placeholder="Password" block="true"/>
                    <Input onChange={ (e) => this.inputChange(e, 'pwdRepeat')} name="pwdRepeat" type="password" placeholder="Repeat" block="true" />
                    <Button block="true" onClick={ this.showNext.bind(this, true) }>Next</Button>
                </div>

                <div className="base-coin" style={{display: this.state.nextShow ? 'block' : 'none'}}>
                    <Validate exgs={ [{regs:'notempty',type:'warning',info:'不能为空！'}] }>
                        <Input onChange={ (e) => this.inputChange(e, 'linkPass')} name="basecoinPwd" type="password" placeholder="baseCoinPwd" block="true"/>
                    </Validate>
                    <Validate exgs={ [{regs:'notempty',type:'warning',info:'不能为空！'}] }>
                        <Input onChange={ (e) => this.inputChange(e, 'linkPassRepeat')} name="linkPassRepeat" type="password" placeholder="Repeat" block="true" />
                    </Validate>
                    <Button block="true" onClick={ this.regSubmit.bind(this) }>Sign Up</Button>
                    <a className="previous-step" onClick={ this.showNext.bind(this, false)}><i></i>Previous</a>
                </div>

            </form>
        </div>);
    }
}