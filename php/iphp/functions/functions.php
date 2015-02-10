<?php

header("Content-type:text/html;charset=utf-8");
/**
 * [p description]打印函数
 * @param  [type] $data 要打印的数据
 * @return [type]
 */

 /**
  * 获取用户自定义的常量
  * @return [type] [description]
  */
 function get_consts(){
  $const=get_defined_constants(true);
  return $const["user"];
  }
          
function p($data){
  echo "<link rel='stylesheet' href='../../style_common/style_common.css'/>";
  echo "<div class='box'>";
  echo "<pre>";
  echo print_r($data,true);
  echo "</div>";
}

/**
 * 实例化模型
 * @param [type] $table 表名
 */
function M($table){
     return new Model($table);
}
/**
 * [add_goods description]历史浏览记录
 * 
 * @param [type] $name浏览物件名
 */
function add_goods($name=null){

	static $goods=array();
	if(is_null($name)){

		return $goods;
	}
   array_unshift($goods, $name);
	  
	 if(count($goods)>5){

	 	array_pop($good);
	 }

}
/**
 * [require_cache description]文件加载
 * @param  [type] $files
 * @return [type]
 */
function require_cache($files=null){

  static $cache=array();
if(is_null($files)){
  return $cache;
}
//把单文件变成数组，这样但文件和多文件都可以加载
  if(is_string($files)){

    $files=array($files);
  }

  foreach($files as $f){

    if(!isset($cache[$f])&&file_exists($f)){

      require $f;
      $cache[$f]=true;
    }
  }
 
}

function __autoload($className){
   if(require_cache(IPHP_PATH."tool/".$className.".class.php")){
     "";
   } else if(require_cache(IPHP_PATH.$className.".class.php")){
     '';
   } 
 
}


/**
 * [config description]
 * @param  [type] $name 配置函数
 * @param  [type] $value
 * @return [type]
 */
function c($name=null,$value=null){
  static $config=array();

  if(is_array($name)){
    $name=array_change_key_case_d($name);

    $config=array_merge($config, $name);
      return $config;
  }
  if(is_null($name)){
    return $config;
  }else if(!is_null($value)){
    $name=strtolower($name);
    $config[$name]=$value;
    return true;
  }else{
    $name=strtolower($name);
    return isset($config[$name])?$config[$name]:null;
  }
}

/**
 * [facto description]递归函数
 * @param  [type] $n
 * @return [type]
 */
function  facto($n){
  if($n>1){
    $r=$n*facto($n-1);
    
   }else{
    $r=$n;
   }
   return $r;
}



/**
 * [get_size description]获取可识别的单位
 * @param  [type] $size
 * @return [type]
 */
function get_size($size){

   if($size>pow(1024,3)){
    return round($size/pow(1024,3))."GB";
   }else if($size>pow(1024,2)){
    return round($size/pow(1024,2))."MB";
   }else{
    return round($size/pow(1024,1))."KB";
   }
}





/**
 * [runtime description]计算脚本运行时间
 * @param  [type] $start开始时间
 * @param  [type] $end结束时间
 * @return [type]
 */
function runtime($start,$end=null){
   
    static $time=array();

   if(is_null($end)){

   return $time[$start]=microtime(true);
   }else{

    $time[$end]=microtime(true);
    return $time[$end]-$time[$start];

   }

}


/**
 * [array_change_key_case_d description]
 * @param  [type]  $arr  [description]
 * @param  integer $case [description]
 * @return [type]        [description]
 */
function array_change_key_case_d($arr,$case=0){

  $func=$case?"strtoupper":"strtolower";
  foreach($arr as $k=>$v){
       unset($arr[$k]);
       $k=$func($k);
       $arr[$k]=is_array($v)?array_change_key_case_d($v,$case=0):$v;

  }
  return $arr;
}




/**
 * 删除文件或者目录
 * @param  [type] $files [文件名或者目录]
 * @return [type]        [description]
 */
      function del($files=null){
      //如果是文件并且存在就直接删掉
      if(file_exists($files)&&is_file($files)){
        return @unlink($files);
      }
      //如果是目录则遍历
      if(is_dir($files)){
      
           $data=glob($files.'/*');
      
      foreach($data as $f){
      //如果目录里还有目录则继续遍历
      is_dir($f)?del($f):unlink($f);
      
      }
      
      return rmdir($files);
      
      
      }
      }


/**
 * [copy_dir ]复制文件
 * @param  [type] $src_dir 源目录
 * @param  [type] $to_dir 目标目录
 * @return [type]          [description]
 */
function  copy_dir($src_dir=null,$to_dir=null){

     if(!is_dir($src_dir)){
      return false;
     }
     is_dir($to_dir)or mkdir($to_dir,0777,true);

    $data=glob($src_dir."/*");

    foreach($data as $f){
  
   $to=$to_dir."/".basename($f);//basename()取文件名或目录名
   is_dir($f)?copy_dir($f,$to):copy($f,$to);
      
    }

}


/**
 * [move_dir移动文件]
 * @param  [type] $src_dir [源文件]
 * @param  [type] $to_dir  [目标文件]
 * @return [type]          [description]
 */
function move_dir($src_dir=null,$to_dir=null){
    copy_dir($src_dir,$to_dir);
     return del($src_dir);

}

/**
 * 成功与错误跳转信息
 * @param  [type]  $msg  [description]
 * @param  [type]  $url  [description]
 * @param  integer $case [description]
 * @return [type]        [description]
 */
function jump($msg=null,$url=null,$case=1){

 $class=$case?"pbg1":"pbg0";

$str=<<<str

<script>
  window.onload=function(){

    var jump=document.getElementById("jump");
    var span=document.getElementsByTagName("span")[0];
    var num=3;
    setInterval(function(){
       num--;
       span.innerHTML=num; 
       if(num==0){
        window.location.href="$url";

       }
         
    },1000);
  }
</script>

<link rel='stylesheet' href='../style_common/style_common.css'/>
<p id="jump" class="$class">{$msg}!<span>3</span>秒后跳转........</p>
str;



echo $str;
}


/**
 * 成功跳转
 * @param  [type] $msg [description]
 * @param  [type] $url [description]
 * @return [type]      [description]
 */
function success($msg=null,$url=null){

  jump($msg,$url, 1);


}


/**
 * 失败跳转
 * @param  [type] $msg 
 * @param  [type] $url [description]
 * @return [type]      [description]
 */
function error($msg=null,$url=null){
  jump($msg,$url,0);


}


function halt($msg){
  
$data=<<<php
     <div style='margin:100px auto;
    height:200px;
    width:60%;
    padding-right,padding-left: 50px;
    border-radius: 5px;
    border:5px dotted red;
    box-shadow: 4px 4px 4px #ccc;
    font-size:30px;
    font-family: "微软雅黑";
    line-height:200px;
    text-align:center;
    text-shadow:4px 4px 4px #ccc;'
  
      >:( $msg</div>;
   
php;
 echo $data;
 


}
