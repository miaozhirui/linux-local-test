<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>regular</title>
    <script type="text/javascript">
    var str = "houdunwang.com.com";
    var content = str.match(/.*(?=\.com)/);
    // var content = str.match(/hou(.*)\.com/);
    console.log(content)    
    </script>
</head>
<body>
<?php
 $str = "houdunwang.com.com";
 // php支持反向预查
 $reg = '/(?<=hou).*(?=\.com)/';
 preg_match_all($reg, $str, $arr);
 print_r($arr);
?>
</body>
</html>