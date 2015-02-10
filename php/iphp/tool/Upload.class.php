<?php

/**
 * @auth tanjibo
 */
class Upload{

  private $dir;
  private $allow_size;
  private $allow_type;


/**
 * 构造函数
 * @param [type] $dir     上传目录
 * @param [type] $allow_size 大小
 * @param [type] $allow_type 类型
 */
  public function __construct($dir=null,$allow_size=null,$allow_type=null){

    $this->dir=isset($dir)?$dir:"upload/".date("Y/m/d")."/";
    $this->allow_size=isset($allow_size)?$allow_size:300000;
    $this->allow_type=isset($allow_type)?$allow_type:array("PNG","jpg","js","jpeg");
    $this->allow_type=$this->array_change_value_case($this->allow_type);
}

  /**
   *
   * @return [type] [description]
   */
   public function upload(){
        //统一上传方式
        $files=$this->combine();
        //去除不满足条件的文件
        $new_files=$this->filter($files);
         //最后的上传文件
        $last_files=$this->move($new_files);
          
        return $last_files;
        
          
    }

     /**
      * 移动文件
      * @param  [type] $new_files [过滤后的文件]
      * @return [type]            [最后的上传文件]
      */
      private function move($new_files){

           $dir=$this->dir;
           $dir=str_ireplace("\\", "/", $dir);
           $dir=substr($dir,-1)=="/"?$dir:$dir."/";
           is_dir($dir) or mkdir($dir,0755,true);
           $last_files=array();
          foreach($new_files as $last){

           $info=pathinfo($last["name"]);
           $info=$info["extension"];
           $to=$dir.time().mt_rand(1,20000).".".$info;

           if(move_uploaded_file($last["tmp_name"], $to)){

              $last["time"]=time();
              $last["filename"]=$to;
              $last["info"]=$info;

           } 
            $last_files[]=$last;
          } 
          return $last_files; 
      }    

     /**
      * 去除不满足条件的上传文件
      * @param  [type] $files [统一方式后的所有文件]
      * @return [type]        [description]
      */
    private function filter($files){
         
         $new_files=array();
         foreach($files as $f){

           if($f["error"]>0) continue;

           if(!is_uploaded_file($f["tmp_name"])) continue;

           if($f["size"]>$this->allow_size) continue;

           $info=pathinfo($f["name"]);

           $info=strtolower($info["extension"]);

           if(!in_array($info, $this->allow_type)) continue; 

           $new_files[]=$f;
         }
             
         return $new_files;
      }
   


     /**
      * 统一上传方式
      * @return [type] 返回一个统一方式后的二维新数组
      */
    private function combine(){
       $files=array();
      foreach($_FILES as $f){

        if(is_array($f["type"])){
           $new=array();
          foreach($f["type"] as $key=>$value){
                   $new["name"] =$f["name"][$key];
                   $new["type"] =$f["type"][$key];
                   $new["tmp_name"] =$f["tmp_name"][$key];
                   $new["error"] =$f["error"][$key];
                   $new["size"] =$f["size"][$key];
                  $files[]=$new;
          }
        }else{

          $files[]=$f;
        }
      }
      return $files;
    }

/**
 * 改变键值的大小写
 * @param  [type]  $arr  要改变的数组
 * @param  integer $case 
 * @return [type]       
 */
 private function array_change_value_case($arr,$case=0){
  $func = $case?'strtoupper':'strtolower';
  foreach($arr as $n=>$a){
    $arr[$n]=is_array($a)?array_change_value_case($a,$case):$func($a);
  }
  return $arr;
}
/**
 * 改变键名的大小写
 * @param  [type]  $arr  要改变键名的数组
 * @param  integer $case 
 * @return [type]       
 */
 private function array_change_key_case_d($arr,$case=0){
  $func = $case?'strtoupper':'strtolower';
  foreach($arr as $n=>$v){
    unset($arr[$n]);
    $n=$func($n);
    $arr[$n]=is_array($v)?array_change_key_case_d($v,$case):$v;
  }
  return $arr;
}





















  
}