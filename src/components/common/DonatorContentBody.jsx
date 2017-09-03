import React, { Component } from 'react';
import { Button, Panel, Input, Modal, Radio, PageList } from 'mtui/index';
import { getDateStringFromUnix } from '../../utils/util';
import { donateForProject } from '../../services/donator';

export default class DonatorContentBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedProject: null,
            showProjectMore: false
        }

        this.inputChange = this.inputChange.bind(this);
        this.searchProjectList = this.searchProjectList.bind(this);
    }

    // 输入改变
    inputChange(e, name) {
        this.setState({
            formData: Object.assign(this.state.formData, {[name]: e.target.value})
        })
    }

    // 打开再次捐赠
    showDonateModal(refName) {
        this.setState({
            formData: {}
        });

        this.refs[refName].showModal(true);
    }

    // 项目单选
    radioCheck(project) {
        this.setState({
            checkedProject: project
        });
    }

    // 为项目捐钱
    donateMoney() {
        if(this.state.checkedProject.id) {
            donateForProject(Object.assign({
                id: this.state.checkedProject.id,
                balance: this.props.balance
            }, this.state.formData)).then((res) => {
                console.log('res:', res);
            })
        }

    }

    // 显示跟项目有关信息
    showProjectMore() {
        if(this.state.checkedProject.id) {
            this.setState({
                showProjectMore: true
            });
        }
    }

    // 按关键字搜索
    searchProjectList() {
        const callback  = this.props.callback;
        if(this.searchText) {
            this.props.getProjectList({ input: this.searchText })(callback.successCallback, callback.errorCallback);
        }
    }

    render() {

        const { panelHeader, tableData, buttonName, balance } = this.props;
        const { tableHeader, tableBody } = tableData;
        const { projectList, columnName } = tableBody;

        const projectCriteria = this.state.checkedProject;

        return <div className="donator-content-body">
            {/* 项目列表 */}
            <Panel header={ panelHeader } className="project-info">
                {/*搜索*/}
                <Input placeholder="Search" onChange={ (e) => { this.searchText = e.target.value;} }  prefix={ <i className="iconfont icon-search" onClick={ this.searchProjectList } style={{ cursor: "pointer"}}></i> }/>
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
                            (projectList && projectList.length > 0) && projectList.map((project) => {
                                return <tr key={ project.id }>
                                        <td><Radio checked={ (this.state.checkedProject && this.state.checkedProject.id === project.id)? true: false} onChange={ this.radioCheck.bind(this, project ) }>&nbsp;</Radio></td>
                                        {
                                            (columnName && columnName.length > 0) && columnName.map((column, index) => {
                                                let deep = null;
                                                if( column.includes('-')) {
                                                    deep = column.split('-');
                                                    return <td key={ index }>{ project[deep[0]][deep[1]]}</td>;
                                                } else {
                                                    if(column === 'createDate') {
                                                        return  <td key={ index }>{ getDateStringFromUnix(project[column])}</td>;
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
                this.state.checkedProject &&  <Button className="donate-btn" onClick={ () => this.showDonateModal('donateAgain') }>{ buttonName }</Button>
            }

            {
                this.state.checkedProject && <Button className="show-project-more" onClick={ this.showProjectMore.bind(this) }>Show More</Button>
            }


            {/* 项目条件和项目受益人显示 */}
            {
                this.state.showProjectMore && <div className="project-box">
                    <Panel className="project-criteria" header="Criteria Document">
                        <table className="mt-table">
                            <thead>
                            <tr>
                                <th>
                                    Age Max
                                </th>
                                <th>
                                    Major
                                </th>
                                <th>
                                    Min GPA
                                </th>
                                <th>
                                    Rank
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{ projectCriteria.maxAge }</td>
                                    <td>{ projectCriteria.major }</td>
                                    <td>{ projectCriteria.minGPA }</td>
                                    <td>{ projectCriteria.rank }</td>
                                </tr>
                            </tbody>
                        </table>
                    </Panel>
                    <Panel className="project-benefit" header="Benifit">
                        <ul>
                            {/*{*/}
                            {/*(projectRelation && projectRelation.projectBenefit) && projectRelation.projectBenefit.map((projectBenefit, index) => {*/}
                            {/*return <li key={ index }>{ projectBenefit.name }</li>*/}
                            {/*})*/}
                            {/*}*/}
                        </ul>
                    </Panel>
                </div>
            }

            {/* 再次捐款 */}
            <Modal ref="donateAgain" modalClassName="animated bounceInDown" style={{width:608, height:375}} className="donate-again-modal">
                <div className="mt-panel-min">
                    <div className="panel-header">
                        <h3>Make A Donation</h3>
                    </div>
                    <div className="panel-body">
                        <Input name="projectName" disabled="true" value={ this.state.checkedProject ? this.state.checkedProject.projectName : ''}/>
                        <Input name="myBalance" disabled="true" value={ `余额:${balance || 0}` }/>
                        <Input name="amount" placeholder="Amount" type="text" onChange={ (e) => this.inputChange(e, 'amount') }/>
                        <Input name="password" placeholder="Password" type="password" onChange={ (e) => this.inputChange(e, 'password') }/>

                        <Button className="donate-btn" onClick={ this.donateMoney.bind(this) }>Donate</Button>
                    </div>
                </div>
            </Modal>
        </div>;
    }
}