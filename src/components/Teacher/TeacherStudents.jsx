import React, { Component } from 'react';
import Frame from '../../layouts/Frame';
import { Button, Panel, Radio } from 'mtui/index';
import { fetchNoMineStudents } from '../../services/teacher';
import { getDateStringFromUnix } from '../../utils/util';
import './teacher.scss';
import TeacherContentHeader from "../common/TeacherContentHeader";

export default class TeacherStudents extends Component {

    constructor(props) {
        super(props);

        this.state = {
            studentList: [],            // 学生列表
            studentDetail: {},          // 学生详情
            pageInfo: {
                morePage: false,        // 显示更多
                current: 0
            },                          // 分页信息
            radioCheckedId: null,       // 被激活的Id
            showDetailFlag: false,      // 显示右侧详情栏
        }

        this.studentDividedById = {};   // 按学生Id划分对象
        this.current = 0;               // 当前页
    }

    componentDidMount() {

       this.getStudentListByPage({ page: 0}, false, this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    // 成功回调处理
    successCallback(result) {
        return (addUp) => {
            let content = result.content;

            if(content && content.length > 0) {
                content.forEach((item) => {
                    this.studentDividedById[item.id] = item;
                });
            }

            // 页数大于1，则加载更多
            if(content.totalPages > 1) {
                this.state.pageInfo = {
                    morePage: true,
                    current: this.current,
                    totalPage: content.totalPages
                };

                this.setState({
                    pageInfo: this.state.pageInfo
                });
            }

            if(addUp) {
                content = content.concat(this.state.studentList);
            }

            this.setState({
                studentList: content || []
            });
        }

    }

    // 错误回调
    errorCallback(res) {
        if(res.info){
            console.error('TEACHER-GETSTUDENTLIST:', res.info);
        }else {
            consoel.error('获取学生列表错误!');
        }
    }

    // 获取学生列表
    getStudentListByPage(param, addUp, successCb, errorCb) {
        fetchNoMineStudents(param).then((res) => {
            if(res.status === 'SUCCESS' && res.result) {
                successCb(res.result)(addUp);
            }
            if(res.status === 'ERROR') {
                errorCb(res);
            }
        });

    }

    // 单选按钮
    radioSelect(data) {
        this.setState({radioCheckedId: data});
    }

    // 显示学生详情
    showStudentDetail() {
        this.setState({
            studentDetail: this.studentDividedById[this.state.radioCheckedId],
            showDetailFlag: true
        });
    }

    // 加载更多的学生信息
    loadMore(currentPage) {
        this.current = currentPage;
        this.getStudentListByPage({ page: currentPage }, true, this.successCallback.bind(this), this.errorCallback.bind(this) );
    }

    render() {

        const { studentList, studentDetail, pageInfo }  = this.state;

        const studentName = (studentDetail.lastName && studentDetail.firstName) ? `${studentDetail.lastName}.${studentDetail.firstName}` : studentDetail.userName || '';

        return <Frame headerTitle="Main Page">
            <div className="teacher-home">
                <TeacherContentHeader projectNum={ this.state.studentList.length }></TeacherContentHeader>

                <div className="content-body">

                    {/* 学生列表*/}
                    <Panel header="Student Information List" className="student-info">

                        {/*查看学生详情*/}
                        { this.state.radioCheckedId && <Button className="show-detail" onClick={ this.showStudentDetail.bind(this) }>Show Detail</Button> }
                        <table className="mt-table">
                            <thead>
                                <tr>
                                    <th>&nbsp;</th>
                                    <th>Student</th>
                                    <th>Document Address</th>
                                    <th>Create Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                (studentList && studentList.length > 0) && studentList.map(student => {
                                    return <tr key={ student.id }>
                                        <td><Radio checked={ student.id === this.state.radioCheckedId ? true: false } onChange={ this.radioSelect.bind(this, student.id) }>&nbsp;</Radio></td>
                                        <td>{ student.userName }</td>
                                        <td>{ student.documentAddress }</td>
                                        <td>{ getDateStringFromUnix(student.createDate) }</td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>

                        {/* 加载更多按钮 */}
                        { pageInfo.morePage && <Button className="load-more-btn" onClick={ this.loadMore.bind(this, pageInfo.current++)}>Load More</Button> }
                    </Panel>

                    {/* 学生详情 */}
                    {
                        this.state.showDetailFlag &&  <Panel header={ studentName } className="student-detail">
                            <dl className="dl-horizontal">
                                <dt>Student Name</dt>
                                <dd>&nbsp;{ studentName }</dd>

                                <dt>Username</dt>
                                <dd>&nbsp;{ studentDetail.userName}</dd>

                                <dt>Age</dt>
                                <dd>&nbsp;{ studentDetail.age }</dd>

                                <dt>Address</dt>
                                <dd>&nbsp;{ studentDetail.address }</dd>

                                <dt>Major</dt>
                                <dd>&nbsp;{ studentDetail.major }</dd>

                                <dt>GPA</dt>
                                <dd>&nbsp;{ studentDetail.gpa }</dd>

                                <dt>Rank</dt>
                                <dd>&nbsp;{ studentDetail.rank }</dd>
                            </dl>

                        </Panel>
                    }

                </div>

            </div>
        </Frame>;
    }
}