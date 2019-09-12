const path = require('path')

module.exports = {
    // 修改 src 目录 为 examples 目录
    pages: {
        index: {
            entry: 'examples/main.ts'
        }
    },
    chainWebpack: config => {
        // @ 默认指向 src 目录，这里要改成 examples
        // 另外也可以新增一个 ~ 指向 packages
        config.resolve.alias
            .set('@', path.resolve('examples'))
            .set('~', path.resolve('packages'))

        // 把 packages 和 examples 加入编译，因为新增的文件默认是不被 webpack 处理的
        config.module
            .rule('ts')
            .include.add(/packages/).end()
            .include.add(/examples/).end()
            // .use('babel')
            // .loader('babel-loader')
            // .tap(options => {
            //     // 修改它的选项...
            //     return options
            // })

        // config.module
        //     .rule('md')            
        //     .include.add(/examples/).end()
        //     .use('babel')
        //     .loader('babel-loader')
    }
}