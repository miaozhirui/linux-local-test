<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <!-- // <script type="text/javascript" src=""></script> -->
</head>
<body>
<iframe src="http://test.miaozhirui-local.com/test.php"></iframe>
  <script type="text/javascript" src="../../js/jquery.js"></script>
  <script type="text/javascript">
  // XMLHttpRequest cannot load http://miaozhirui-lab.com/ajax/cross_domain/jsonp.php. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://miaozhirui-local.com' is therefore not allowed access. 这里的意思是跨域了(子域名不同也会跨域)
  // $.ajax('http://test.miaozhirui-local.com/test.php',{
  //   type: 'get',
  //   dataType: 'json',
  //   success: function(){
  //     console.log(11)
  //   }
  // })

  </script>

   一、<!--jsonp的解决方案 (利用script不受同源策略的影响)jsonp简单，但是只能是get请求-->
  <script type="text/javascript">
    // function add(data){
    //   console.log(data)
    // }
  </script>
  <!-- <script type="text/javascript" src="http://miaozhirui-lab.com/ajax/cross_domain/jsonp.php?callback=add"></script> -->
  <!-- <script type="text/javascript" src="http://miaozhirui-lab.com/ajax/cross_domain/test.js"></script> -->


  二、<!-- document.domain(使用条件：1.协议要相同，端口相同，一级域名相同，页面有其他页面windows的引用，)(页面中document.domain默认值是整个域名，所以即使一级域名相同，那他们的document.domain也不相同)（使用方式就是将页面的document.domain设置为相同的）
  1.x.one.example.com和y.one.example.com可以将document.domain设置为one.example.com,可以设置为example.com
  2.document.domain只能设置为当前域名的一个后缀
   -->
  <script type="text/javascript">
  // console.log(document.domain);
  // 1.如果不把domain设置成相同的话，会报错2Uncaught SecurityError: Blocked a frame with origin "http://miaozhirui-local.com" from accessing a cross-origin frame.
  // document.domain  = 'miaozhirui-local.com';
  // var otherWindow  = window.open('http://test.miaozhirui-local.com/test.php');
  // 在open的时候浏览器新开了一个线程去打开一个新的窗口,下面的代码会继续的执行
  // setTimeout(function(){
  // var wrap = otherWindow.document.querySelector('div');

  // console.log(wrap)
  // },1000)
  //上面的这种情况一般不怎么常用，常用的是在一个页面有个iframe，然后向操作这个iframe里面的元素


  // var iframe = document.querySelector('iframe');
  // document.domain = "miaozhirui-local.com";

  // //这句话的意思是iframe都加载完成之后再执行下面的脚本(这个时候就可以在这个页面任意的操作http://test.miaozhirui-local.com/test.php这个页面了)
  // iframe.onload = function(){
  // console.log(iframe.contentWindow.a)
  // var div = iframe.contentWindow.document.querySelector('.wrap');
  // div.innerHTML='miaozhirui';
  // }

  </script>

<script type="text/javascript">
  三、// window.name的使用(在一个页面里面进行location.href页面跳转的话，window.name 是不会改变的，也就是说在跳转之后的页面我们是可以拿到之前页面的window.name)
//   window.name="miaozhirui";
// location.href = "http://test.miaozhirui-local.com/test.php";
// var iframe = document.querySelector('iframe');
// var data = ''
// iframe.onload = function(){
//   // 这种方式拿数据的话，是拿不到的，因为是不同源的
//   // data = iframe.contentWindow.name
//   iframe.onload = function(){//到这里的话，就可以操作iframe页面里面的window.但是现在不同源，没办法处理，所以在下面要指定iframe.src="about:black"让src页面跳转到一个空白的页面，这个时候跳转之后，window.name是不变的，有因为跳转之后的页面继承了加载该程序页面的同源，所以最终就可以在这个页面处理window.name了
//     data = iframe.contentWindow.name;

//     iframe.contentWindow.document.querySelector('body').addEventListener('click', function(){
//       var div = iframe.contentWindow.document.querySelector('.wrap');
//       console.log(div)
//     })
//   }
//   iframe.src="about:blank";//打开浏览器空白页面的命令
// }

// location.href = "about:blank";
</script>

<script type="text/javascript">
  四、// html5 postMessage(这个方法很强大，无视协议，端口，域名的不同)
  var windowObj = window;
  addEventListener('message', function(e){
    
  })
</script>
</body>
</html>