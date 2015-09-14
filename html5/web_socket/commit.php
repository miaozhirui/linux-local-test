<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script type="text/javascript" src="../../js/jquery-1.8.3.js"></script>
  <script type="text/javascript">
//第一种实现的方式
  $i = 0;
  function conn() {
      $.ajax({
        url: '/ajax/commit.php',
        dataType: 'json',
        success: function(data){
            console.log(data)
            $i++ < 10 ? conn() : ''
        }
      })
  }
conn()

// 第二种实现方式，后端不断的向前端发送请求
// var xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function() {
//   if(xhr.readyState==3 && xhr.status == 200){
//     console.log(xhr.responseText);
//   }
// }
// xhr.open('GET', '/ajax/commit.php');
// xhr.send();
  </script>
</head>
<body>
  
</body>
</html>