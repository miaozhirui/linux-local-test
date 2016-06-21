var express = require('express');
var port = process.env.PORT || 3000;
var app = express();



app.set('views', './views');
app.set('view engine', 'jade');
app.listen(port);
console.log(11)
console.log(22)
console.log('服务已经成功启动'+port);