import React, { Component } from 'react';
import setBalance from '../../services/common';
import '../../styles/student_content.scss';

export default class StudentContentHeader extends Component{

    constructor(props) {
        super(props);
        this.state = {
            studentBalance: 0
        };
    }

    componentDidMount() {
        setBalance.call(this, 'studentBalance');
    }

    render() {
        return <div className="student-content-header">
                {/*项目数量*/}
                <div className="project-num-box">
                    Project
                    <span className="project-num">
                        { this.props.projectNum || 0 }
                    </span>
                </div>

                {/*总受益额*/}
                <div className="total-benefit-box">
                    Total Benefit
                    <span className="benefit-money">
                        { this.state.studentBalance }
                    </span>
                </div>

                {/*搜索项目*/}
                <div className="search-project-btn">
                    Search Project
                    <span className="search-project"></span>
                </div>
        </div>;
    }
}