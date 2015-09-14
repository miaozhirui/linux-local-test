<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <script type="text/javascript">
  function cloneDeep(obj){

      var temObj = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};

      if(obj.hasOwnProperty){
        for(var i in obj){
          typeof obj[i] != 'object' ? temObj[i]=obj[i] : temObj[i] = arguments.callee(obj[i]) ;
        }
      }
      return temObj;
  }

// var arr = [1,2,3,4];
// var arr1 = cloneDeep(arr);
// console.log(arr1, arr)

  var obj = {
    name: 'miaozhiuir',
    age: '111',
    inner: {
      name: 'miaozhirui',
      age: '12'
    },
    say: function(){
      console.log('1')
    },
    innerArr:[
    {name:'miao1'},
    {name:'miao2'},
    {name:'miao3'}
    ]
    }

  var obj1 = cloneDeep(obj);
  obj1.say = function(){
    console.log('2')
  }
  // obj.say()
  // obj1.say()
  console.log(obj)
  console.log(obj1)
  </script>
</body>
</html>