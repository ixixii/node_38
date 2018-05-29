function NSLog(loli) {console.log(loli);return 'Copyright © 2018 Powered by beyond';};  
/*
	自定义路由模块的职责是:
		专门处理所有的路由
		根据不同的请求方式和路径,采取相应的处理方法
*/ 
// express 专门提供了路由的处理方法
var express = require('express')
// 1.使用express专门提供的路由器处理路由
var router = express.Router()

// ----------------引入dao模块-------------------
// 先对dao初始化
var poolDao = require('./node_38_dao')
// 时间格式化
var BeyondDateFormatFunction = require('./BeyondDateFormat')

// ----------------首页-------------------
router.get('/',function (request,response) {
	// 至于请求参数可以这样:
	// var queryObj = request.query

	// ----------------查找所有------------------
	var sql = 'select _id,girlName,girlAge,girlDescription,pubTime from girls'
	poolDao.query(sql,function (error,results,fields) {
		if(error){
			return response.send(error)
		}
		// 使用模板引擎渲染
		// 注意: 模板文件默认是放在views目录下
		// 为此,我们在views目录下  分别为不同的业务模块创建了不同的文件夹
		// 如 login登录 admin后台管理 index前台首页 article文章 comment评论
		response.render('index/node_38_index.html',{girlArr:results})
	})
	// 无需关闭,查询完毕会自动进行连接池 pool

})

// ----------------添加的表单页面-------------------
router.get('/add',function (request,response) {
	response.render('index/node_38_add.html')
})


// ----------------增加一条记录-------------------
router.post('/insert',function (request,response) {
	// 1.body-parser得到obj
	var girlObj = request.body
	// 1.调用girlDao写到文件数据库
	girlObj.pubTime = BeyondDateFormatFunction(new Date(),'yyyy-MM-dd')
	// 2.保存到数据库
	// 如果不指定字段名,则每一个都要填写值(主键可以用null代替)
	var sql = 'insert into girls values(null,?,?,?,?)'
	var queryObj = {
				'sql': sql,
				timeout: 6000,
				values: [girlObj.girlName,girlObj.girlAge,girlObj.girlDescription,girlObj.pubTime]
				}
	poolDao.query(queryObj,function (error,results,fields) {
		if(error){
			// 有错误
			return response.status(500).send(error)
		}
		// 没有错误,跳转到首页	
		response.redirect('/')
	})
})

// ----------------修改页面------------------- 
router.get('/edit',function (request,response) {
	var sql = 'select _id,girlName,girlAge,girlDescription,pubTime from girls where _id = ?'
	var queryObj = {
					'sql': sql,
					timeout: 6000,
					values: [request.query._id]
					}
	poolDao.query(queryObj,function (error,results,fields) {
		if(error){
			// 如果出错
			return response.status(500),send(error)
		}
		// 如果查询成功
		response.render('index/node_38_edit.html',{'girl': results[0]})
		
	})
})

// ----------------更新数据库------------------- 
router.post('/update',function (request,response) {
	// 1.请求体 id号 (前后多了两个引号,要手动去掉)
	var girlID = request.body._id
	var girlName = request.body.girlName
	var girlAge = request.body.girlAge
	var girlDescription = request.body.girlDescription
	// 2.更新
	var sql = 'update girls set girlName = ?,girlAge = ?,girlDescription = ? where _id = ?'
	var queryObj = {
					'sql': sql,
					timeout: 6000,
					values: [girlName,girlAge,girlDescription,girlID]
					}
	// 使用连接池更新记录					
	poolDao.query(queryObj,function (error,results,fields) {
		if(error){
			// 如果失败
			return response.status(500).send(error)
		}
		// 如果成功
		response.redirect('/')
	})
})

// ----------------删除一条记录------------------- 
router.get('/delete',function (request,response) {
	// 1.获取query对象中的_id
	var girlID = request.query._id
	
	// 2.调用dao从数据库中删除一个对象
	var sql = 'delete from girls where _id = ?'
	var queryObj = {
					'sql': sql,
					timeout: 6000,
					values: [girlID]
					}
	// 使用连接池					
	poolDao.query(queryObj,function (error,results,fields) {
		if(error){
			// 如果错误
			return response.status(500).send(error)
		}
		// 如果没有错误,跳转到首页
		return response.redirect('/')
	})
})


// 3.在模块文件最后,导出router
module.exports = router
