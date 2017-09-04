import React, { Component } from 'react';
import { Button, Dropdown, Modal, Input } from 'mtui/index';
import { recharge } from '../../services/donator';
import { setBalance } from '../../services/common';
import '../../styles/donator_content.scss';


export default class DonatorContentHeader extends Component{

    constructor(props) {
        super(props);

        this.state = {
            myProjectList: [],
            rechargeFormData: {

            },
            donatorBalance: props.balance
        }

        this.inputChange = this.inputChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.balance !== this.props.balance) {
            this.setState({
                donatorBalance: nextProps.balance
            });
        }
    }

    inputChange(e, name) {
        this.setState({
            rechargeFormData: Object.assign(this.state.rechargeFormData, {[name]: e.target.value})
        })
    }

    // 打开再次捐赠
    showRechargeModal(refName) {
        this.setState({
            rechargeFormData: {}
        });

        this.refs[refName].showModal(true);
    }

    // 充值
    rechargeSubmit(refName) {
        recharge(this.state.rechargeFormData)
            .then(res => {
                if(res.status === 'SUCCESS' && res.result) {
                    // 更新账户余额数字
                    setBalance.call(this, 'donatorBalance');
                    this.refs[refName].showModal(false);
                }

                if(res.status === 'ERROR') {
                    if(res.info) {
                        console.error('RECHARGE-UPDATE', res.info);
                    }else {
                        console.error('充值错误！');
                    }
                }
            });
    }


    render() {
        return <div className="donator-content-header">
            {/*创建项目按钮*/}
            <div className="create-btn">
                <Button href="#/donator/addProject">Create</Button>
            </div>

            {/*项目数量*/}
            <div className="project-num-box">
                Project
                <span className="project-num">
                    { this.props.projectNum }
                </span>
            </div>

            {/*账户余额*/}
            <div className="donator-balance-box">
                <Dropdown btn={<a className="more-menu"><i></i></a>} trigger="click" style={{ width: 85}}>
                    <Button className="recharge-btn" dom="button"  onClick={ () => this.showRechargeModal('recharge') }>Recharge</Button>
                </Dropdown>
                Balance
                <span className="donator-money">
                    { this.state.donatorBalance }
                </span>
            </div>

            {/*搜索项目*/}
            <div className="search-project-btn">
                Search Project
                <span className="search-project"></span>
            </div>


            {/*充值*/}
            <Modal ref="recharge" modalClassName="animated bounceInDown" style={{width:608, height: 280}} className="recharge-modal">
                <div className="mt-panel-min">
                    <div className="panel-header">
                        <h3>Recharge</h3>
                    </div>
                    <div className="panel-body">
                        <Input name="amount" placeholder="Amount" onChange={ (e) => this.inputChange(e, 'amount')}/>
                            <Input name="password" placeholder="Password" type="password" onChange={ (e) => this.inputChange(e, 'password')}/>

                        <Button className="sure-recharge-btn" onClick={ this.rechargeSubmit.bind(this, 'recharge') }>Recharge</Button>
                    </div>
                </div>
            </Modal>
        </div>;
    }
}