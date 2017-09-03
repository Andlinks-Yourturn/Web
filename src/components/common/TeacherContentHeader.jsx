import React, { Component } from 'react';
import '../../styles/teacher_content.scss';
import { Button } from 'mtui/index';

export default class TeacherContentHeader extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="teacher-content-header">
                    {/* 创建学生按钮 */}
                    <div className="create-btn">
                        <Button href="#/teacher/addStudent">New</Button>
                    </div>

                    {/* 学生数量 */}
                    <div className="student-num-box">
                        Total Student
                        <span className="student-num">
                            { this.props.projectNum }
                        </span>
                    </div>

                    {/* IPFS Status */}
                    <div className="ipfs-status-box">
                        IPFS Status
                        <span className="ipfs-status">
                            Good
                        </span>
                    </div>

                    {/*搜索项目*/}
                    <div className="ipfs-btn">
                        IPFS
                        <span className="ipfs-search"></span>
                    </div>
        </div>;
    }
}