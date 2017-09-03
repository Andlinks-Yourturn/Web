import React, { Component } from 'react';

export default class Donator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-donator">
            {
                this.props.children
            }
        </div>;
    }
}