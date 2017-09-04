import React, { Component } from 'react';
import Frame from '../../layouts/Frame';
import DonatorContentHeader from "../common/DonatorContentHeader";
import DonatorContentBody from "../common/DonatorContentBody";
import { fetchAllProjectList } from '../../services/donator';
import { setBalance } from '../../services/common';

export default class DonatorProjects extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allProjects: [],
            projectNum: 0
        }
    }


    componentDidMount() {
        this.getAllProjectList({ page: 0 })(this.successCallback.bind(this), this.errorCallback.bind(this));
        setBalance.call(this, 'donatorBalance');
    }

    // 获取所有项目列表
    getAllProjectList(param) {
        return function(successCb, errorCb) {
            fetchAllProjectList(param).then((res) => {
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
                allProjects: content,
                projectNum: result.totalElements
            })
        }else {
            this.setState({
                allProjects: []
            })
        }
    }

    // 失败后的回调
    errorCallback(res) {
        if(res.info) {
            console.error('DONATOR-ALLPROJECT:', res.info);
        }else {
            console.error('获取所有项目列表错误！');
        }
    }


    donateSuccessCb(index, totalDonation) {
        if(typeof index === 'number') {
            this.state.allProjects[index].totalDonation = totalDonation;
            this.setState({
                allProjects: this.state.allProjects[index]
            });
        }

    }

    render() {

        const optionInfo = {
            panelHeader: 'Project Information',
            tableData: {
                tableHeader: [
                    {
                        name: 'Project Name'
                    },
                    {
                        name: 'Creator'
                    },
                    {
                        name: 'Create Time',
                        sort: true,
                        sortValue: 'createDate'
                    },
                    {
                        name: 'Key Word'
                    },
                    {
                        name: 'Balance',
                        sort: true,
                        sortValue: 'totalDonation'
                    }
                ],
                tableBody: {
                    projectList: this.state.allProjects,
                    columnName: ['projectName', 'creator-userName', 'createDate', 'keyword', 'totalDonation']
                }
            },
            buttonName: 'Donate',
            balance: this.state.donatorBalance,
            projectNum: this.state.projectNum
        };

        const callback = {
            successCallback: this.successCallback.bind(this),
            errorCallback: this.errorCallback.bind(this),
            donateSuccessCb: this.donateSuccessCb.bind(this)  // 为项目捐赠成功后的回调
        };

        return <Frame headerTitle="Project Info" iconClass="icon-project">
            <div className="donator-projects">
                {/*内容头部*/}
                <DonatorContentHeader balance={ this.state.donatorBalance } projectNum={ this.state.projectNum }/>

                {/*内容体*/}
                <DonatorContentBody { ...optionInfo } getProjectList= { this.getAllProjectList.bind(this) } callback={ callback } />
            </div>
        </Frame>;
    }
}