<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script type="text/javascript" src="./jquery.js"></script>
    <!-- // <script type="text/javascript" src="../jquery-1.8.3.js"></script> -->

</head>
<body>
    <div class="box">1</div>
    <div class="box">1</div>
    <div id="one" class="box">1</div>
</body>
    <script type="text/javascript">
    var test = miao.get('#one').text();
    console.log(test);
    </script>
</html>