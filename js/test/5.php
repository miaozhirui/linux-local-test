<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>json循环引用的解决方案</title>
  <script type="text/javascript">
      // function add() {
      //   this.name="miaozhirui";
      //   this.age="25"
      // }
      // var ren = new add();
      // ren.toString = function() {}
      // console.log(ren)
      // var testArr = [{ren: ren}];
      // var json = JSON.stringify(testArr);
      // console.log(json)
      // [{x:1,name:[1]}]
      // {x:1,name:[1]}
      // 1
      // [{x:1,name:[1]}]//到这一步就没有返回值了，就相当于被去掉了
      var a={x:1},
      obj = [a];
      a.name = obj,
      seen = [];
     // console.log(JSON.stringify(obj))
   console.log(JSON.stringify(obj, function(key, val){
    // console.log(key)//0,0,1,name
    // console.log(val) [{x:1,name:[1]}]/{x:1,name:[1]}/1/ [{x:1,name:[1]}]
         if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
              return;
          }
          seen.push(val);
          }
          return val;
      }))
  </script>
</head>
<body>
  
</body>
</html>