/**
 * Created by zuilafeng on 2017/8/28.
 */
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const WebpackDevServer = require('webpack-dev-server');

new WebpackDevServer(webpack(config), {
    contentBase: config.output.path,
    publicPath: config.output.publicPath,
    hot: true,
    inline: true,
    historyApiFallback: true,
    proxy: {
        "/api/*": "http://192.168.1.22:8855"
    }
}).listen(9000, '127.0.0.1', function(err, result) {
    if(err) {
        return console.log('服务器出错', err);
    }

    console.log('Listening at http://127.0.0.1:9000/')
});