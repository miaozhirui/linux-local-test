<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>倒计时</title>
  <style type="text/css">
    div{
      height:100px;
    }
  </style>
</head>
<body>
  <div class="daojishi" id='7'></div>
  <div class="a" id='8'></div>
  <div class="c" id='15'></div>
  <script type="text/javascript">
  var dao = document.querySelector('.daojishi');
  var a = document.querySelector('.a');
  var c = document.querySelector('.c');

  function dAnimate(options) {
    var time = +time, ele = options.ele, time = options.time, callback= options.callback,
    timer = setInterval(changeNum,1000);

    function changeNum(){
      time == 0 && clearInterval(timer);
      time == 0 ? (ele.innerHTML = '') || callback && callback() : ele.innerHTML = time--;
    }
    changeNum();
  }

  dAnimate({
    ele: dao,
    time: dao.getAttribute('id'),
    callback: function(){
      console.log('已经到0啦')
    }
  })

  </script>
</body>
</html>