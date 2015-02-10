<?php

function smarty_modifier_date($string,$format)
{

  return date($format,$string);
}

?>
