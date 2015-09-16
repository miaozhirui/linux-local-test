<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style type="text/css">
  .wrapper{
    width:100px;
    height:100px;
    border:1px solid blue;
  }
      .box{
        width:100px;
        height:100px;
        border-radius: 50%;
        /*background: red;*/
        border:1px solid red;
      }
      /*实心上半圆*/
      .top-circle{
        width:100px;
        height:50px;
        line-height: 50px;
        text-align: center;
        border-radius: 50px 50px 0px 0px;
        background:red;
      }
  </style>
</head>
<body>
  <div class="top-circle">
      实心上半圆
  </div>
  <div class="wrapper">
    <div class="box"></div>
  </div>
</body>
</html>