const path = require('path')

module.exports = {
    pages: {
        index: {
            entry: 'examples/main.ts'
        }
    },
    chainWebpack: config => {
        // @ 默认指向 examples 目录
        // @ 默认指向 packages 目录
        config.resolve.alias
            .set('@', path.resolve('examples'))
            .set('~', path.resolve('packages'))

        // 把 packages 和 examples 加入编译
        config.module
            .rule('ts')
            .include.add(/packages/).end()
            .include.add(/examples/).end()

        // config.module
        //     .rule('md')            
        //     .include.add(/examples/).end()
        //     .use('babel')
        //     .loader('babel-loader')
    }
}