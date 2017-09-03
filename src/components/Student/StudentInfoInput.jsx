import React from 'react';
import { Panel, Input, Select, Button, DatePicker } from 'mtui/index';
import Frame from '../../layouts/Frame';
import { addStudent } from '../../services/student';
import { hashHistory } from 'react-router';
import './student.scss';

const Option = Select.Option;

export default class StudentInfoInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {

            },
            showPreview: false
        };

        this.inputChange = this.inputChange.bind(this);
    }

    inputChange(e, name) {
        this.setState({
            formData: Object.assign(this.state.formData, {[name]: e.target.value})
        });
    }

    showPreview(status) {
        this.setState({
            showPreview: status
        });
    }

    // 选择出生日期
    selectBirth(data) {
       if(data.target) {
           this.setState({
               formData: Object.assign(this.state.formData, {'birthday': data.target.value})
           });
       }
    }


    // 选择科目
    selectMajor(e) {
        this.setState({
            formData: Object.assign(this.state.formData, {'major': e.target.value})
        });
    }

    // 增加学生
    addStudentSubmit() {
        // 增加学生表单字段合法性校验
        addStudent(this.state.formData)
            .then(res => {
                if(res.status === 'SUCCESS' && res.result) {
                    hashHistory.push('/teacher/home');
                }

                if(res.status === 'ERROR') {
                    if(res.info) {
                        console.error('STUDENT-ADD', res.info);
                    }else {
                        console.error('增加学生错误！');
                    }
                }
            })
    }


    render() {
        const majors = [
            {
                name: '经济学',
                value: '经济学'
            },
            {
                name: '法学',
                value: '法学'
            },
            {
                name: '艺术',
                value: '艺术'
            },
            {
                name: '哲学',
                value: '哲学'
            },
            {
                name: '信息与计算机科学',
                value: '信息与计算机科学'
            },
            {
                name: '电子科学与技术',
                value: '电子科学与技术'
            },
            {
                name: '自动化',
                value: '自动化'
            },
            {
                name: '会计学',
                value: '会计学'
            },
            {
                name: '机械工程',
                value: '机械工程'
            }
        ];

        return  <Frame headerTitle="Create A Student">
            <div className="student-info-input">
                <Panel header="Student Information">
                    <form className="student-form">
                        <div className="preview-ago" style={{ 'display': this.state.showPreview ? 'none' : 'block'}}>
                            <div>
                                <label htmlFor="firstName">First Name</label>
                                <Input name="firstName" type="text" placeholder="FirstName" onChange={ (e) => this.inputChange(e, 'firstName')}/>
                            </div>

                            <div>
                                <label htmlFor="lastName">Last Name</label>
                                <Input name="lastName" type="text" placeholder="LastName" onChange={ (e) => this.inputChange(e, 'lastName')}/>
                            </div>

                            <div>
                                <label htmlFor="username">Username</label>
                                <Input name="username" type="text" placeholder="Username" onChange={ (e) => this.inputChange(e, 'userName')}/>
                            </div>

                            <div>
                                <label htmlFor="password">Password</label>
                                <Input name="password" type="password" placeholder="Password" onChange={ (e) => this.inputChange(e, 'password')}/>
                            </div>

                            <div>
                                <label htmlFor="birth">Birth</label>
                                <DatePicker size="md" defaultValue="" placeholder="Birth" format="yyyy-mm-dd" onChange={ this.selectBirth.bind(this) } />
                            </div>

                            <div>
                                <label htmlFor="major">Major</label>
                                <Select defaultValue="Computer Science" trigger="click" style={{ width: 275}} placeholder="Major" onChange={ this.selectMajor.bind(this) }>
                                    {
                                        ( majors && majors.length > 0) && majors.map((major, index) => {
                                            return <Option key={ index } value={ major.value }> { major.name }</Option>
                                        })
                                    }
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="gpa">GPA</label>
                                <Input name="gpa" type="text" placeholder="GPA" onChange={ (e) => this.inputChange(e, 'gpa')}/>
                            </div>

                            <div>
                                <label htmlFor="rank">Rank</label>
                                <Input name="rank" type="text" placeholder="Rank" onChange={ (e) => this.inputChange(e, 'rank')}/>
                            </div>

                            <Button className="preview-btn" onClick={ this.showPreview.bind(this, true) }>Preview</Button>
                        </div>

                        <div className="preview-future" style={{ 'display': this.state.showPreview ? 'block' : 'none'}}>
                            <ul>
                                <li>
                                    <label htmlFor="firstName">First Name</label>
                                    <span>{ this.state.formData.firstName }</span>
                                </li>

                                <li>
                                    <label htmlFor="firstName">Last Name</label>
                                    <span>{ this.state.formData.lastName }</span>
                                </li>

                                <li>
                                    <label htmlFor="firstName">Username</label>
                                    <span>{ this.state.formData.userName }</span>
                                </li>

                                <li>
                                    <label htmlFor="firstName">Password</label>
                                    <span>{ this.state.formData.password }</span>
                                </li>

                                <li>
                                    <label htmlFor="firstName">Birth</label>
                                    <span>{ this.state.formData.birthday }</span>
                                </li>

                                <li>
                                    <label htmlFor="firstName">Major</label>
                                    <span>{ this.state.formData.major }</span>
                                </li>

                                <li>
                                    <label htmlFor="firstName">GPA</label>
                                    <span>{ this.state.formData.gpa }</span>
                                </li>

                                <li>
                                    <label htmlFor="firstName">Rank</label>
                                    <span>{ this.state.formData.rank }</span>
                                </li>
                            </ul>

                            <div className="btn-group">
                                <Button className="back-btn" onClick={ this.showPreview.bind(this, false)}>Back</Button>
                                <Button className="create-btn" onClick={ this.addStudentSubmit.bind(this) }>Create</Button>
                            </div>
                        </div>
                    </form>
                </Panel>
            </div>
        </Frame>;
    }
}