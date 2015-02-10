<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>promise</title>
</head>
<body>
    <script type="text/javascript">
//     var promise = new Promise(function(resolve, reject){
//     reject(42);
// });
// promise.catch(function(error) {
//     console.error(error)
// })
// promise.then(function(value){
//     console.log(value);
// }, function(error) {
//     console.log(error)
// }).catch(function(error){
//     console.error(error);
// });
function f1() {
    return new Promise(function (resolve, reject) {
        setTimeout(function() {
        for(var i=0; i<100; i++) {
            console.log(i)
        }
        resolve(1)
        },1000)

    })

}
//异步的执行方式
// f1().then(f2).then(f3).catch(function(error) {
//     console.error(error)
// })
f1().then(function(){console.log('success'); throw new Error('11'); console.log(2)}, function() {console.log('error'); throw new Error('11')}).then(function(){console.log('success')}, function() {console.log('error'); throw new Error('11')})
function f2(value) {
    console.log(value)
    return value+1;
}
function f3(value) {
    console.log(value)
}
//同步的执行
// f1()
// f2()
// f3()
// 异步的执行

    </script></body>
</html>