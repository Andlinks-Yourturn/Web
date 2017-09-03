import React from 'react';
import { Router, Route, IndexRoute, hashHistory, IndexRedirect } from 'react-router';

import App from '../views/App';
import LoginIndex from '../views/Login';
import RegisterIndex from '../views/Register';
import Donator from '../views/Donator';
import Teacher from '../views/Teacher';
import Student from '../views/Student';
import ProjectInfoInput from '../components/Donator/ProjectInfoInput';
import DonatorHome from '../components/Donator/DonatorHome';
import StudentInfoInput from '../components/Student/StudentInfoInput';
import StudentHome from '../components/Student/StudentHome';
import TeacherHome from '../components/Teacher/TeacherHome';
import DonatorProjects from '../components/Donator/DonatorProjects';
import StudentProjects from '../components/Student/StudentProjects';
import TeacherStudents from '../components/Teacher/TeacherStudents';
import { getLocal, clearLocal } from '../utils/storage';
import { Tip } from 'mtui/index';



const Routes = React.createClass({

    routerInPath: '',   // 进来路径地址

    clear() {
        clearLocal();
    },

    enterPath(nextState, replaceState) {

        document.body.scrollTop = 0;
        let userInfo = getLocal('userInfo');

        // 用户没有登录，则跳到登录页面
        if(!userInfo) {
            hashHistory.push('/login');
            return;
        }

        if(userInfo.userType === 'donor') {
            userInfo.userType = 'donator';
        }

        // 判断该用户是否有权限进入该页面
        if(!nextState.location.pathname.includes(userInfo.userType)) {
            Tip.error('You don\'t have the permission to enter that page');
            replaceState(this.routerInPath);
            return;
        }

        this.routerInPath = nextState.location.pathname;
    },

    render() {
        return <Router history={ hashHistory }>
            <Route path="/" component={ App } onEnter={ this.clear }>
                <IndexRoute component={ LoginIndex } />
                <Route path="login" component={ LoginIndex } onEnter={ this.clear } />
                <Route path="register" component={ RegisterIndex } />
                <Route path="donator" component={ Donator } onEnter={ this.enterPath } >
                    <IndexRedirect to="/donator/home" />
                    <Route path="home" component={ DonatorHome } onEnter={ this.enterPath } ></Route>
                    <Route path="addProject" component={ ProjectInfoInput } onEnter={ this.enterPath } ></Route>
                    <Route path="projects" component={ DonatorProjects } onEnter={ this.enterPath } ></Route>
                </Route>
                <Route path="teacher" component={ Teacher } onEnter={ this.enterPath } >
                    <IndexRedirect to="/teacher/home" />
                    <Route path="home" component={ TeacherHome } onEnter={ this.enterPath } ></Route>
                    <Route path="students" component={ TeacherStudents } onEnter={ this.enterPath } ></Route>
                    <Route path="addStudent" component={ StudentInfoInput } onEnter={ this.enterPath } ></Route>
                </Route>
                <Route path="student" component={ Student } onEnter={ this.enterPath } >
                    <IndexRedirect to="/student/home" />
                    <Route path="home" component={ StudentHome } onEnter={ this.enterPath } ></Route>
                    <Route path="projects" component={ StudentProjects } onEnter={ this.enterPath } ></Route>
                </Route>
            </Route>
        </Router>
    }
});

export default Routes;
