#服务器
能提供服务的都是服务器
能提供定位，告诉别人在什么地方提供服务

#客户端
需要服务,能发起请求就叫客户端
浏览器 命令行 app

#数据

#协议
人与人的通信
1.传输手段 声波  无线电
2.彼此都懂得一种语言
3.数据封装的格式
计算机世界里
1.传输手段  网络 光仟 网卡
1.数据 二进制
3.格式 共同协商的一种语言

#一个普通网站的访问流程(netstat, curl(向服务器发起请求得到响应))
1.浏览器(其它的客户端)向服务器发送一个请求
2.先解析域名，DNS域名解析服务器(chrome->搜索操作系统的缓存->读取本地host文件->真正的DNS服务器)

3.客户端通过随机端口通过TCP三次握手，与服务器建立连接
4.浏览器要发送http请求
5.服务器接收到浏览器的请求，解析路径和请求参数，经过后台处理产生响应页面
6.浏览器收到服务器的响应,进行html解析
7.当浏览器解析到当前的HTML还引用了别的资源，会在发起请求，取回所需要的资源
8.浏览器用html和后面得到的css js进行渲染页面，绑定事件...
9.用户与页面交互的时候，还会执行相应的回调
10.交互过程中有可能向服务器索取或提交额外的数据(提交表单，走ajax表单)
    1)看chrome的dns缓存
    2)netstat查看本地和远程ip的端口
    3)curl向服务器发起请求得到响应
    4)curl http://www.localhost:8080
    5)curl -v http://www.localhost:8080
    6)curl -H 'name:miaozhirui' -v http://www.localhost:8080添加一个自定义请求头
    7)curl -H 'name:miaozhirui' -H 'age:6' -v http://localhost:8080 添加多个自定义请求头




##URL统一资源定位符
请求的方法 请求的路径 请求的协议
> GET / HTTP/1.1
请求头
> User-Agent: curl/7.43.0客户端版本
> Host: localhost:8080请求主机和端口
>Connection: keep-alive保持连接，不断开，已方便后期再次连接来节省时间
>Content-Type:application/x-www-form-urlencoded告诉服务器发送数据的类型(告诉服务器请求体的类型)
> Accept: */*可以接收的文件类型
>Content-Length:16告诉服务器请求内容的长度

响应头
协议版本  状态码  状态码的英语短语
< HTTP/1.1 200 OK
< Date: Sun, 06 Dec 2015 05:15:03 GMT响应实时间
< Connection: keep-alive
<Content-Type:text/html告诉客户端响应内容的类型
< Transfer-Encoding: chunked传输的编码(按块的方式去传输内容，服务器先传递一部分资源，然后过一段时间在传递另外一部分资源)
<
* Connection #0 to host localhost left intact


#响应码
1xx 请求正在处理中 101
2xx 成功
3xx 重定向
4xx 客户端错误
5xx 服务器错误（请求的路径是对的，但是服务器挂了）









