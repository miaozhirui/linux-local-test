<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>vue1</title>
  <style type="text/css">
    li.done{
      text-decoration: line-through;
      color:#666;
    }
  </style>
</head>
<body>
<div id="demo">
  <h1>{{title | uppercase}}</h1>
  <ul>
   <li v-repeat="todos" v-on="click: done = !done" class="{{done ? 'done' : ''}}">{{content | pluralize 'item'}}</li>
  </ul>
</div>
<script type="text/javascript" src="../vue/dist/vue.js"></script>  
<script type="text/javascript">
  var demo = new Vue({
    el: "#demo",
    data: {
      title: 'todos',
      todos:[
        {
          done: true,
          content: 'Learn Javascript'
        },
        {
          done: false,
          content: 'Learn vue.js'
        },
            {
          done: false,
          content: '200000'
        }
      ]
    }
  })
</script>
</body>
</html>