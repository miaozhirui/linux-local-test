<?php
// 应用程序
final class  App {
    static public function run() {
            self::setDefine();
            self::loadCoreFile();

            self::runApp();
     }

    static public function runApp() {
        $view = VIEW;
        $obj = new mainController();

        if(!method_exists($obj, '_' . $view)) {

           echo  "<h1 style='text-align:center; margin-top:50px;'>你可能是想访问<span style='color:red; font-weight:700;'>/view/{$view}.ctp</span>页面，但是系统没有找到这个文件!</h1>
               <h1 style='text-align:center; margin-top:20px;'>请检查你是否建了此文件</h1>
                     <h1 style='text-align:center; margin-top:20px;'>如果你确定建了此文件，请查看<span style='color:red; font-weight:700;'>/php/Controller/mainController.php</span>这个文件是否有
                     </h1>
                     <h2 style = 'text-align:left; width:600px; margin:0 auto; color:green;'>
                                        public function _$view() {<br>
                                              \$this->pageName = '$view';<br>
                                              \$this ->view();<br>
                                            }
                     </h2>
                     <h1 style='text-align:left; margin:0 auto; width:600px; margin-top:20px;'>如果没有的话，请把它复制过去</h1>
                        <h1 style='text-align:left; margin:0 auto; width:600px; margin-top:20px;'>再刷新 一下就ok!!!</h1>
                    ";
            exit;
        }
        $method = '_' . $view;
        $obj -> $method();
     }

     static public function loadCoreFile() {
        $file = array(
                FILE_PATH . 'Controller' . '/baseController.php',
                FILE_PATH . 'Controller' . '/mainController.php'
            );

        foreach($file as $f) {
            require_once($f);
        }

        
     }

     static public function setDefine() {
        $view = isset($_GET['v']) ? $_GET['v'] : 'index';
        define('FILE_PATH', dirname(__FILE__) . '/');
        // 网站更目录
        define("__WEB__", "http://" . $_SERVER['HTTP_HOST'].'/');
        define('VIEW' , $view);
     }


}

App::run();