<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>工厂模式</title>
</head>
<body>
    <script type="text/javascript">
    // 实例一
    var product = {}
    product.createA = function() {
        console.log('createA')
    }
    product.createB = function() {
        console.log('createB')
    }

//只提供接口，不需要关心内部具体是如何实现的，只给需要做什么的类型，内部就帮忙实现就可以了
    product.factory = function (createType) {
        return new product[createType];
    }
    // product.factory('createB')
    
    // 实例二
    var page = page || {}
    var page.dom = page.dom || {}

    
    </script>
</body>
</html>