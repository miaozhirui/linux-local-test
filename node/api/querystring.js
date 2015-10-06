// querysting.stringify序列化
// querystring.parse反序列化

var querystring = require('querystring');

// 第一参数是要序列化的对象，第二个参数指定他们之间的连接符号,第三个参数指定他们key与值之间的连接符号
// console.log(querystring.stringify({name:'mzr',cousre:['jade','node'], from:''}))

// console.log(querystring.stringify({name:'mzr',cousre:['jade','node'], from:''}, ','))

// console.log(querystring.stringify({name:'mzr',cousre:['jade','node'], from:''}, ',', ':'))


// 反序列化,默认是以&符号去分割，如果不是的话，需要在第二个参数的地方指定,第三个参数是指定键值之间的符号，第四个指定参数的个数
console.log(querystring.parse('name=miaozhirui,cousrse=jade,cousrse=node,from=',','));
































