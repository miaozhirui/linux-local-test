<?php
header("Content-type:text/html; charset=utf8");
// header('Status: 404 Not Found; charset=utf8');
// 文件将被称为 downloaded.pdf
// header("Content-Disposition:attachment;filename='downloaded.pdf'");
// echo "php";
// header("Content-type:text/html; charset=utf8");
$str = "add";
function add() {
    echo "我是变量函数";
}
$str();
?>
<script>
 var map = {
    "add": add
 }
 function add() {
    console.log("我是模拟的变量函数");
 }
 map['add']()
</script>