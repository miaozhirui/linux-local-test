<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>canvas1</title>
</head>
<body>
  <canvas width="500" height="500" style="background:#eee" id="canvas"></canvas>
  <script type="text/javascript">
  var canvas = document.querySelector('#canvas');
  var context = canvas.getContext('2d');
  context.fillStyle = "red";
  context.fillRect(0,0,100,100);
  context.strokeStyle = "blue"
  context.moveTo(100,100);
  context.lineTo(300,300);
  context.stroke();
  context.beginPath();
  context.arc(350,100,100,22,2*Math.PI);//x,y
  context.stroke();
  </script>
  <script type="text/javascript">
  canvas.addEventListener('touchmove', function(e) {
    console.log(e) 
  })
  </script>
  <canvas width="500" height="500" id="canvas1" style="background:#eee"></canvas>
  <script type="text/javascript">
  var canvas1 = document.querySelector('#canvas1');
  var context1 = canvas1.getContext('2d');
  context1.font = "30px Arial";
  context1.fillText('hello world',100,200);
  context1.strokeText('hello world', 10, 50);
  </script>
</body>
</html>