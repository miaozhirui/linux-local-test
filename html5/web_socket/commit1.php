<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>comit解决方案</title>
  <script type="text/javascript" src="../../js/jquery-1.8.3.js"></script>
  <script type="text/javascript">
  function conn(){
      $.ajax('/ajax/comit.php',{
    dataType: 'json',
    success: function(data){
      console.log(data);
      conn();
    }
  })
  }
  conn();



// var xhr = new XMLHttpRequest();
// xhr.onreadystatechange=function(){
//   if(xhr.readyState==3 && xhr.status==200){
//     console.log(xhr.responseText);
//   }
// }
// xhr.open('GET','/ajax/comit.php');
// xhr.send()
  </script>
</head>
<body>
  
</body>
</html>