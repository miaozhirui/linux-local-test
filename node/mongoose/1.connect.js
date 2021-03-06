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

//根据模型创建实体,是指的个体对象
var personEntity = new PersonModel({
    name: 'miaozhirui',
    age:16,
    email: 'miaozhirui@gmail.com',
    home: '北京'
})
//创建成功之后,schema属性就变成了model和entity的公共属性了


//用save方法把自己保存到数据库中
personEntity.save(function(err,doc){
    "use strict";

    if(err){
        console.log('error:'+err);
    } else {
        console.log(doc)
    }
})


//





































