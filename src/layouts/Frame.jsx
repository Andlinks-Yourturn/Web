import React, { Component } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default class Frame extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-frame">

            <section className="left-box">
                <Sidebar />
            </section>

            <section className="right-box">
                <Header title={ this.props.headerTitle } />
                <div className="content-box">
                    {
                        this.props.children
                    }
                </div>
            </section>

        </div>;
    }
}