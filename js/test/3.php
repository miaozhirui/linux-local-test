<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>动画模拟</title>
    <script src="../jquery-1.8.3.js"></script>
    <style>
        body{padding-top: 500px;}
        article,div{margin: 380px 0;border: solid 1px gray;}
        article > section{width:50px;height:50px;background:red;transform: translate3d(-100px, -60px, 0);opacity: 0;transition: all .8s;}
        article > section.visible {transform: translate3d(0, 0, 0);opacity: 1;}

        div > span{background:blue;transform: scale(.2);opacity: 0;transition: all 2s;}
        div > span.visible {transform: scale(1);opacity: 1;}

        div > p {width:50px;height:50px;background:yellow;transform: translate3d(90px, 100px, 0);opacity: 0;transition: all 1.5s;}
        div > p.visible {transform: translate3d(0, 0, 0);opacity: 1;}
    </style>
    <script>
        $(function(){
            var elmArr = [],
                $win = $(window);
            $(".visible").each(function(i,elm){
                $(elm).data("ot",$(elm).offset().top);
                elmArr.push(elm);
            });

            dealClass(1);
            $win.on("scroll",dealClass);

            function dealClass(isRemove){
                var top = $win.height() + $win.scrollTop();
                if(isRemove!=1) { //滚动页面时的判断，并添加class="visible"
                    for (var i = 0,$elem; i < elmArr.length; i++) {
                        $elem = $(elmArr[i]);
                        if ($elem.data("ot") <= top) {
                            $elem.addClass("visible");
                            elmArr.splice(i, 1);
                            --i;
                        }
                    }
                }else{  //初始化页面时的判断，并删除class="visible"
                    for (var i = 0,$elem; i < elmArr.length; i++) {
                        $elem = $(elmArr[i]);
                        if ($elem.data("ot") >= top) {
                            $elem.removeClass("visible");
                        }
                    }
                }
            }
        })
    </script>
</head>
<body>
<article>
    <section class="visible"></section>
</article>
<div>
    <span class="visible">hello</span>
</div>
<div>
    <p class="visible"></p>
</div>
</body>
</html>