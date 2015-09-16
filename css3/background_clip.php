<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>background_clip</title>
  <style type="text/css">
      body{
        background: red;
      }
    .box{
      width:100px;
      height:100px;
      margin:0 auto;
      margin-top: 100px;
      background: #fff;
      border:10px solid rgba(0,0,0,0.05);
      border-radius: 50%;
      -webkit-background-clip: padding;
    }
  </style>
</head>
<body>
  <div class="box"></div>
</body>
</html>