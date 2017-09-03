import React, { Component } from 'react';
import StudentContentHeader from "../common/StudentContentHeader";
import StudentContentBody from "../common/StudentContentBody";
import { fetchNoApplyList, applyProject } from '../../services/student';
import { Panel, Button, Modal } from 'mtui/index';
import { getLocal } from '../../utils/storage';
import Frame from "../../layouts/Frame";

export default class StudentProjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noApplyList: [],
            projectCriteria: {},            // 项目的评判标准
            selectedProjectId: null,
            applyResult: '',                // 项目申请结果
            showApplyBtn: true,             // 申请项目按钮显示
            projectNum: 0                   // 项目个数
        }
        this.personalInfo = getLocal('userInfo');
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
                noApplyList: content,
                projectNum: result.totalElements
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
               if(res && res.status === 'SUCCESS' && res.result) {
                   if(res.result.status === 'success') {
                       this.state.applyResult = '申请成功!';
                       this.state.showApplyBtn = false;
                   }
                   if(res.result.status === 'failure') {
                       this.state.applyResult = '申请失败!';
                   }

                   this.setState({
                       applyResult: this.state.applyResult,
                       showApplyBtn: this.state.showApplyBtn
                   }, () => {
                       this.refs['appliedGo'].showModal(true);
                   });
               }
               if(res && res.status === 'ERROR') {
                   if(res.info) {
                       console.error('APPLYPOJECT:', res.info);
                   }else {
                       console.error('申请项目失败！');
                   }
               }
            }))
        }

    }

    // 获取已选中的项目的ID
    setProjectId(checkedIndex) {
        if(typeof checkedIndex === 'number') {
            this.setState({
                selectedProjectId: this.state.noApplyList[checkedIndex].id
            });
        }
    }



    render() {

        const optionInfo = {
            panelHeader: 'My Project UnApplied',
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
                    columnName: ['projectName', 'keyword', 'creator-userName', 'totalDonation', 'createDate']
                }
            },
            buttonName: '比较条件'
        };

        const projectCriteria = this.state.projectCriteria;

        return <Frame headerTitle="Project Info">
            <div className="student-projects">
                <StudentContentHeader projectNum={ this.state.projectNum }/>

                <StudentContentBody  { ...optionInfo } showCriteriaData={ this.showCriteriaData.bind(this) } setProjectId={ this.setProjectId.bind(this) }>
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
                                <dd>{ this.personalInfo.age }</dd>
                                <dt>Major</dt>
                                <dd>{ this.personalInfo.major }</dd>
                                <dt>GPA</dt>
                                <dd>{ this.personalInfo.gpa }</dd>
                                <dt>Rank</dt>
                                <dd>{ this.personalInfo.rank }</dd>
                            </dl>

                            { this.state.showApplyBtn && <Button className="apply-btn" onClick={ this.applyProject.bind(this) }>Apply</Button>}
                        </Panel>
                    </div>
                </StudentContentBody>
            </div>

            {/* 申请结果的弹窗 */}
            <Modal ref="appliedGo" modalClassName="animated bounceInDown" style={{width:608, height:160}} className="apply-result-modal">
                <div className="mt-panel-min">
                    <div className="panel-header">
                        <h3>提示</h3>
                    </div>
                    <div className="panel-body">
                        <div className="tip-content">
                            { this.state.applyResult }
                        </div>
                    </div>
                </div>
            </Modal>
        </Frame>;

    }
}