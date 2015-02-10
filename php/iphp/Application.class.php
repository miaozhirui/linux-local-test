<?php
//核心文件
final class Application{
	static public function run(){
		//定义常量
		self::set_define();
   // 运行应用
   C(require IPHP_CONFIG_PATH.'config.php');
   if(is_file(APP_NAME."/config/config.php")){
   	c(require APP_NAME."/config/config.php");
   } 

    self::runApp();
    
	}
	 
	 static private function runApp(){
	 	$app=APP_NAME;$control=CONTROL;$method=METHOD;
	 	if(!is_dir($app)){
	 		self::set_create_file();
	 	}
	 	$classFile=$app."/control/".$control."control.class.php";
	 	//如果文件不存在
	 	if(!is_file($classFile)){
	 	 	echo "{$classFile}文件不存在";
       exit;
	 	}
	
	 	require $classFile;
	 	//如果类不存在
	 	$className=$control."control";
	 	if(!class_exists($className)){
	 		echo "{$className}类不存在";
	 		exit; 
	 	}
	 	$obj=new $className;
	 	//如果方法不存在
	 	if(!method_exists($obj, $method)){
	 		echo "{$method}方法不存在";
	 		exit;
	 	}
	 	$obj->$method();
	 }

   static private function set_create_file(){
     //创建模板文件目录
     mkdir(APP_NAME."/tpl/index",0755,true);
      is_file(APP_NAME."/tpl/index/index.html") or copy(IPHP_TPL_PATH."index.html", APP_NAME."/tpl/index/index.html");
      //创建应用文件目录
      mkdir(APP_NAME."/control",0755,true);
       $data=<<<str
      <?php
       class IndexControl extends Control{
       	public function index(){
       		\$this->display("index.html");
       	}
       } 
        ?>     
str;
  file_put_contents(APP_NAME."/control/indexcontrol.class.php", $data);
  //创建配置文件目录
  
    mkdir(APP_NAME."/config",0755,true);
    is_file(APP_NAME."/config/config.php") or copy(IPHP_CONFIG_PATH."config.php", APP_NAME."/config/config.php");
 //创建公共文件目录
 is_dir(APP_NAME."/tpl/public/") or mkdir(APP_NAME."/tpl/public/",0755,true);
 is_file(APP_NAME."/tpl/public/success.html") or copy(IPHP_TPL_PATH."success.html",APP_NAME."/tpl/public/success.html");
 is_file(APP_NAME."/tpl/public/error.html") or copy(IPHP_TPL_PATH."error.html",APP_NAME."/tpl/public/error.html");
   
 }

	static private function set_define(){
		//应用
		$app=APP_NAME;
		//控制器
		$control=isset($_GET["c"])?$_GET["c"]:"index";
		//方法
		$method=isset($_GET["m"])?$_GET["m"]:"index";

	  
		define("CONTROL",$control);
		define("METHOD",$method);
		define("TPL_PATH",$app."/tpl/index/");

	}

}