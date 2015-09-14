<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script type="text/javascript" src="../../jquery-1.8.3.js"></script>
    <script type="text/javascript">
    // 传统写法
    // $.ajax('data.php', {//直接把地址写错误就会走到error里面去的
    //     success: function(data) {
    //         console.log(data)
    //     },
    //     error: function(m) {
    //         console.log(m)
    //     }
    // })
    // var option = {
    //     type: 'POST',
    //     dataType: 'JSON',
    //     data: {
    //         id: 1,
    //         name: 'houdunwang'
    //     }
    // }
    //现在的写法
    // $.ajax('data.php', option).done(function(data) {
    //     console.log(data)
    // }).fail(function(error, status){
    //     console.log(error.status)
    //     console.log(status)
    // }).done(function() {
    //     console.log('哈哈我成功了');
    // }).done(function() {
    //     console.log('哈哈,我失败了')
    // })

// $.when($.ajax('data/1.php'), $.ajax('data/2.php')).done(function() {
//     console.log(111)
// }).fail(function(error) {
//     console.log('shibaile');
// });
    </script>
</head>
<body>
<script type="text/javascript">
//下面的无法完成回调，会立马执行done的这个操作
    // function wait() {
    //     function task() {
    //         console.log('renwuwanchengle');
    //     }
    //     setTimeout(task, 5000);
    // }
    // $.when(wait()).done(function() {
    //     console.log('我的任务完成了');
    // });

    // function wait() {
    //     var dtd = $.Deferred();//最好是定义成局部变量，这样在外面就无法改变这个值了
    //     function task() {
    //         console.log('renwuwanchengle');
    //         dtd.resolve()
    //     }
    //     setTimeout(task, 4000);
    //     return dtd.promise();
    // }
    // // $.when只能接受deferred
    // $.when(wait()).done(function() {
    //     console.log('我的任务完成了');
    // }).fail(function() {
    //     console.log('我的任务已经失败了');
    // });
    // console.log(11)

   function wait() {
        var dtd = $.Deferred();//最好是定义成局部变量，这样在外面就无法改变这个值了
        function task() {
            console.log('renwuwanchengle');
            dtd.resolve()
        }
        setTimeout(task, 4000);
        return dtd.promise();
    }
$.when(wait()).done(function() {
    console.log('我成功了');
}).fail(function() {
    console.log('我失败了');
})
</script>
</body>
</html>