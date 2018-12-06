致命缺点
打包结果体积大、构建过程时间长

webpack 优化点
1、 文件压缩（css, js, html, 字体文件， 图片文件）
2、 babel-loader 避免不必要的转义
3、 babel-转义结果进行缓存
4、 公共模块的提取(提取公用模块会进行浏览器缓存)
    vender(第三方的模块引用),
    mainfest(manifest则是在vendor的基础上，再抽取出要经常变动的部分，比如关于异步加载js模块部分的内容),
    app 业务代码
5、 loader 转为多进程
6、 按需加载
7、 Gzip进行文件压缩，webpack压缩文件，后台可以再次进行压缩
