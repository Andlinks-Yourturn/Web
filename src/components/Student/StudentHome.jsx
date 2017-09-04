import React, { Component } from 'react';
import Frame from '../../layouts/Frame';
import { Panel } from 'mtui/index';
import StudentContentHeader from "../common/StudentContentHeader";
import StudentContentBody from '../common/StudentContentBody';
import { fetchSuccessApplyList } from '../../services/student';
import './student.scss';

export default class StudentHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            myProjectList: [],
            projectCriteria: {},        // 项目的评判标准
            projectNum: 0
        }
    }

    componentDidMount() {
        this.getSuccessApplyList({ page: 0 })(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    // 获取我的成功申请项目列表
    getSuccessApplyList(param) {
        return function(successCb, errorCb) {
            fetchSuccessApplyList(param).then((res) => {
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
                myProjectList: content,
                projectNum: result.totalElements
            })
        }else {
            this.setState({
                myProjectList: []
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
            let [ authCondition, projectList ] = [ null, this.state.myProjectList ];

            if(projectList && projectList.length > 0) {
                authCondition = projectList[checkedIndex].authCondition;

                try{
                    if(typeof authCondition === 'string') {
                        this.state.projectCriteria = JSON.parse(authCondition);
                    }

                    if(!authCondition) {
                        this.state.projectCriteria = {};
                    }

                    this.setState({
                        projectCriteria: this.state.projectCriteria
                    });

                }catch(e) {
                    console.error('解析JSON发生错误，不是合法的JSON字符串');
                    return;
                }

            }
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
                        name: 'Approved Time',
                        order: true
                    },
                    {
                        name: 'Benefit'
                    }
                ],
                tableBody: {
                    projectList: this.state.myProjectList,
                    columnName: ['projectName', 'keyWord', 'verifyPassTime', 'benefit']
                }
            },
            buttonName: '查看条件',
            projectNum: this.state.projectNum
        };

        const projectCriteria = this.state.projectCriteria;

        const callback = {
            successCallback: this.successCallback.bind(this),
            errorCallback: this.errorCallback.bind(this),
        };

        return <Frame headerTitle="Main Page" iconClass="icon-homepage">
            <div className="student-home">
                {/*头部*/}
                <StudentContentHeader projectNum={ this.state.projectNum }/>

                <StudentContentBody { ...optionInfo } showCriteriaData={ this.showCriteriaData.bind(this) } { ...callback } getProjectList={ this.getSuccessApplyList.bind(this) }>
                    {/*标准文档*/}
                    <Panel header="Criteria Document" className="criteria-document">
                        <dl className="dl-horizontal">
                            <dt>Age Max</dt>
                            <dd>{ projectCriteria.age || '' }</dd>
                            <dt>Major</dt>
                            <dd>{ projectCriteria.major || '' }</dd>
                            <dt>Min GPA</dt>
                            <dd>{ projectCriteria.gpa || '' }</dd>
                            <dt>Rank</dt>
                            <dd>{ projectCriteria.rank || '' }</dd>
                        </dl>
                    </Panel>
                </StudentContentBody>

            </div>
        </Frame>;
    }
}