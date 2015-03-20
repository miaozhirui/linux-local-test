<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <script type="text/javascript" src="../when.js"></script>
    <script type="text/javascript" src="../utils.js"></script>
    <script type="text/javascript" src="../promise.js"></script>
    <script type="text/javascript">
        function add() {}
        console.log(_.isFunction(1))
    </script>
    <script type="text/javascript">
    // function run(a) {
    //     var defer = when.defer();
    //     a ? defer.resolve() : defer.reject();
    //     return defer.promise;
    // }
    // var promise = new Promise(function(resolve, reject) {
    //     setTimeout(function() {
    //         resolve('b')
    //     },5000)
    // })
    // for(var i in promise) {
    //     console.log(i)
    // }
    // promise
    Promise.resolve()
    .then(function(data){
        console.log(data+1)
        return data+1
    })
    .then(function(data) {
        console.log(data+2);
    })
    .then(function(){
        console.log(3)
    })
    .then(function() {
        console.log(4)
    }).catch(function(e) {
        console.log(e)
    })
    </script>
</body>
</html>