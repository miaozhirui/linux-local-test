<?php
// header("Content-type:text/html;charset=utf-8");
// if(function_exists("mysql_connect")){
//   echo "mysql扩展已经安装了";
// } 

$link = mysql_connect('127.0.0.1', 'root', '') or die('数据库连接失败');
mysql_select_db('class');
mysql_query("set names 'utf8'");
$result = mysql_query('select * from user limit 1');
$row = mysql_fetch_assoc($result);
print_r($row); 