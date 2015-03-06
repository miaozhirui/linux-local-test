<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <script type="text/javascript">
    var car = {
        name: 'miaozhirui'
    }
    var myCar = Object.create(car, {
        add: function() {},
        remove: function() {}
    });
    console.log(myCar);
    </script>
</body>
</html>