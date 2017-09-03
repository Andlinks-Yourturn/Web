/**
 * Created by zuilafeng on 2017/8/28.
 */
import render from 'react-dom';
import Routers from './routes/index';
import React from 'react';
import './app.scss';

render.render(<Routers />, document.getElementById('App'))