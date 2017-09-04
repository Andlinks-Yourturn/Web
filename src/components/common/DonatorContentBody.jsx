import React, { Component } from 'react';
import { Button, Panel, Input, Modal, Radio, PageList } from 'mtui/index';
import { getDateStringFromUnix } from '../../utils/util';
import { donateForProject, fetchBenefit } from '../../services/donator';
import { goToPage } from '../../services/common';

export default class DonatorContentBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedProject: null,       // 已经选择项目
            showProjectMore: false,     // 显示更多项目
            projectBenefits: null,      // 项目受益者
            formData: {},               // 表单数据
            selectedIndex: null,        // 选择的项目下标
            isAsc: true                 // 是否是升序，默认是升序
        }

        this.inputChange = this.inputChange.bind(this);
        this.searchProjectList = this.searchProjectList.bind(this);

        this.queryParam = { page: 1 };            // 查询参数
        this.callback = this.props.callback;  // 回调函数
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
    radioCheck(project, index ) {
        this.selectedIndex = index;
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
                if(res && res.status === 'SUCCESS' && res.result) {
                    this.refs['donateAgain'].showModal(false);
                    if(res.result) {
                        this.props.callback.donateSuccessCb(this.selectedIndex, res.result.totalDonation);
                    }
                }

                if(res.status === 'ERROR') {
                    if(res.info) {
                        console.error('DONATEMONEY-FORPOJECT:', res.info);
                    }else {
                        console.error('为项目捐款错误！');
                    }
                }
            })
        }

    }

    // 显示跟项目有关信息
    showProjectMore() {
        if(this.state.checkedProject.id) {
            this.setState({
                showProjectMore: true
            }, () => {
                // 显示受益者

                fetchBenefit({ id: this.state.checkedProject.id}).then(res => {
                    if(res && res.status === 'SUCCESS' && res.result) {
                        this.setState({
                            projectBenefits: res.result || []
                        });
                    }
                })
            });
        }
    }

    // 按关键字搜索
    searchProjectList() {

        if(this.searchText === undefined && this.queryParam.hasOwnProperty('input')) {
            delete this.queryParam.input;
        }else {
            this.queryParam.input = this.searchText;
        }
        this.props.getProjectList(this.queryParam)(this.callback.successCallback, this.callback.errorCallback);
    }

    // 根据时间或项目金额排序列表
    sortProjectBy(sortKeyword, sortDirection) {

        if(this.searchText !== undefined && this.searchText.trim() !== '') {
            this.queryParam.input = this.searchText;
        }

        if(sortDirection && sortKeyword) {
            this.queryParam.sort = sortKeyword + ',' + sortDirection;
        }

        this.setState({
            isAsc: !this.state.isAsc
        });

        this.props.getProjectList(this.queryParam)(this.callback.successCallback, this.callback.errorCallback);
    }

    // 分页跳转
    goToPage(pageInfo) {

        if(pageInfo) {
            goToPage.apply(this, [pageInfo, this.props.getProjectList])(this.queryParam, this.callback.successCallback, this.callback.errorCallback );
        }
    }

    render() {

        const { panelHeader, tableData, buttonName, balance, projectNum } = this.props;
        const { tableHeader, tableBody } = tableData;
        const { projectList, columnName } = tableBody;

        const projectCriteria = this.state.checkedProject;
        const projectBenefits = this.state.projectBenefits;

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
                                    if(columnName.sort) {
                                        return <th key={ index }><div className="sort-box" onClick={ this.sortProjectBy.bind(this, columnName.sortValue, this.state.isAsc ? 'asc' : 'desc')}>{ columnName.name }{ columnName.sort && <i className="sort-icon"></i>}</div></th>;
                                    }
                                    return <th key={ index }>{ columnName.name }</th>;
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (projectList && projectList.length > 0) && projectList.map((project, index) => {
                                return <tr key={ project.id }>
                                        <td><Radio checked={ (this.state.checkedProject && this.state.checkedProject.id === project.id)? true: false} onChange={ this.radioCheck.bind(this, project, index ) }>&nbsp;</Radio></td>
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
                <PageList current={1} pageSize={10} callback={ this.goToPage.bind(this) } total={ projectNum }/>
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
                    <Panel className="project-benefit" header="Benefit">
                        <ul>
                            {
                                (projectBenefits && projectBenefits.length > 0) && projectBenefits.map((projectBenefit, index) => {
                                return <li key={ index }>{ projectBenefit.userName }</li>
                                })
                            }
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
                        <Input name="amount" placeholder="(份数)" type="text" onChange={ (e) => this.inputChange(e, 'amount') } value={ this.state.formData.amount || '' }/>
                        <Input name="password" placeholder="Password" type="password" onChange={ (e) => this.inputChange(e, 'password') } value={ this.state.formData.password || ''}/>

                        <Button className="donate-btn" onClick={ this.donateMoney.bind(this) }>Donate</Button>
                    </div>
                </div>
            </Modal>
        </div>;
    }
}