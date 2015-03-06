<!DOCTYPE html>
<html>
  <head>
    <title>JS实现自定义右键菜单</title>
    <meta charset="utf8">
    <meta http-equiv="content-type" content="text/html; charset=gbk">
    <script src="http://api.51ditu.com/js/ajax.js"></script>
 
    <style type="text/css">
        #container {
            text-align : center;
            width : 500px;
            height : 500px;
            border : 1px solid blue;
            margin : 0 auto;
             
        }
        .skin {
            width : 100px;
            border : 1px solid gray;
            padding : 2px;
            visibility : hidden;
            position : absolute;
        }
        div.menuitems {
            margin : 1px 0;
        }
        div.menuitems a {
            text-decoration : none;
        }
        div.menuitems:hover {
            background-color : #c0c0c0;
        }
    </style>
<script>      
window.onload = function() {
     
    var container = document.getElementById('container');   
    var menu = document.getElementById('menu');
     
    /*显示菜单*/
    function showMenu() {
 
        var evt = window.event || arguments[0];
         
        /*获取当前鼠标右键按下后的位置，据此定义菜单显示的位置*/
        var rightedge = container.clientWidth-evt.clientX;
        var bottomedge = container.clientHeight-evt.clientY;
 
        /*如果从鼠标位置到容器右边的空间小于菜单的宽度，就定位菜单的左坐标（Left）为当前鼠标位置向左一个菜单宽度*/
        if (rightedge < menu.offsetWidth)                
            menu.style.left = container.scrollLeft + evt.clientX - menu.offsetWidth + "px";             
        else
        /*否则，就定位菜单的左坐标为当前鼠标位置*/
            menu.style.left = container.scrollLeft + evt.clientX + "px";
         
        /*如果从鼠标位置到容器下边的空间小于菜单的高度，就定位菜单的上坐标（Top）为当前鼠标位置向上一个菜单高度*/
        if (bottomedge < menu.offsetHeight)
            menu.style.top = container.scrollTop + evt.clientY - menu.offsetHeight + "px";
        else
        /*否则，就定位菜单的上坐标为当前鼠标位置*/
            menu.style.top = container.scrollTop + evt.clientY + "px";
             
        /*设置菜单可见*/
        menu.style.visibility = "visible";              
        LTEvent.addListener(menu,"contextmenu",LTEvent.cancelBubble);
    }
    /*隐藏菜单*/
    function hideMenu() {
        menu.style.visibility = 'hidden';
    }                               
    LTEvent.addListener(container,"contextmenu",LTEvent.cancelBubble);
    LTEvent.addListener(container,"contextmenu",showMenu);
    LTEvent.addListener(document,"click",hideMenu);                     
}
     
</script>
  </head>
   
  <body>
     
    <div id="menu" class="skin">
        <div class="menuitems">
            <a href="javascript:history.back();">后退</a>
        </div>
        <div class="menuitems">
            <a href="javascript:history.back();">前进</a>
        </div>
        <hr>
        <div class="menuitems">
            <a href="http://api.51ditu.com/" target="_blank">地图api</a>
        </div>
        <div class="menuitems">
            <a href="http://www.51ditu.com/traffic/index.html" target="_blank">实时交通</a>
        </div>
        <div class="menuitems">
            <a href="http://www.51ditu.com" target="_blank">地图搜索</a>
        </div>
        <div class="menuitems">
            <a href="http://nav.51ditu.com" target="_blank">驾驶导航</a>
        </div>
        <hr>
        <div class="menuitems">
            <a href="http://uu.51ditu.com" target="_blank">灵图UU</a>
        </div>
        <div class="menuitems">
            <a href="http://lushu.51ditu.com" target="_blank">路书下载</a>
        </div>
        <hr>
        <div class="menuitems">
            <a href="http://www.lingtu.com" target="_blank">关于本站</a>
        </div>
        <div class="menuitems">
            <a href="http://emap.51ditu.com/link/link.html" target="_bland">友情链接</a>
        </div>
    </div>
     
    <div id="container">      
        <p>右键此区域</p>
    </div>
  </body>
</html>