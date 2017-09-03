
import React, { Component } from 'react';

export default class Teacher extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-teacher">
            {
                this.props.children
            }
        </div>;
    }
}