import React, { Component } from 'react';
import StudentContentHeader from "../common/StudentContentHeader";
import StudentContentBody from "../common/StudentContentBody";
import { fetchNoApplyList, applyProject } from '../../services/student';
import { Panel, Button } from 'mtui/index';
import { getLocal } from '../../utils/storage';
import Frame from "../../layouts/Frame";

const personalInfo = getLocal('userInfo');
export default class StudentProjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noApplyList: [],
            projectCriteria: {},         // 项目的评判标准
            selectedProjectId: null
        }
    }

    componentDidMount() {
        this.getNoApplyList({ page: 0 })(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    // 获取未申请的项目列表
    getNoApplyList(param) {
        return function(successCb, errorCb) {
            fetchNoApplyList(param).then((res) => {
                if(res.status === 'SUCCESS' && res.result) {
                    successCb(res.result);
                }
                if(res.status === 'ERROR') {
                    errorCb(res);
                }
            })
        }
    }

    // 成功后的回调
    successCallback(result) {

        let content = result.content;
        if(content && content.length > 0) {
            this.setState({
                noApplyList: content
            })
        }else {
            this.setState({
                noApplyList: []
            })
        }
    }

    // 失败后的回调
    errorCallback(res) {
        if(res.info) {
            console.error('STUDENT-SUCCESS-APPLY-PROJECT:', res.info);
        }else {
            console.error('获取我的成功申请项目列表错误！');
        }
    }

    // 显示评判标准数据
    showCriteriaData(checkedIndex) {
        if(checkedIndex !== null) {
            // 项目列表
            let [ projectInfo, projectList ] = [ null, this.state.noApplyList ];

            if(projectList && projectList.length > 0) {
                projectInfo = projectList[checkedIndex];

                if(projectInfo) {
                    this.state.projectCriteria = {
                        age: projectInfo.maxAge,
                        major: projectInfo.major,
                        gpa: projectInfo.minGPA,
                        rank: projectInfo.rank
                    };
                }else {
                    this.state.projectCriteria = {};
                }

                this.setState({
                    projectCriteria: this.state.projectCriteria
                });
            }
        }
    }

    // 申请项目
    applyProject() {

        let projectId = this.state.selectedProjectId;
        if(projectId) {
            applyProject({
                id: projectId
            }).then((res => {
                console.log('res:', res);
            }))
        }

    }


    render() {

        const optionInfo = {
            panelHeader: 'My Project Applied',
            tableData: {
                tableHeader: [
                    {
                        name: 'Project Name'
                    },
                    {
                        name: 'Key Word'
                    },
                    {
                        name: 'Creator',
                        order: true
                    },
                    {
                        name: 'Total Donation'
                    },
                    {
                        name: 'createDate'
                    }
                ],
                tableBody: {
                    projectList: this.state.noApplyList,
                    columnName: ['projectName', 'keyword', 'creator-userName', 'total_donation', 'createDate']
                }
            },
            buttonName: '比较条件'
        };

        const projectCriteria = this.state.projectCriteria;

        return <Frame headerTitle="Project Info">
            <div className="student-projects">
                <StudentContentHeader projectNum={ this.state.noApplyList.length }/>

                <StudentContentBody  { ...optionInfo } showCriteriaData={ this.showCriteriaData.bind(this) } projectId={ this.state.selectedProjectId }>
                    <div className="contrast-info">
                        <Panel header="Project Info" className="project-info">
                            <dl className="dl-horizontal">
                                <dt>Age Max</dt>
                                <dd>{ projectCriteria.age }</dd>
                                <dt>Major</dt>
                                <dd>{ projectCriteria.major }</dd>
                                <dt>Min GPA</dt>
                                <dd>{ projectCriteria.gpa }</dd>
                                <dt>Rank</dt>
                                <dd>{ projectCriteria.rank }</dd>
                            </dl>
                        </Panel>

                        <Panel header="Personal Info" className="personal-info">
                            <dl className="dl-horizontal">
                                <dt>Age</dt>
                                <dd>{ personalInfo.age }</dd>
                                <dt>Major</dt>
                                <dd>{ personalInfo.major }</dd>
                                <dt>GPA</dt>
                                <dd>{ personalInfo.gpa }</dd>
                                <dt>Rank</dt>
                                <dd>{ personalInfo.rank }</dd>
                            </dl>

                            <Button className="apply-btn" onClick={ this.applyProject.bind(this) }>Apply</Button>
                        </Panel>
                    </div>
                </StudentContentBody>
            </div>
        </Frame>;

    }
}