<?php
// 下面的这句话要加
header('Content-type:application/json; charset=utf-8');
header("Cache-Control:max-age=0");//不缓存


//这种方式是前端不断的发情求，浪费带宽
// sleep(1);
// $res = array('success' => 'ok', "text" => '我是测试的文本');
// echo json_encode($res);

//这种方式是后端链接不断，不断的往前端输出内容
$i = 0;
while($i<9){
  $i++;
  sleep(1);
  $res = array('success' => 'ok', "text" => '我是测试的文本');
  echo json_encode($res);
  ob_flush();
  flush();
}