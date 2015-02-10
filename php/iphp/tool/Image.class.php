<?php

class Image{
    
    public $water_img="arrow.gif";//水印图片
    public $water_fsize=30;//水印文字的大小
    public $water_fangle=0; //水印文字的旋转角度
    public $water_fontfile="1.TTF";//水印文字的字体
    public $water_text="蓝桥易乞";//水印文字
/**
 * 缩略图
 * @param  [type] $file  [要缩略的图片]
 * @param  [type] $dst_w [目标宽度]
 * @param  [type] $dst_h [目标高度]
 * @return [type]        [description]
 */
public function thumb($file,$dst_w,$dst_h){
   
   if(!$this->check($file)){
    return false; 
   }
   $func=$this->check_dst_type($file);
   $src=$func($file);
   $info=getimagesize($file);
   $src_w=$info[0];
   $src_h=$info[1];
   if($src_w/$dst_w>$src_h/$dst_h){
      $src_w=($src_h/$dst_h)*$dst_w;
   }else{
        $src_h=($src_w/$dst_w)*$dst_h;
   }
   $dst=imagecreatetruecolor($dst_w, $dst_h);
   imagecopyresized($dst, $src, 0, 0, 0, 0, $dst_w, $dst_h, $src_w, $src_h);
   // header("Content-type:image/jpeg");
      $path=pathinfo($file);
     //缩略图不再浏览器输出，而是保存后的新名字
      $thumb_new_name=$path["dirname"]."/".$path["filename"]."_thumb".".".$path["extension"];

       $imgtype=str_ireplace("/", "", $info["mime"]);

       return $imgtype($dst,$thumb_new_name);
 

}


  /**
   * 水印
   * @param  [type]  $file 要加水印的文件
   * @param  integer $type 加水印的方式
   * @param  integer $pos  水印在$file的位置
   * @return [type]        [description]
   */
	public function water($file,$type=1,$pos=9){
    //检测文件和环境
      if(!$this->check($file)){return $false;}
      	
      if($type==1){

         //文字水印
        $data=$this->water_word($file,$pos);
        //经过加水印后目标文件
        $dst=$data[0];
        //目标文件的输出类型
        $imgtype=$data[1];
   
      }else{

         //图片水印
        $data=$this->water_img($file,$pos);
        //经过加水印后目标文件
        $dst=$data[0];
        //目标文件的输出类型
        $imgtype=$data[1];
      }
       
      $path=pathinfo($file);
     //水印不再浏览器输出，而是保存后的新名字
      $water_new_name=$path["dirname"]."/".$path["filename"]."_water".".".$path["extension"];
      $imgtype($dst,$water_new_name);

	}


/**
 * 文字水印方式
 * @param  [type] $file [要加水印的图片]
 * @param  [type] $pos  [水印的位置]
 * @return [type]       [description]
 */
  private function water_word($file,$pos){
    //检测目标文件类型，并输出成资源
     $func=$this->check_dst_type($file);
     $dst=$func($file);
      //获取目标文件的宽高
     $info=getimagesize($file);
     $dst_w=$info[0];
     $dst_h=$info[1];
     //获取水印的宽高
      $ttf=imagettfbbox($this->water_fsize, $this->water_fangle, $this->water_fontfile, $this->water_text);
      $src_w=abs($ttf[0]-$ttf[2]);
      $src_h=abs($ttf[1]-$ttf[5]);
      //获取水印的位置
      $water_pos=$this->get_water_pos($dst_w, $dst_h, $src_w, $src_h, $pos);
      //设置水印文字的颜色
      $ttf_color=imagecolorallocate($dst, mt_rand(0,255), mt_rand(0,255), mt_rand(0,255));
       //把水印加到文件上
      imagettftext($dst, $this->water_fsize, $this->water_fangle, $water_pos[0], $water_pos[1],$ttf_color , $this->water_fontfile, $this->water_text);
   
     
      $func=str_ireplace("/", "", $info["mime"]);

      //返回目标文件和目标文件的输出类型
       return array($dst,$func);

  }
   /**
    * 图片水印方式
    * @param  [type] $file [加水印的文件]
    * @param  [type] $pos  [水印的位置]
    * @return [type]       [description]
    */
private function water_img($file,$pos){

        $func=$this->check_dst_type($file);
        $dst=$func($file);
        $dst_w=imagesx($dst);
        $dst_h=imagesy($dst);
        $src=imagecreatefromgif($this->water_img);
        $info=getimagesize($this->water_img);

        $position=$this->get_water_pos($dst_w, $dst_h, $info[0], $info[1], $pos);
        
        imagecopymerge($dst,$src,$position[0], $position[1], 0, 0, $info[0], $info[1], 80);

       $func=str_ireplace("/", "", $info["mime"]);

      //返回目标文件和目标文件的输出类型
       return array($dst,$func);

       
     }


/**
 * 获取水印在文件中的位置
 * @param  [type] $dst_w 加水印文件的宽度
 * @param  [type] $dst_h [加水印文件的高度]
 * @param  [type] $src_w [水印的宽度]
 * @param  [type] $src_h [水印的高度]
 * @param  [type] $pos   [位置]
 * @return [type]        [description]
 */
private function get_water_pos($dst_w,$dst_h,$src_w,$src_h,$pos){
          $x=10;
          $y=20;
      switch ($pos) {
         case '1':
            $x=20;
            $y=30;
            break;
         case '2':
            $y=30;
            $x=($dst_w-$src_w)/2;
            break;
         case '3':
            $y=30;
            $x=$dst_w-$src_w-10;
            break;
         case '4':

            $y=($dst_h-$src_h)/2;
             $x=20;
            break;
         case '5':
            $y=($dst_h-$src_h)/2;
            $x=($dst_w-$src_w)/2;
            break;
         case '6':
            $y=($dst_h-$src_h)/2;
            $x=$dst_w-$src_w-20;
            break; 
         case '7':
           $y=$dst_h-$src_h;
           $x=20;
            break;
         case '8':
            $y=$dst_h-$src_h-10;
            $x=($dst_w-$src_w)/2;
            break;
         case '9':
           $y=$dst_h-$src_h-10;
           $x=$dst_w-$src_w-10;
            break;       
      }
        return array($x,$y);
    }

 /**
  * 坚持要加水印的文件的类型
  * @param  [type] $file [description]
  * @return [type]      [description]
  */
  private function check_dst_type($file){
       
       $info=getimagesize($file);//注意filename不是一个资源，而是文件名
       
       switch ($info[2]) {
          case 1:
             return 'imagecreatefromgif';

           case 2:
             return 'imagecreatefromjpeg';

             
          case 3:
             return 'imagecreatefrompng';
            
          
       }
  }

    
 /**
  * 检查文件和环境
  * @param  [type] $file [description]
  * @return [type]       [description]
  */
 private function check($file){
 	if(extension_loaded("GD")&&is_file($file)&& getimagesize($file))
   {
 		return true;
 	}
 }































}
