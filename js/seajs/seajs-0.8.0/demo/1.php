<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <script type="text/javascript" >
  function loadScript(src){
      var script = document.createElement('script');
      script.src = src;
      
      script.addEventListener('load', function(){
        console.log('加载完成')
      })
      script.addEventListener('error', function(){
        console.error(src+' is not exist');
      })
      document.querySelector('head').appendChild(script)
  }

  loadScript('../src/module/module.js');
  </script>
</body>
</html>