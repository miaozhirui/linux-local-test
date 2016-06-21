/**
 * Created by mzr on 16/4/11.
 */

var express = require('express');
var app = express();

//存放所有的用户
var users = [{name:"miaozhiuri",age:122}];

//1.获取所有的用户
app.get('/users', function(req,res){
    "use strict";
    console.log(req.headers);
    //text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
    var accept = req.headers['accept'];
    res.send(users);
});







app.listen(8888);

