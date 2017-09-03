
import React, { Component } from 'react';

export default class Student extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-student">
            {
                this.props.children
            }

        </div>;
    }
}