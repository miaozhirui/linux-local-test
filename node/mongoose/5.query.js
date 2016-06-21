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

//第二个参数是指定放回的参数 1表示返回， 0表示不返回
//如果如果不指定的指定的字段默认不返回
//_id如果不指定也会返回，如果不想让他返回的时候，需要显示的指定为0
//PersonModel.find({}, {name:1,_id:0}, function(error,doc){
//    "use strict";
//    if(error){
//        console.log(error)
//    } else {
//        console.log(doc)
//    }
//})

//当找到第一条匹配的记录时就不会立刻返回，不再继续查找，返回单个对象
//PersonModel.findOne({}, {name:1,_id:0}, function(error,doc){
//    "use strict";
//    if(error){
//        console.log(error)
//    } else {
//        console.log(doc)
//    }
//})

//PersonModel.find({}, null, {limit: 2,sort: {_id:-1}}, function(err, doc){
//    "use strict";
//    if(err){
//        console.log(err)
//    } else {
//        console.log(doc)
//    }
//})





































