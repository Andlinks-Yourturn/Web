import React, { Component } from 'react';
import { Panel, Input, Select, Button } from 'mtui/index';
import Frame from '../../layouts/Frame';
import { addProject } from '../../services/donator';
import { hashHistory } from 'react-router';
import './project.scss';

const Option = Select.Option;

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

        return (<Frame headerTitle="Create A New Project">
            <div className="project-info-input">
                <Panel header="Project Information">
                    <form className="project-form">
                        <div>
                            <label htmlFor="projectName">Project Name</label>
                            <Input name="projectName" type="text" placeholder="ProjectName" onChange={ (e) => this.inputChange(e, 'projectName') }/>
                        </div>

                        <div>
                            <label htmlFor="keyword">Key Word</label>
                            <Input name="keyword" type="text" placeholder="Keyword" onChange={ (e) => this.inputChange(e, 'keyword') }/>
                        </div>

                        <div>
                            <label htmlFor="totalDonation">Total Donation</label>
                            <Input name="totalDonation" type="text" placeholder="Total Donation" onChange={ (e) => this.inputChange(e, 'totalDonation') }/>
                        </div>

                        <div>
                            <label htmlFor="Count">Count</label>
                            <Input name="count" type="text" placeholder="Count" onChange={ (e) => this.inputChange(e, 'count') }/>
                        </div>

                        <div className="criteria-list">
                            <label>Criteria</label>
                            <div className="criteria-box">
                                <div className="criteria-item">
                                    <label htmlFor="ageMax">Age Max</label>
                                    <Input name="ageMax" type="text" placeholder="Age Max" onChange={ (e) => this.inputChange(e, 'maxAge') }/>
                                </div>

                                <div className="criteria-item">
                                    <label htmlFor="major">Major</label>
                                    <Select trigger="click" placeholder="请选择" onChange={ this.selectChange.bind(this) }>
                                        {
                                            ( majors && majors.length) && majors.map((major, index) => {
                                                return <Option key={ index } value={ major.value }>{ major.name }</Option>
                                            })
                                        }
                                    </Select>
                                </div>

                                <div className="criteria-item">
                                    <label htmlFor="minGPA">min GPA</label>
                                    <Input name="minGPA" type="text" placeholder="Min GPA" onChange={ (e) => this.inputChange(e, 'minGPA') }/>
                                </div>

                                <div className="criteria-item">
                                    <label htmlFor="rank">Rank</label>
                                    <Input name="rank" type="text" placeholder="Rank" onChange={ (e) => this.inputChange(e, 'rank') }/>
                                </div>
                            </div>
                        </div>

                        <Button className="create-btn" onClick={ this.addProject.bind(this) }>Create</Button>
                    </form>
                </Panel>
            </div>
        </Frame>);


    }
}