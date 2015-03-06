<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>hash的使用(锚点的一种使用方法)</title>
    <style>
        .box{height:1500px;}
        .box span{display: block;}
        .footer{height:1000px;}
    </style>
</head>
<body>
    <div class="box"></div>
    <span name="topApp" id = 'topApp'>one</span>
    <div class="footer"></div>
    <script type="text/javascript">
             window.location.hash="#topApp";
    </script>
</body>
</html>