<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>工厂模式</title>
    <!-- 什么时候时候工厂模式
            1.对象的构建十分复杂
            2.需要依赖具体环境创建不同实例
            3.处理大量具有相同属性的小对象
     -->
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
    
    // 实例二(有这样的需求，页面不确定要插入文本，链接，图片)
    var page = page || {}
    page.dom = page.dom || {}

    page.dom['text'] = function() {
        this.insert = function(where) {
            var txt = document.createTextNode(this.url);
            where.appendChild(txt);
        }
    }
    page.dom['link'] = function() {
        this.insert = function(where) {
            var link = document.createElement('a');
            link.href = this.url;
            link.appendChild(document.createTextNode(this.url));
            where.appendChild(link)
        }
    }
    page.dom['img'] = function() {
        this.insert = function(where) {
            var img = document.createElement('img');
            img.src = this.url;
            where.appendChild(img)
        }
    }
    page.dom.factory = function(type) {
        return new page.dom[type];
    }

    var obj = page.dom.factory('img');
    obj.url = 'http://www.baidu.com';
    obj.insert(document.body);
    </script>
</body>
</html>