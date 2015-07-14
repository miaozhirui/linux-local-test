<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <!-- 
    shadeOffsetX
    shadeOffsetY
    shadeColor
    shadeBlur
   -->
  <canvas width="500" height="500" id="canvas"></canvas>
  <script type="text/javascript">
  draw('#canvas');
  function draw(id) {
    var canvas = document.querySelector(id);
    var context = canvas.getContext("2d");
    context.fillStyle = "#eeeeef";
    context.fillRect(0,0,500,500);
    context.shadowOffsetX = 10;
    context.shadeOffsetY  = 10;
    context.shadeColor = "rgba(100,100,100,0.5)";
    context.shadeBlur = 7.5;
    context.translate(0, 50);
    for(var i = 0; i<3; i++){
      context.translate(50,50);
      create5Star(context);
      context.fill();
    }
    
  }
  function create5Star(context) {
    var dx =100;
    var dy=0;
    var s=50;
    context.beginPath();
    context.fillStyle="rgba(255,0,0, 0.5)";
    var x = Math.sin(0);
    var y = Math.cos(0);
    var dig = Math.PI /5*4;
    for(var i=0;i<5;i++){
      var x = Math.sin(x*dig);
      var y = Math.cos(i*dig);
      context.lineTo(dx+x*s,dy+y*s);
    }
    context.closePath();
  }
  </script>
</body>
</html>