<?php

function smarty_function_js($param,&$smarty){
$file = $param["file"];

p("<script type='text/javascript' src='{$file}'></script>");


}
?>
