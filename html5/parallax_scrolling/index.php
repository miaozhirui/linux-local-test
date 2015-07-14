<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>视差滚动</title>
  <style>
  html,body{
    height:100%;
  }
    .article{
      width:100%;
      height:100%;
      background-attachment: fixed;
      background-repeat: no-repeat;
      background-size: cover;
      overflow: hidden
    }
    .section1{
      background-image:url(../images/section01.jpg);
    }
    .section1 .title{
      color:#fff;
      left:-500px;
    }
    .section1 .content{
      color:#fff;
      top:900px;
    }
    .section2{
      background-image: url(../images/section02.jpg);
    }
    .section2 .title{
      color:yellow;
      left:-500px;
    }
    .section2 .content{
    top:900px;
    }
    .section3{
      background-image:url(../images/section03.jpg);
    }
    .section3 .title{
      color:black;
      left: -500px;
    }
    .section3 .content{
      top:900px;
    }
    .title{
      position: relative;
      top:360px;
      transition:all 1s;
    }
    .content{
      position: relative;
      top:380px;
      transition:all 1s;
    }
    .title-anim{
      left:0px !important;
    }
    .content-anim{
      top:380px !important;
    }
  </style>
</head>
<body>
  <div class="article1 article section1">
    <div class="title" id="title1">
    章节·一  每当我加班凌晨，独自一人走在黑暗的回家路上
    </div>
    <div class="content" id="content1">
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    </div>
  </div>
  <div class="article section2">
      <div class="title" id="title2" >
    章节·二  每当我加班凌晨，独自一人走在黑暗的回家路上
    </div>
    <div class="content" id="content2">
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    </div>
  </div>
  <div class="article section3">
      <div class="title" id="title3">
    章节·三  每当我加班凌晨，独自一人走在黑暗的回家路上
    </div>
    <div class="content" id="content3">
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    我是内容我是内容我是内容我是内容我是内容我是内容我是内容我是内容
    </div>
  </div>
  <script type="text/javascript">
  // var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var articleHeight = document.querySelector('.article1').clientHeight;
  var title1 = document.querySelector('#title1'),
  title2 = document.querySelector('#title2'),
  title3 = document.querySelector('#title3');
  var content1 = document.querySelector('#content1'),
  content2 = document.querySelector('#content2'),
  content3 = document.querySelector('#content3');
  window.addEventListener('scroll', scrollHandle);

  function scrollHandle(e) {
    var scrollTop = window.scrollY;
    if(scrollTop>-10&&scrollTop<articleHeight){
      title1.classList.add('title-anim');
      content1.classList.add('content-anim');
    } else if(scrollTop>articleHeight-10&&scrollTop<articleHeight*2){
      title2.classList.add('title-anim');
      content2.classList.add('content-anim');
    } else if(scrollTop>articleHeight*2-10&&scrollTop<articleHeight*3){
      console.log(11)
      title3.classList.add('title-anim');
      content3.classList.add('content-anim')
    }
  }
  </script>
</body>
</html>