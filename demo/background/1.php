<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
  <style type="text/css">
    .background{
      width:200px;
      height:200px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
    }
    .background::before{
      content:'';
      display:block;
      width:100%;
      height:100%;
      position: absolute;
      top:0px;
      left:0px;
      border:20px solid rgba(0,0,0,0.4);
      border-radius: 50%;
      box-sizing: border-box;
    }
    .background img{
      width:100%;
      height:100%;
    }
  </style>
</head>
<body>
  <div class="background">
    <img src="lvyou_02.jpg">
  </div>
</body>
</html>