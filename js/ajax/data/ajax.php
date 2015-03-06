<?php
$array = array('name' => 'miaozhirui');
header('Content-type:application/json; chartset= utf8');
echo json_encode($array);
exit;