<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>flex的布局</title>
<meta name="viewport" content="width:device-width, initial-scale=1, maximum-scale=1, user-scalabel=no">  
<style type="text/css">
  *{
    margin:0;
    padding:0;
  }
  .footer{
    width:100%;
    height:100px;
    border:1px solid purple;
    display:flex;
    flex-direction:row-reverse;
    flex-direction:row;
    flex-wrap:wrap;
/* flex-flow:是flex-direction和flex-wrap的简写*/
    justify-content:center;//在主轴方向上的对齐方式
    justify-content:flex-start;
    justify-content:flex-end;
    justify-content:space-between;
    justify-content:space-around;
    /*align-items: flex-start;*/
    align-items: flex-end;
    align-items: center;
    align-items: baseline;
    align-items: stretch;

  }
  .footer button{
    height:50px; 
    flex:1; 
     width:50px;
    border:none;
    border-right:1px solid blue;
  }
  .footer button:nth-child(1){
    background:red;
    order:3;
    flex-grow:2;
    flex-shrink:0;
//     width:500px;
  }
  .footer button:nth-child(2){
    height:60px;
    order:2
    flex-basis:10px;
  }

  .footer button:nth-child(3){
    height:80px;
    order:4;
  }
/*//用了display:flex的属性之后，float clear vertical-align将失效*/




.grid{
  width:100%;
  height:100px;
  border:1px solid red;
  margin-bottom:50px;
  display:flex;
}
.grid div{
  flex:1;
  height:100px;
  background:blue;
}
.grid div:nth-child(2){
  background:purple;
  margin-left:20px;
}






.grid1{
  width:100%;
  height:100px;
  border:1px solid red;
  margin-bottom:50px;
  display:flex;
}
.grid1 div{
  flex:1;
  height:100px;
  background:blue;
}
.grid1 div:nth-child(1){
  background:blue;
  flex:0 0 25%;
}
.grid1 div:nth-child(2){
  background:purple;
   flex:0 50%;
}


.form{
  display: flex;
}
.form .desc{
  width:50px;
  height:100px;
  background:#ccc;
}
.form .input {
  flex:1;
  background: red;
}
.form .button{
  width:100px;
  height:100px;
}
.fix-footer{
  /*拿到的是浏览器的高度和宽度*/
  width:100vw;
  height:100vh;
  border:1px solid red;
  /*display: flex;*/
  flex-direction:column;
}
.fix-footer .header{
  width:100%;
  height:100px;
  background: red;
}
.fix-footer .content{
  flex:1;
}
.fix-footer .footer{
  width:100%;
  height:100px;
  background: blue;
}
</style>
</head>
<body>
<!-- 圣杯布局开始 -->
  
<!-- 圣杯布局结束 -->
<!-- 底部固定布局 -->
<div class="fix-footer">
  <div class="header">头部</div>
  <div class="content"></div>
  <div class="footer">底部</div>
</div>
<!-- 底部固定布局结束 -->
<!-- 表单布局 -->
<div class="form">
    <span class="desc"></span>
    <input type="text" class="input">
    <button class="button"></button>
  </div>
<!-- 表单布局结束 -->
<!-- 网格布局 -->
  <section class="grid1">
    <div class="cell1"></div>
    <div class="cell2"></div>
  </section>
  <section class="grid">
    <div class="cell1"></div>
    <div class="cell2"></div>
  </section>
<!-- 网格布局结束 -->
  <footer class="footer">
    <button class='cancel'>1</button>
    <button>2</button>
    <button class="confirm">3</button>
    <button>4</button>
    <button>5</button>
    <button>6</button>
  </footer> 
  <script type="text/javascript">
      var ele = document.querySelector('body');
      var content = document.querySelector('.fix-footer .content')
      var obj = {}
      for(var i in document.body.width) {
        obj[i] = ele[i]
      }
      content.offsetHeight=100
  </script>
</body>
</html>