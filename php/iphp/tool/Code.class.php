<?php

class Code{
  private $num;//验证码显示的文字个数
  private $width;//验证码的宽度
  private $height;//验证码的高度
  private $img; //图像资源
  private $font_size;//字体大小
 
	public function __construct($num=4,$width=130,$height=50,$font_size=20){
   $this->num=$num;
   $this->width=$width;
   $this->height=$height;
   $this->font_size=$font_size;
   $this->img=$this->create_img();
	}

	private function create_img(){
		//创建图片资源
		$img=imagecreatetruecolor($this->width, $this->height);
		//创建图片颜色
		$color=imagecolorallocate($img, 255, 255, 255);
		//填充
		imagefill($img, 0, 0, $color);
		
	  return $img;
	}
   private function write(){
     
     $font_file=IPHP_FONT_PATH."arial.ttf";
     $str="123456897qqwertyuwertypasdfghjkzxcvbnm";
    $length=strlen($str);
    $_tmp='';
    for($i=0;$i<$this->num;$i++){
    	$d=mt_rand(0,$length-1);
    	
    	$_tmp.=$str[$d];
    }
     $code=strtoupper($_tmp);
     $x=($this->width)/($this->num);
     
      for($j=0;$j<strlen($code);$j++){
      	$color=imagecolorallocate($this->img,mt_rand(60,200),mt_rand(60,200),mt_rand(60,200));
      	 imagettftext($this->img, $this->font_size, mt_rand(-20,20), $x*$j+5, $this->height-10, $color, $font_file, $code[$j]);
      }
   	
      
       
   }

  private function line_pixel(){
     for($i=0;$i<1000;$i++){
     	$color=imagecolorallocate($this->img, mt_rand(60,200), mt_rand(60,200),mt_rand(60,200));
       imagesetpixel($this->img, mt_rand(0,$this->width), mt_rand(0,$this->height),$color);
     }
     for($i=0;$i<10;$i++){
     	$color=imagecolorallocate($this->img, mt_rand(60,200), mt_rand(60,200),mt_rand(60,200));
     	imageline($this->img, mt_rand(0,$this->width), mt_rand(0,$this->height), mt_rand(0,$this->width), mt_rand(0,$this->height), $color);
     }
  }

	public function show(){
	// header("content-type:image/png");
		$this->write();
		$this->line_pixel();
             return $this->img;
	}
}