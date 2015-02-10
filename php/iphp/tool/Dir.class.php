<?php

/**
 * @author tanjibo
 */
class Dir{

/**
 * 复制目录里的 内容
 * @param  [type] $src_dir源目录
 * @param  [type] $to_dir新目录
 * @return [type]
 */
	 static public function copy_dir($src_dir,$to_dir){
    //如果源目录不存在就不操作
    if(!is_dir($src_dir)){
    	return false;
    }
   //如果新目录不存在就创建一个
    is_dir($to_dir)or mkdir($to_dir,0755,true);
    //遍历源目录里的内容
    $data=glob($src_dir."/*");

    foreach($data as $f){

       $to=$to_dir."/".basename($f);

       is_dir($f)?self::copy_dir($f,$to):copy($f, $to);

   }

	 }


/**
 * 删除文件或目录
 * @param  [type] $file  要删除的文件或目录
 * @return [type] 成功返回真
 */
 static public function del($file=null){
   if(!file_exists($file)) return true;
   if(is_file($file)){
   	//如果是一个文件就直接删除
   	return unlink($file);

   }else{
    //遍历目录里的内容
   	$data=glob($file."/*");

    	foreach($data as $f){
     
     is_dir($f)?self::del($f):unlink($f);
   		
   	}
     return rmdir($file);

   }

	 }


/**
 * 移动文件里的内容
 * @param  [type] $src_dir源目录
 * @param  [type] $to_dir新目录
 * @return [type]
 */
static public function move_dir($src_dir,$to_dir){

 self::copy_dir($src_dir,$to_dir);

  self::del($src_dir);
}



/**
 * 创建目录
 * @param  [type]  $dir 需要创建的目录
 * @param  integer $auth 权限
 * @return [type]
 */
static public function create($dir,$auth=0755){
  $dir=str_ireplace("\\", "/", $dir);
 // $dir=substr($dir,-1)=="/"?$dir:$dir."/";
 $dir=explode("/", $dir);
 $path="";
foreach($dir as $f){

	$path.=$f."/";
  is_dir($path)or mkdir($path,$auth,true);

}
}

}

