<?php

function smarty_block_stu1($params, $content, &$smarty){
if(empty($content)) return;
 //显示的行数
 $limit=$params["rows"];
 //连接数据库
 $sex=isset($params["sex"])?$params["sex"]:"";
mysql_connect('localhost',"root","") or die("error:".mysql_error());
 //选择使用的数据库
 mysql_select_db("c32");

 //设置字符集
   mysql_query("set names utf8");
 //查选
   $where="";
   if(!empty($sex)){
    $where= "WHERE sex=$sex order by rand()";
   }

$sql="SELECT * FROM stu {$where} LIMIT $limit";

 $result=mysql_query($sql);

   $data=array();

 while($d=mysql_fetch_assoc($result)){

    $data[]=$d;
 }
$str="";
foreach($data as $stu){
    $tmp=$content;
    foreach($stu as $k=>$v){
       $search='[$field.'.$k."]";
      $tmp=str_ireplace($search, $v, $tmp);
      
    }
     $str.=$tmp;
}
return $str;
}

?>
