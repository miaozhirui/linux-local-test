<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script type="text/javascript">
  //   var a = 1;
  //   var b = 1;
  //   setTimeout(function(){
  //   console.log(a);
  //   console.log(b);
  //   a = 2;
  //   var b = 2;
  //   }, 0);
  //   console.log(a);
  // console.log(b);
  //   a = 3;
  //   b = 3;
    </script>
    <style>
    /*选择器优先级：a:1, . :10, #:100*/
        #userlist .contextmenu li.enabled span a{
            color: gray
            }
            /*100+10+1+10+1=122*/
        div#userlist ul.contextmenu li span a{
            color: black;
            }
            /*1+100+1+10+1+1+1=125*/
    </style>
</head>
<body>
    <div id="userlist">
        <ul class="contextmenu menu">
            <li class="enabled">
              <span>
                    <a href="">test</a>
                </span>
            </li>
        </ul>
    </div>
</body>
</html>