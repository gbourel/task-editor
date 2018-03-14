var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env) {

    var vendor = [
        'babel-polyfill',
        'body-parser',
        'json-editor',
        'jquery',
        'tinymce',
        './node_modules/tinymce/plugins/textcolor/plugin.js',
        './node_modules/tinymce/plugins/colorpicker/plugin.js',
        './node_modules/tinymce/plugins/table/plugin.js',
        './node_modules/tinymce/plugins/bbcode/plugin.js',
        './node_modules/tinymce/plugins/lists/plugin.js',
        './node_modules/tinymce/plugins/fullscreen/plugin.js',
        './node_modules/tinymce/plugins/link/plugin.js',
        'react',
        'react-bootstrap',
        'react-dom',
        'react-redux',
        'redux',
        'redux-saga',
        './client/assets/index.js'
    ]

    var plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        new webpack.ProvidePlugin({
            //$: "jquery",
            //jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ];

    var production = process.env.NODE_ENV === 'production';

    if(production) {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
        )
        plugins.push(
            new UglifyJSPlugin({
                sourceMap: true
            })
        )
    }

    return {
        devtool: production ? 'none' : 'cheap-module-source-map',
        entry: {
            app: './client/src/app.js',
            vendor: vendor
        },
        watchOptions: {
            ignored: [
                /node_modules/
            ],
        },
        output: {
            path: path.resolve(__dirname, 'server/public'),
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'es2015', 'stage-1']
                        }
                    }
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.(css)$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    loader: 'file-loader?name=images/[name].[ext]'
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    loader: 'file-loader?name=fonts/[name].[ext]'
                }
            ],
        },
        plugins
    }

};