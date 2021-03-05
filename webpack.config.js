//webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: './src/index.js', //webpack的默认配置,也可以是数组指定多个入口文件，或者是对象
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: 'bundle.[hash].js',// 加hash是考虑到cdn缓存问题
        publicPath: '/' //通常是CDN地址
    },
    mode: process.env.NODE_ENV, //可以将npx webpack --mode=development 是否可以将 mode 配置在 webpack.config.js，默认是production
    plugins: [
        //数组 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            minify: {
                removeAttributeQuotes: false, //是否删除属性的双引号
                collapseWhitespace: false, //是否折叠空白
            },
            config: config.template
            // hash: true //是否加上hash，默认是 false
        }),
        new webpack.HotModuleReplacementPlugin(), //热更新插件
        new CleanWebpackPlugin() // 每次打包前清空dist目录
    ],
    // webpack-dev-server配置
    devServer: {
        port: '3000', //默认是8080
        quiet: false, //默认不启用，启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台
        inline: true, //用于设置代码保存时是否自动刷新页面
        stats: "errors-only", //终端仅打印 error
        // overlay: false, //当出现编译器错误或警告时，在浏览器中显示全屏覆盖层。默认禁用
        // clientLogLevel: "silent", //日志等级
        // compress: true, //是否启用 gzip 压缩
        // openPage: '/different/page', //指定deserver 编译完成后自动打开的页面
        // https: true,//用于设置是否启用https
        //host: '0.0.0.0',// 用于指定devDerve使用的host。如果你希望服务器外部可以访问
        // headers: { // 在所有响应中添加首部内容
        //     'X-Custom-Foo': 'bar'
        //   },
        hot: true,// 热更新
        // 实现跨域
        proxy: {
            // "/api": "http://localhost:4000"
            '/api': { // server.js去前缀写法
                target: 'http://localhost:4000',
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    },
    // devtool: 'cheap-module', //开发环境下使用,方便浏览器控制台查看日志代码显示行号，还可以用'none' 'source-map'
    module: {
      rules: [
        //   {//实现index.html页面npm 的更新----没用                                                                      
        //     test: /\.(htm|html)$/,
        //     use: [
        //       'raw-loader'
        //     ]
        //   },
          {
              test: /\.jsx?$/,
            //   use: ['babel-loader'],
              use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: [
                        [
                            "@babel/plugin-transform-runtime",
                            {
                                "corejs": 3
                            }
                        ]
                    ]
                }
              },
              exclude: /node_modules/ //排除 node_modules 目录
          },
          {// less文件处理
            test: /\.(le|c)ss$/,
            use: ['style-loader', 'css-loader', {
                loader: 'postcss-loader',
                options: {
                    postcssOptions:{
                        plugins: function () {
                            return [
                                require('autoprefixer')({
                                    "overrideBrowserslist": [
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }   
                }
            }, 'less-loader'],
            exclude: /node_modules/
        },
        {//图片/字体文件处理
            test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 10240, //10K
                        esModule: false 
                    }
                }
            ],
            exclude: /node_modules/
        }
        // {// 
        //     test: /.html$/,
        //     use: 'html-withimg-loader'
        // }
      ]
      
  }
}