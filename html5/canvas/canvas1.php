<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <canvas id="canvas" width="500" height="500"></canvas>
  <script type="text/javascript">
  var canvas = document.querySelector('#canvas');
  var context = canvas.getContext('2d');
  var opt = new Array(
    "source-atop",
    "source-in",
    "source-out",
    "source-over",
    "destination-atop",
    "destination-in",
    "destination-out",
    "destination-over",
    "lighter",
    "copy",
    "xor"
    );
  i = 10;
  context.fillStyle = "blue";
  context.fillRect(10,10,60,60);

  context.globalCompositeOperation = opt[i];

  context.beginPath();
  context.fillStyle = "red";
  context.arc(60,60,30,Math.PI*2, false);
  context.fill();
  </script>
</body>
</html>