<?php

function smarty_block_stu($params, $content, &$smarty)
{
   //print_r($params) ;
   //print_r($content);
   if(empty($content)) return;//第一次为空
   $limit=$params["row"];//显示行数
   mysql_connect('localhost',"root","") or die("error:".mysql_error());
   mysql_select_db("c32");
   mysql_query("set names utf8");
   $sql="SELECT * FROM stu LIMIT {$limit}";
   $result=mysql_query($sql);
    $data=array();
   while($d=mysql_fetch_assoc($result)){
   $data[]=$d;
   }
  

   // print_r($data);//会打印两次
   $str='';
  foreach($data as $stu){
  	echo "<pre>";
  	// print_r($stu);
       $tmp=$content;
  	foreach($stu as $k=>$v){
  	    
  		
  		$tmp=str_ireplace($tmp, $v, $tmp);
  
  		$str.=$tmp;
  	}
   
  }
    
return $str;
  
} 



?>
