function NSLog(loli) {console.log(loli);return 'Copyright © 2018 Powered by beyond';};  

// 1.导入框架
var mysql = require('mysql')
// 2.创建连接
var pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'db2'
})

// 3.无需关闭,查询完毕会自动进行连接池 pool

// 4.导出连接池
module.exports = pool