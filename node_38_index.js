function NSLog(loli,needLogo=true) {console.log(loli);if(needLogo){console.log('\nCopyright © 2018 Powered by beyond')};}  


// 导入框架
var express = require('express')
// 创建服务器对象
var appServer = express()
// 监听端口,并启动服务
appServer.listen(5267,function (error) {
	if (error) {
		return NSLog('启动失败: ' + error)
	}
	NSLog('服务启动成功')
})
// -----------------------------------

// 静态资源请求时的 staticFileUrlPrefix
var staticFileUrlPrefix = '/public/'
// var staticFileUrlPrefix = '/public'

// 访问也只能使用 localhost:5267/public/img/beyond.jpg
// 磁盘上的静态资源目录
var staticFilePath = './public/'   
// var staticFilePath = 'public' 

var callbackFunction = express.static(staticFilePath)
appServer.use(staticFileUrlPrefix,callbackFunction)

// -----------------------------------

// 指明:对于 所有后缀为html 的模板文件 使用模板引擎
var templateFileSuffix = 'html'
appServer.engine(templateFileSuffix,require('express-art-template'))
// 下面这一句参数配置,可有可无
appServer.set('view options',{
	debug: process.env.NODE_ENV !== 'production'
})
// 注意:如果不想把模板文件放在默认的views目录下,则可以通过下面代码更改设置
// appServer.set('views','其他目录')

// -----------------------------------
// 使用middleware中间件body-parser进行post请求体中数据解析
var bodyParser = require('body-parser')
// 设置解析 application/x-www-form-urlencoded
appServer.use(bodyParser.urlencoded({extended: false}))        
// 设置解析 application/json
appServer.use(bodyParser.json())
// -----------------------------------
// 自定义路由设计的目的是:
// 1.让主入口程序的职责更加单一,代码更加简洁
//     1.1 创建服务
//     1.2 做一些服务相关的配置,比如:
//           1.2.1 静态资源配置
//           1.2.2 模板引擎配置
//           1.2.3 body-parse 解析表单
//           1.2.4 挂载自定义路由
//           1.2.5 监听端口,启动服务
// 使用自定义的路由模块 必须使用./
// 注意: 配置模板引擎和body-parser, 一定要在挂载路由之前
var beyondRouter = require('./node_38_router')
appServer.use(beyondRouter)