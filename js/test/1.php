<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>js的单线程处理</title>
    <script type="text/javascript">
        function run() {
            console.log(11)
     
            setTimeout(function() {
                console.log('我是回调');
            },0)
            run1()
        }
        function run1() {
              for(var i=0; i<1000; i++) {
                console.log(i)
            }
        }
        run()
    </script>
</head>
<body>
    
</body>
</html>