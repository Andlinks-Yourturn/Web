import React from 'react';
import { Panel, Input, Select, Button, DatePicker, Validate } from 'mtui/index';
import Frame from '../../layouts/Frame';
import { addStudent } from '../../services/student';
import { hashHistory } from 'react-router';
import './student.scss';

const Option = Select.Option;
const ValidateGroup = Validate.ValidateGroup;

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
                name: 'Economics',
                value: 'Economics'
            },
            {
                name: 'Law',
                value: 'Law'
            },
            {
                name: 'Art',
                value: 'Art'
            },
            {
                name: 'Philosophy',
                value: 'Philosophy'
            },
            {
                name: 'Information and Computing Sciences',
                value: 'Information and Computing Sciences'
            },
            {
                name: 'Electronic Science and Technology',
                value: 'Electronic Science and Technology'
            },
            {
                name: 'Automation',
                value: 'Automation'
            },
            {
                name: 'Accounting',
                value: 'Accounting'
            },
            {
                name: 'Mechanical Engineering and Automation',
                value: 'Mechanical Engineering and Automation'
            }
        ];

        return  <Frame headerTitle="Create A Student" iconClass="icon-student">
            <div className="student-info-input">
                <Panel header="Student Information">
                    <ValidateGroup className="student-form">
                        <div className="preview-ago" style={{ 'display': this.state.showPreview ? 'none' : 'block'}}>
                            <div>
                                <label htmlFor="firstName">First Name</label>
                                <Validate exgs={[{regs:'notempty',type:'warning',info:'firstName不能为空！'}]}>
                                    <Input name="firstName" type="text" placeholder="FirstName" onChange={ (e) => this.inputChange(e, 'firstName')}/>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="lastName">Last Name</label>
                                <Validate exgs={[{regs:'notempty',type:'warning',info:'lastName不能为空！'}]}>
                                    <Input name="lastName" type="text" placeholder="LastName" onChange={ (e) => this.inputChange(e, 'lastName')}/>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="username">Username</label>
                                <Validate exgs={[{regs: 'username',type:'danger',info:'请输入有效用户名！'}, {regs:'notempty',type:'warning',info:'username不能为空！'}]}>
                                    <Input name="username" type="text" placeholder="Username" onChange={ (e) => this.inputChange(e, 'userName')}/>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="password">Password</label>
                                <Validate exgs={[{regs: 'password',type:'danger',info:'请输入有效密码！'}, {regs:'notempty',type:'warning',info:'password不能为空！'}]}>
                                    <Input name="password" type="password" placeholder="Password" onChange={ (e) => this.inputChange(e, 'password')}/>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="birth">Birth</label>
                                <Validate exgs={[{regs:'notempty',type:'warning',info:'birth不能为空！'}]}>
                                    <DatePicker size="md" defaultValue="" placeholder="Birth" format="yyyy-mm-dd" onChange={ this.selectBirth.bind(this) } />
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="major">Major</label>
                                <Validate exgs={[{regs:'notempty',type:'warning',info:'major不能为空！'}]}>
                                    <Select defaultValue="Computer Science" trigger="click" style={{ width: 275}} placeholder="Major" onChange={ this.selectMajor.bind(this) }>
                                        {
                                            ( majors && majors.length > 0) && majors.map((major, index) => {
                                                return <Option key={ index } value={ major.value }> { major.name }</Option>
                                            })
                                        }
                                    </Select>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="gpa">GPA</label>
                                <Validate exgs={[{regx:'^[1-9]\\d*(\.\\d{1})?$',type:'danger',info:'正整数或只有一位的小数！'}, {regs:'notempty',type:'warning',info:'gpa不能为空！'}]}>
                                    <Input name="gpa" type="text" placeholder="GPA" onChange={ (e) => this.inputChange(e, 'gpa')}/>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="rank">Rank</label>
                                <Validate exgs={[{regx:'^[1-9]\\d*$',type:'danger',info:'请输入正整数！'}, {regs:'notempty',type:'warning',info:'rank不能为空！'}]}>
                                    <Input name="rank" type="text" placeholder="Rank" onChange={ (e) => this.inputChange(e, 'rank')}/>
                                </Validate>
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
                    </ValidateGroup>
                </Panel>
            </div>
        </Frame>;
    }
}