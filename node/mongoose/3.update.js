//var db = mongoose.connect("mongodb://user:pass@localhost:port/database");
//var mongoose = require("mongoose");

//1.安装mongoose
//2.加载mongoose
var mongoose = require("mongoose");
//3.连接数据库
var db = mongoose.connect("mongodb://127.0.0.1:27017/mzr123");
//连接成功之后的回调
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
//连接失败之后的回调
db.connection.on("open", function () {
    console.log("数据库连接成功");
});

//定义一个schema,描述此集合里有哪些字段,字段是什么类型
//只有schema中有的属性才能保存到数据库中
var PersonSchema = new mongoose.Schema({
    name : { type:String },
    age  : { type:Number, default:0 },
    time : { type:Date, default:Date.now },
    email: { type:String,default:''},
    home: {type:String,default: ''}
});

//创建模型，可以用它来操作数据库中的Person集合,是指的整体
var PersonModel = db.model('person', PersonSchema);

//更新数据
//multi更新匹配到的所有数据
var condition = {name: 'zhangsna0'};
//$set更新器 后面的key是指定的要更新的字段
var update = {$set: {age:400}};
PersonModel.update(condition, update,{multi: true}, function(error){
    "use strict";

    if(error){
        console.log(error)
    } else {
        console.log('update success');
    }
})








































