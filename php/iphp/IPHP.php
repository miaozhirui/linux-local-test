<?php

//框架单文件入口
final class IPHP{
	static public function run(){
		if(!defined("APP_NAME")){
			echo "你没有定义APP_NAME常量";
			exit;
		}
		//定义基本常量
		self::set_define();
		//加载核心文件
		self::load_core_file();
		//运行app

		Application::run();
	
	} 
   static private function load_core_file(){
   	$files=array(IPHP_PATH."Application.class.php",
   		           IPHP_PATH."functions/functions.php",IPHP_SMARTY_PATH."smarty.class.php");
   	foreach($files as $v){
   		require $v;
   	}
   }
	static private function set_define(){
		//设置调试常量
		defined("DEBUG") or define("DEBUG",false);
		//框架根目录
		define("IPHP_PATH",dirname(__FILE__)."/");
		//定义配置文件目录
		define("IPHP_CONFIG_PATH",IPHP_PATH."config/");
		//定义模板文件目录
		define("IPHP_TPL_PATH",IPHP_PATH."Tpl/");
		//定义扩展文件目录
		define("IPHP_ORG_PATH",IPHP_PATH.'org/');
	  //smarty文件目录
	   define("IPHP_SMARTY_PATH",IPHP_ORG_PATH."libs/");
	   //字体文件目录
	   define("IPHP_FONT_PATH",IPHP_PATH."data/font/");
     	//网站根目录
		define("ROOT_PATH",dirname($_SERVER['SCRIPT_NAME']));
		//网址
		define("__ROOT__",'http://'.$_SERVER['HTTP_HOST'].ROOT_PATH);
		define("__WEB__",'http://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME']);

	}
}

IPHP::run();