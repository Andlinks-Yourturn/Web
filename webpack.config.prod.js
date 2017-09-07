/**
 * Created by zuilafeng on 2017/8/28.
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');  // 清除文件
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    // 页面入口文件配置
    entry: {
        app: [
            './src/index'
        ],
        vendors: ['react', 'react-dom', 'react-router']
    },
    // 入口文件的输出配置
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: 'js/[name].bundle.js'
    },

    // require 的时候，可以不用写文件类型
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.less', '.scss']
    },
    module: {
        //加载器配置
        //凡是.js结尾的文件都是用babel-loader做处理，而.jsx结尾的文件会先经过jsx-loader处理，然后经过babel-loader处理
        // 在这里添加 react-hot，注意这里使用的是loaders，所以不能用 query，应该把presets参数写在 babel 的后面
        loaders: [
            {
                test: /\.jsx?/,
                exclude: /(node_modules)/,
                loader: ['react-hot-loader', 'babel-loader?presets[]=react,presets[]=es2015']
            },
            {
                test: /\.(woff|eot|ttf)$/i,
                loader: 'url-loader?limit=10000&name=fonts/[hash:8].[name].[ext]'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use:'css-loader!sass-loader'})
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                include: path.join(__dirname, 'src/assets/images'),
                loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new HtmlWebpackPlugin({
            title: 'yourturn',
            template:'./src/index.html', //html模板路径
            filename: 'index.html',
            inject:true,  //允许插件修改哪些内容，包括head与body
            hash:false //为静态资源生成hash值
        }),//添加我们的插件 会自动生成一个html文件

        new CopyWebpackPlugin([{
            context: './src/assets',
            from: 'fonts',
            to: 'fonts/'
        }]),

        // 提取css
        new ExtractTextPlugin("style.[hash].css"),
        new webpack.optimize.UglifyJsPlugin({    // 压缩混淆js文件
            sourceMap: true
        }),
        new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'js/vendors.bundle.js'}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), //development,production
            __DEV__: false
        })
    ]
}