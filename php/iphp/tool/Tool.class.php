<?php

class Tool{

// header("Content-type:text/html;charset=utf-8");
/**
 * [p description]打印函数
 * @param  [type] $data 要打印的数据
 * @return [type]
 */
static public function p($data){
  echo "<link rel='stylesheet' href='../style_common/style_common.css'/>";
  echo "<div class='box'>";
  echo "<pre>";
  echo print_r($data,true);
  echo "</div>";
}

/**
 * [add_goods description]历史浏览记录
 * 
 * @param [type] $name浏览物件名
 */
 static public function add_goods($name=null){

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
 static public function require_cache($files=null){

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
      $arr[$f]=true;
    }
  }
 
}




/**
 * [config description]
 * @param  [type] $name 配置函数
 * @param  [type] $value
 * @return [type]
 */
 static public function c($name=null,$value=null){
  
    static $config=array();
    if(is_array($name)){
      
      array_change_key_case_d($name);
     $config=array_merge($config, $name);
    }
    else if(is_null($name)){

       return $config;
    }else if(is_null($value)){
      $name=strtolower($name);
      return isset($config[$name])?$config[$name]:null;  
    }else{
       $name=strtolower($name);
       $preg="@^:@";
       if(preg_match($preg,$value)){
        $action=substr($value,1);
        switch (strtolower($action)) {
          case 'del':
            if(isset($config[$name])){
              unset($config[$name]);
            }
            break;
          
       
        }
       }else{

        $config[$name]=$value;
       }
       
    }
}


/**
 * [facto description]递归函数
 * @param  [type] $n
 * @return [type]
 */
 static public function  facto($n){
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
 static public function get_size($size){

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
 static public function runtime($start,$end=null){
   
    static $time=array();

   if(is_null($end)){

   return $time[$start]=microtime(true);
   }else{

    $time[$end]=microtime(true);
    return $time[$end]-$time[$start];

   }

}


/**
 * 成功与错误跳转信息
 * @param  [type]  $msg  [description]
 * @param  [type]  $url  [description]
 * @param  integer $case [description]
 * @return [type]        [description]
 */
static private function jump($msg=null,$url=null,$case=1){

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
static public function success($msg=null,$url=null){

  static::jump($msg,$url, 1);


}


/**
 * 失败跳转
 * @param  [type] $msg 
 * @param  [type] $url [description]
 * @return [type]      [description]
 */
static public function error($msg=null,$url=null){
 static::jump($msg,$url,0);


}



}

