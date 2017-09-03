import React, { Component } from 'react';
import { Link } from 'react-router';
import { getLocal } from '../utils/storage';
import userAvatar from '../assets/images/head_avatar.jpg';

export default class extends Component {

    constructor(props) {
        super(props);
        this.loginedUser = getLocal('userInfo');
        if(this.loginedUser.userType === 'donor') {
            this.loginedUser.userType = 'donator';
        }

        this.navList = [
            {
                name: 'Main Page',
                icon: 'icon-homepage',
                permission: 'all',
                to: 'home'
            },
            {
                name: 'Project Info',
                icon: 'icon-project',
                permission: 'donator,student',
                to: 'projects'
            },
            {
                name: 'Student Info',
                icon: 'icon-student',
                permission: 'teacher',
                to: 'students'
            },
            {
                name: 'Setting',
                icon: 'icon-setting',
                permission: 'all',
                to: 'setting'
            }
        ];
    }

    componentWillMount() {

        this.navList = this.navList.filter((navItem) => {
            return navItem.permission.includes(this.loginedUser.userType) || navItem.permission === 'all';
        }).map((navItem) => {
            navItem.to = `/${this.loginedUser.userType}/${navItem.to}`;
            return navItem;
        });
    }

    render() {

        return (<div className="app-sidebar">
            <div className="logo"><a href="">YOURTURN</a></div>
            <div className="avatar-container">
                <div className="header-circle">
                    <img src={ userAvatar } alt="用户头像"/>
                </div>

                <div className="user-box">
                    <span>{ this.loginedUser.userName }</span>
                    <span className="user-identity">{ this.loginedUser.userType }</span>
                </div>
            </div>
            <div className="navlist">
                <ul>
                    {
                        (this.navList && this.navList.length > 0) && this.navList.map((navItem, index) => {
                            return <li key={ index }><Link to={ navItem.to } activeClassName="active"><i className={ `iconfont ${ navItem.icon }`}></i>{ navItem.name }</Link></li>;
                        })
                    }
                </ul>
            </div>
        </div>);
    }
}