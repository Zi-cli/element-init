/*
 * @Description:
 * @Version: 1.0
 * @Autor: zx
 * @Date: 2021-03-01 17:49:12
 */
const path = require('path')
// const ip = require('address').ip()
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const productionGzipExtensions = ['js', 'css', 'png']
const Timestamp = new Date().getTime()

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    outputDir: 'dist', // 输出路径
    assetsDir: 'static', // 生成静态目录的文件夹
    runtimeCompiler: true, // 是否可以使用template模板
    parallel: require('os').cpus().length > 1, // 多余1核cpu时 启动并行压缩
    productionSourceMap: false, // 生产环境下 不使用soruceMap

    configureWebpack: { // webpack 配置
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
          filename: `[name].${Timestamp}.js`,
          chunkFilename: `[name].${Timestamp}.js`
        },
        plugins: [
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                // deleteOriginalAssets:true, //删除源文件，不建议
                threshold: 10240,
                minRatio: 0.8
            }),
            new CleanWebpackPlugin(['dist'])
        ]
      },
    chainWebpack: config => {
        // 控制webpack内部配置
        config.resolve.alias.set('components', path.resolve(__dirname, 'src/components'))
        config.resolve.alias.set('@', path.resolve(__dirname, './src'))
        config.resolve.alias.set('utils', path.resolve(__dirname, './src/utils'))
        config.resolve.alias.set('api', path.resolve(__dirname, './src/api'))
    },
    // https://github.com/survivejs/webpack-merge
    devServer: { // 配置代理
        port: 8090, // 端口号
        // host: '172.20.13.10',
        host: 'localhost',
        // host: ip,
        disableHostCheck: false,
        proxy: {
            '/api': {
                // target: 'http://172.20.13.59:8520/',
                // target: 'http://172.20.3.3:8520/',
                target: 'http://172.20.29.8:8888/',
                changeOrigin: true
            }
        }
    },
    pages: {
        index: { // 首页入口
            entry: './src/index.js'
        }
        // other: { // 其他页面入口
        //     entry: './src/a.js',`
        //     chunks:['other'] // 引入的资源
        // }
    },
    // 第三方插件配置
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                // 插入全局样式
                // path.resolve(__dirname, 'src/assets/common.less')
            ]
        }
    }
}
