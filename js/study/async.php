<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>异步编程的几种方式</title>
    <script type="text/javascript" src="../jquery-1.8.3.js"></script>
    <script type="text/javascript" src="../libs/jquery.publish.js"></script>
</head>
<body>
    <script type="text/javascript">
    // 一、回调函数
    function f1() {//f1是很耗时的程序
        for(var i=0; i<1000; i++) {
            console.log(i)
        }
    }
    function f2() {
        console.log('end')
    }//f2的运行要等到f1执行完之后再执行    }

    //为了f1不组织后面的程序的运行，可以f1放到最后去执行，把f2作为回调函数去执行
    
    //改成回调函数的方式
    function f1(callback) {
        setTimeout(function() {
             for(var i=0; i<1000; i++) {
                console.log(i)
                }
            //f1的代码
            callback()
        },1000)
    }
    // f1(f2);//这样就改成了异步的方式了（缺点，这种代码耦合度太高了，不利于维护）


    // 二、事件监听（事件驱动的模式）
    // function f1() {
    //     setTimeout(function() {
    //         for(var i ; i<1000; i++) {
    //             console.log(i)
    //         }
    //         f1.trigger('done');
    //     }, 1000)
    // }
    // f1.on('done', f2);
    

    //三、发布/订阅(观察者模式)
    function f1() {
        setTimeout(function() {
            for(var i=0; i<1000; i++) {
                console.log(i);
            }
            $.publish('done');

        }, 1000)
    }
    function f2() {
        console.log('end')
    }
    $.subscribe('done', f2)
    // f1()


//promise对象（思想是每一个任务完成之后都返回一个promise对象，这个promise对象都有一个then方法，允许制定回调函数）

$.ajax('../data/1.php')
.done(function() {
    console.log('成功')
})
.fail(function() {
    console.log('失败')
})

    </script>
</body>
</html>


