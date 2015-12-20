<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script>
    window.onload = function(){
        var oUl = document.getElementById('ul1');

        /*
            元素.childNodes: 只读 属性 子节点列表集合
                标准下: 包含了文本和元素类型的节点，并且也会包含非法嵌套的子节点
                非标准下：只包含元素类型的节点，ie7以下不包含非法嵌套的子节点


                childNodes只包含一级子节点，不包含后辈孙级以下的子节点


            DOM节点的类型有很多种:12种
            
            元素.nodeType: 只读 属性 当前元素的节点类型

            元素节点:1(nodeType)
            属性节点:2
            文档节点:3
            以上三种节点在工作中是比较常见的


        属性
        元素.attributes : 只读 属性 属性列表集合 
            attributes[0].name获取属性的名称
            attributes[0].value获取属性的值
            attributes[0].nodeType获取属性的节点的类型

        */
        
        for(var i=0; i<oUl.childNodes.length;i++){
            oUl.childNodes[i].style.background="red";
        }
    }
    </script>
</head>
<body>
    <ul id="ul1">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</body>
</html>