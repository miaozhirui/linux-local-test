<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <script type="text/javascript">
    var ajax = new XMLHttpRequest();
    ajax.open('GET', './data/ajax.php', true);
    ajax.send();
    // ajax.abort();
    // ajax.onreadystatechange = function(data) {
    //     console.log(ajax.responseText)
    // }
        ajax.onreadystatechange = function(data) {
        if(ajax.readyState==4 && ajax.status ==200){
        console.log(ajax.responseText)
    }
   }
    </script>
</body>
</html>