import React, { Component } from 'react';

export default class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-header"><i className={ `iconfont ${ this.props.iconClass}` }></i>{ this.props.title }</div>;
    }
}