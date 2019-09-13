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
            
        config.module
            .rule('js')
            .include.add(/src/).end()

        config.module
            .rule('md')
            .test(/\.md$/)
            .include.add(/examples/).end()
            .use('vue')
            .loader('vue-loader')
            .options({
                preserveWhitespace:true
            }).end()

        config.module
            .rule('md')
            .use('custom')
            .loader(path.resolve('build', './md-loader/index.js')).end()
    }
}