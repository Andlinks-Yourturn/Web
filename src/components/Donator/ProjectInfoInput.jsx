import React, { Component } from 'react';
import { Panel, Input, Select, Button, Validate } from 'mtui/index';
import Frame from '../../layouts/Frame';
import { addProject } from '../../services/donator';
import { hashHistory } from 'react-router';
import './project.scss';

const Option = Select.Option;
const ValidateGroup = Validate.ValidateGroup;

export default class ProjectInfoInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formData: {}
        };

        this.inputChange = this.inputChange.bind(this);
    }

    inputChange(e, name) {
        this.setState({
            formData: Object.assign(this.state.formData, {[name]: e.target.value})
        });
    }

    selectChange(e) {
        this.setState({
            formData: Object.assign(this.state.formData, { major: e.target.value })
        });
    }

    addProject() {
        // 各输入框进行有效性校验
        addProject(this.state.formData)
            .then((res) => {
                if(res.status === 'SUCCESS' && res.result) {
                    hashHistory.push('/donator/home');
                }

                if(res.status === 'ERROR') {
                    if(res.info) {
                        console.error('PROJECT-CREATE:', res.info);
                    }else {
                        console.error('项目创建失败！');
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

        return (<Frame headerTitle="Create A New Project" iconClass="icon-project">
            <div className="project-info-input">
                <Panel header="Project Information">
                    <ValidateGroup className="project-form">
                            <div>
                                <label htmlFor="projectName">Project Name</label>
                                <Validate exgs={[{regs:'notempty',type:'warning',info:'projectName不能为空！'}]}>
                                    <Input name="projectName" type="text" placeholder="ProjectName" onChange={ (e) => this.inputChange(e, 'projectName') }/>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="keyword">Key Word</label>
                                <Validate exgs={[{regs:'notempty',type:'warning',info:'keyword不能为空！'}]}>
                                    <Input name="keyword" type="text" placeholder="Keyword" onChange={ (e) => this.inputChange(e, 'keyword') }/>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="totalDonation">Total Donation</label>
                                <Validate exgs={[{regx: '^[1-9]\\d*$',type:'danger',info:'请输入正整数！'}, {regs:'notempty',type:'warning',info:'totalDonation不能为空！'}]}>
                                    <Input name="totalDonation" type="text" placeholder="Total Donation" onChange={ (e) => this.inputChange(e, 'totalDonation') }/>
                                </Validate>
                            </div>

                            <div>
                                <label htmlFor="Count">Count</label>
                                <Validate exgs={[{regx: '^[1-9]\\d*$',type:'danger',info:'请输入正整数！'}, {regs:'notempty',type:'warning',info:'count不能为空！'}]}>
                                    <Input name="count" type="text" placeholder="Count" onChange={ (e) => this.inputChange(e, 'count') }/>
                                </Validate>
                            </div>

                            <div className="criteria-list">
                                <label>Criteria</label>
                                <div className="criteria-box">
                                    <div className="criteria-item">
                                        <label htmlFor="ageMax">Age Max</label>
                                        <Validate exgs={[{regx: '^[1-9]\\d*$',type:'danger',info:'请输入正整数！'}, {regs:'notempty',type:'warning',info:'maxAge不能为空！'}]}>
                                            <Input name="ageMax" type="text" placeholder="Age Max" onChange={ (e) => this.inputChange(e, 'maxAge') }/>
                                        </Validate>
                                    </div>

                                    <div className="criteria-item">
                                        <label htmlFor="major">Major</label>
                                        <Validate exgs={[{regs:'notempty',type:'warning',info:'major不能为空！'}]}>
                                            <Select trigger="click" placeholder="Major" onChange={ this.selectChange.bind(this) } style={{ width: 160 }}>
                                                {
                                                    ( majors && majors.length) && majors.map((major, index) => {
                                                        return <Option key={ index } value={ major.value }>{ major.name }</Option>
                                                    })
                                                }
                                            </Select>
                                        </Validate>
                                    </div>

                                    <div className="criteria-item">
                                        <label htmlFor="minGPA">min GPA</label>
                                        <Validate exgs={[{regx:'^[1-9]\\d*(\.\\d{1})?$',type:'danger',info:'正整数或只有一位的小数！'}, {regs:'notempty',type:'warning',info:'min GPA不能为空！'}]}>
                                            <Input name="minGPA" type="text" placeholder="Min GPA" onChange={ (e) => this.inputChange(e, 'minGPA') }/>
                                        </Validate>
                                    </div>

                                    <div className="criteria-item">
                                        <label htmlFor="rank">Rank</label>
                                        <Validate exgs={[{regx:'^[1-9]\\d*$',type:'danger',info:'请输入正整数！'}, {regs:'notempty',type:'warning',info:'rank不能为空！'}]}>
                                            <Input name="rank" type="text" placeholder="Rank" onChange={ (e) => this.inputChange(e, 'rank') }/>
                                        </Validate>
                                    </div>
                                </div>
                            </div>

                        <Button className="create-btn" onClick={ this.addProject.bind(this) }>Create</Button>
                    </ValidateGroup>
                </Panel>
            </div>
        </Frame>);


    }
}