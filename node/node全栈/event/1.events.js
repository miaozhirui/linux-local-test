/**
 * 事件
 * 订阅发布
 *
 * */


function Person(name){
    "use strict";

    this.name = name;
    this._events = {};
}

//注册事件
Person.prototype.on = function(eventName, callback){
    "use strict";

    if(this._events[eventName]){

        this._events[eventName].push(callback);
    } else {

        this._events[eventName] = [callback]
    }

}

//触发事件(发射事件)

Person.prototype.emit = function(eventName){
    "use strict";

    var args = Array.prototype.slice.call(arguments, 1);

    var callbacks = this._events[eventName];
    var self = this;

    callbacks.forEach(function(callback){

        callback.apply(self, args);
    })
}


//实例
var girl = new Person;

girl.on('哈哈', function(args){
    "use strict";

    console.log(args);
})

girl.on('哈哈', function(args){
    "use strict";

    console.log(args);
})


girl.emit('哈哈', '1');
















