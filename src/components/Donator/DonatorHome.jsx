import React, { Component } from 'react';
import Frame from '../../layouts/Frame';
import { fetchMyProjectList } from '../../services/donator';
import DonatorContentHeader from "../common/DonatorContentHeader";
import DonatorContentBody from "../common/DonatorContentBody";
import setBalance from '../../services/common';

export default class DonatorHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            myProjects: [],
            projectNum: 0
        }
    }

    componentDidMount() {
        this.getMyProjectList({ page: 0 })(this.successCallback.bind(this), this.errorCallback.bind(this));
        setBalance.call(this, 'donatorBalance');
    }

    // 获取我的项目列表
    getMyProjectList(param) {
        console.log('我的项目列表', param);
        return function(successCb, errorCb) {
            fetchMyProjectList(param).then((res) => {
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
        console.log('result', result);
        let content = result.content;
        if(content && content.length > 0) {
            this.setState({
                myProjects: content,
                projectNum: result.totalElements
            })
        }else {
            this.setState({
                myProjects: []
            })
        }
    }

    // 失败后的回调
    errorCallback(res) {
        if(res.info) {
            console.error('DONATOR-MYPROJECT:', res.info);
        }else {
            console.error('获取我的项目列表错误！');
        }
    }

    donateSuccessCb(index, totalDonation) {
        if(typeof index === 'number') {
            this.state.myProjects[index].totalDonation = totalDonation;

            this.setState({
                myProject: this.state.myProjects[index]
            }, () => {
                setBalance.call(this, 'donatorBalance');
            });
        }

    }

    render() {

        const optionInfo = {
            panelHeader: 'My Project',
            tableData: {
                tableHeader: [
                    {
                        name: 'Project Name'
                    },
                    {
                        name: 'Create Time',
                        order: true
                    },
                    {
                        name: 'Key Word'
                    },
                    {
                        name: 'Balance',
                        order: true
                    }
                ],
                tableBody: {
                    projectList: this.state.myProjects,
                    columnName: ['projectName', 'createDate', 'keyword', 'totalDonation']
                }
            },
            buttonName: 'Donate Again',
            balance: this.state.donatorBalance
        };

        const callback = {
            successCallback: this.successCallback.bind(this),
            errorCallback: this.errorCallback.bind(this),
            donateSuccessCb: this.donateSuccessCb.bind(this)  // 为项目捐赠成功后的回调
        };


        return <Frame headerTitle="MainPage">
                    <div className="donator-home">
                        {/*内容头部*/}
                        <DonatorContentHeader balance={ this.state.donatorBalance } projectNum={ this.state.projectNum }></DonatorContentHeader>

                        {/*内容体*/}
                        <DonatorContentBody { ...optionInfo } getProjectList={ this.getMyProjectList.bind(this) } callback={ callback }>
                        </DonatorContentBody>
                    </div>
        </Frame>;
    }
}