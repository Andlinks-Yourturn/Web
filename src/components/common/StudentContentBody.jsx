import React, { Component } from 'react';
import { Button, Panel, Radio, PageList } from 'mtui/index';
import { getDateStringFromUnix } from '../../utils/util';
import '../../styles/student_content.scss';

export default class StudentContentBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            radioCheckedIndex: null,
            showCriteria: false,
            projectCriteria: {},         // 项目的评判标准
        }
    }

    radioCheck(index) {
        this.setState({
            radioCheckedIndex: index
        });
    }

    showCriteria() {

        if(this.props.setProjectId && typeof this.state.radioCheckedIndex === 'number') {
            this.props.setProjectId(this.state.radioCheckedIndex);
        }

        this.setState({
            showCriteria: true
        },() => {
            this.props.showCriteriaData(this.state.radioCheckedIndex);
        });
    }

    render() {

        const { panelHeader, tableData, buttonName } = this.props;
        const { tableHeader, tableBody } = tableData;
        const { projectList, columnName } = tableBody;

        return <div className="student-content-body">
            {/* 项目列表 */}
            <Panel header={ panelHeader } className="project-info">
                {/*查看条件*/}
                {
                    this.state.radioCheckedIndex !== null && <Button className="check-condition" onClick={ this.showCriteria.bind(this) }>{ buttonName }</Button>
                }
                <table className="mt-table">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            {
                                (tableHeader && tableHeader.length > 0) && tableHeader.map((columnName, index) => {
                                    return <th key={ index }>{ columnName.name }</th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (projectList && projectList.length > 0) && projectList.map((project, index) => {
                                return <tr key={ index }>
                                        <td><Radio checked={ this.state.radioCheckedIndex === index ? true: false} onChange={ this.radioCheck.bind(this, index) }>&nbsp;</Radio></td>
                                        {
                                            (columnName && columnName.length > 0) && columnName.map((column, index) => {
                                                let deep = null;
                                                if( column.includes('-')) {
                                                    deep = column.split('-');
                                                    return <td key={ index }>{ project[deep[0]][deep[1]]}</td>;
                                                } else {
                                                    if(column === 'verifyPassTime' || column === 'createDate') {
                                                        return  <td key={ index }>{ project[column] ? getDateStringFromUnix(project[column]) : ''}</td>;
                                                    }
                                                    return <td key={ index }>{ project[column]}</td>;
                                                }
                                            })
                                        }
                                    </tr>;
                            })
                        }
                    </tbody>
                </table>

                {/*分页*/}
                {/*<PageList ref={ (c) => { this.refsPageList = c; }} current={1} pageSize={10} callback={this.callback} total={this.state.total}/>*/}
            </Panel>

            {
                this.state.showCriteria && this.props.children
            }

        </div>;
    }
}