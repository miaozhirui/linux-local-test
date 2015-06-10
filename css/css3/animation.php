<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>动画的效果</title>
  <style>

  .box{
    width:100px;
    height:100px;
    background: red;
   -webkit-animation: myfirst 2s ease 0s infinite;
  }
    @-webkit-keyframes myfirst{
  0% {background:red}
  50%{background:blue}
  100%{background:yellow}
  }
  </style>
</head>
<body>
  <div class="box"></div>
</body>
</html>