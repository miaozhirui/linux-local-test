<?php
header('Content-Type: text/event-stream');
// header("Content-type:application/json");
header('Cache-Control: no-cache');

// $time = date('r');
// echo "data: The server time is: {$time}\n\n";
echo "data:".json_encode(array('name'=>'miaozhirui','age'=>1))."\n\n";

// echo 
// header('Content-type:text/event-stream;charset=utf-8');
// header('Cache-Control: no-cache');
// echo "data: 现在北京时间是";
// flush();
// echo "data: The server time is: {$time}\n\n";