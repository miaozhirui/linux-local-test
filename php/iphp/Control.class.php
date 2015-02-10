<?php

class Control{
    public $_var=array();
    public  $smarty;
  public function __construct(){
    $this->smarty=new smarty();
    $this->smarty->template_dir=TPL_PATH;//调用页面所放的目录
    $this->smarty->compile_dir=TPL_PATH."compile";
    $this->smarty->cache_dir=TPL_PATH."cache";

   is_dir( $this->smarty->compile_dir) or mkdir( $this->smarty->compile_dir,0755,true);
   is_dir( $this->smarty->cache_dir) or mkdir( $this->smarty->cache_dir,0755,true);
  }


  public function __set($key,$value){

    $this->assign($key,$value);
  }

  public  function assign($key,$value){
        $this->smarty->assign($key,$value);
  }

  public function display($file=null){
    if(is_null($file)){
          $file=METHOD.".html";
    }else{

      $file=substr($file,-5)==".html"?$file:$file.".html";
    }

    //在初始化的时候已经指定模版目录和编译目录
   $this->smarty->display($file);
  }

 protected function success($msg,$url=null){
 	//success方法传进来的参数，在display方法不能直接用，需转换成类属性才可以用
  $smarty=new smarty();
   $smarty->template_dir=APP_NAME."/tpl/public/";//调用页面所放的目录
    $smarty->compile_dir=APP_NAME."/tpl/public/compile/";
    is_dir($smarty->compile_dir) or mkdir($smarty->compile_dir,0755,true);
   $smarty->assign("msg",$msg);
   $smarty->assign("url",$url);
   $smarty->assign('web',__WEB__);
   $smarty->display("success.html");

 //这个$this->smarty->display($file);$smarty->display("success.html"不一样
      

 }
 protected function error($msg,$url=null){
  //success方法传进来的参数，在display方法不能直接用，需转换成类属性才可以用
  //  //success方法传进来的参数，在display方法不能直接用，需转换成类属性才可以用
    $smarty=new smarty();
   $smarty->template_dir=APP_NAME."/tpl/public/";//调用页面所放的目录
    $smarty->compile_dir=APP_NAME."/tpl/public/compile/";
     is_dir($smarty->compile_dir) or mkdir($smarty->compile_dir,0755,true);
     $smarty->assign('web',__WEB__);
   $smarty->assign("msg",$msg);
   $smarty->assign("url",$url);
   $smarty->display("error.html");

      

 }
  

}