<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script type="text/javascript" src="jquery.js"></script>
  <style type="text/css">
  *{
    padding:0px;
    margin:0px;
  }
  li{
    list-style:none;
    width:200px;
    /*height:40px;*/
    cursor: pointer;
    text-align: center;
    border:1px solid red;
    border-top: 0px;
  }
  li h1{
    height:40px;
    line-height: 40px;
  }
  li div{
    width:100%;
    height:300px;
    display: none;
  }
  li:nth-child(1){
    border-top: 1px solid red;
  }
  </style>
</head>
<body>
  <ul>
    <li>
      <h1>一</h1>
      <div>
       <pre>
         
       </pre>
      </div>
    </li>
    <li>
    <h1>二</h1>
    <div>33</div>
    </li>
    <li>
      <h1>三</h1>
      <div></div>
    </li>
  </ul>
  <script type="text/javascript">
  var page = {
    init: function(){
      this.bindEvent()
    },
    bindEvent: function(){
      $li = $('li');
      $li.on('click', this.showChildrenDiv)
    },
    showChildrenDiv: function(e){
      var $currentTarget = $(e.currentTarget);

      $currentTarget.siblings('li').find('div').slideUp();
      $currentTarget.find('div').slideDown();
    }
  }

  page.init()
  </script>
</body>
</html>