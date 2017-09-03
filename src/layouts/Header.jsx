import React, { Component } from 'react';

export default class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-header">{ this.props.title }</div>;
    }
}