<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>Document</title>
  <style type="text/css">
    .wrap{
      width:100px;
      height:100px;
      background: red;
    }
    .wrap1{
      width:400px;
      height:400px;
      background: green;
    }
    .wrap1-inner{
      width:100px;
      height:100px;
      background: purple;
    }
  </style>
</head>
<body>
  <div class="wrap"></div>
  <div class="wrap1">
    <div class="wrap1-inner"></div>
  </div>
  <script type="text/javascript">
  // addEventListener的第三个参数默认的是false也就是冒泡阶段，如果设置成true就是捕获阶段
  document.querySelector('.wrap1').addEventListener('click', function(e){
    console.log('wrap1')
  })
  document.querySelector('.wrap1-inner').addEventListener('click', function(){
    console.log('.wrap1-inner')
  })
  // document.querySelector('.wrap1').addEventListener('touchstart', function(e){
    //阻止浏览器继续处理当前的事件默认的行为
    //并且阻止当前区域内的鼠标事件
  //   e.preventDefault()
  //   console.log('.wrap1')
  // },false)
  // document.querySelector('.wrap').addEventListener('click', function(e){
  //   console.log('.wrap')
  // }, false)
  // document.querySelector('.wrap1-inner').addEventListener('click', function(e){
  //   console.log('.wrap1-inner')
  // })
  // document.querySelector('.wrap').addEventListener('click', function() {
  //   console.log('click')
  // })
  // document.querySelector('body').addEventListener('touchstart', function(e){
  //   e.preventDefault();
  //   console.log('touchstart')
  // }, false)
  //   document.querySelector('body').addEventListener('click', function(e){
  //   console.log('click')
  // }, false)
  //   document.querySelector('body').addEventListener('touchend', function(e){
  //   e.preventDefault();
  //   console.log('touchend')
  // }, false)
  </script>
</body>
</html>