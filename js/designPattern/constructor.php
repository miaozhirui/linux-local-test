<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>构造函数模式</title>
</head>
<body>
    <script type="text/javascript">
    function Add (name, age) {
        if(!(this instanceof Add)) {//强制让这个函数通过new关键字来调用
            return new Add(name, age)
        }
        this.name = name;
        this.age=age;

    }
    Add.prototype.output= function() {
            console.log(this.name+' '+this.age);
    }

    // new Add('miao', 23).output();
    // new Add('yuan', 24).output();
    // new Add('huang', 25)
    // var obj = new Object();
    // Add.call(obj,'miao', 23)
    // obj.output()
    // console.log(Add())
    // var a = new Add()
    // console.log(a instanceof Add)
    Add('miao', 22).output()
    //构造函数强制使用new 
    </script>
</body>
</html>