<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script type="text/javascript">
    // http请求是无状态的
    // 过程一般访问7个步骤
    // 1.建立tcp链接
    // ２.web浏览器向web服务器发送请求命令
    // ２.web浏览器向web服务器发送请求头
    // 4.web服务器应答
    // 5.web服务器发送应答信息
    // 6.web服务器向浏览器发送数据
    // 7.web服务器关闭tcp连接
    
    //http请求一般由四个部分组成
    //1.http请求的方法或动作，post或get
    //2.请求的url
    //3.请求的头
    //４.请求体
    </script>
</head>
<body>
    <script type="text/javascript">
    // XHR = {
    //     open(method,url,async)//method:请求方法,url:请求的url,默认是异步async默认为true
    //     setRequestHeader("Content-type","application/x-www-form-urlencoded");设置请求头信息
    //     send(string)//把请求发送到服务器,get请求string可以不填，但是post请求string是一定要填写的
    // }
    // 
    var XHR =  new XMLHttpRequest();
    //客户端发送到服务器
    XHR.open('GET','./data/ajax.php',true);//配置xhr的一些信息
    XHR.send()//发送到服务器

    XHR.onreadystatechange = function() {
        if(XHR.readyState===4 && XHR.status===200) {
            console.log(XHR.responseText)
        }
    }
    //获得服务器的响应
    //responseText: 获得字符串形式的响应数据
    //responseXML: 获得xml形式的响应数据
    //status和statusText: 以数字和文本形式返回HTTP状态码
    //readyState属性{这个属性没每化一次，就会触发onreadystatechange这个函数
    //          0: 请求未初始化，open还没有调用
    //          1: 服务器连接已建立，open已经调用了
    //          2: 请求已接受，也就是接收到头信息了
    //          3: 请求处理中，也就是接受到了请求主体了
    //          4: 请求已完成，也就是响应完成了
    //}
    //getAllResponseHeader(): 获取所有的响应报头
    //getResponseHeader(): 查询响应中的的某个字段的值
    </script>
</body>
</html>