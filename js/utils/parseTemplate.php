<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>parseTemplate</title>

</head>
<body>
  <div class="wrap">
  </div>
<script type="text/template" id="template">
    <h1>{name}</h1>
    <p>{age}</p>
    <p>{img}</p>
</script>


  <script type="text/javascript">
  var data = [
    {
      name:'miao',
      age: 23
    },
    {
      name: 'hong',
      age:25
    }
  ]
var tpl = document.querySelector('#template');

function parseTemplate(tpl, data){
  // 要注意模板里面的标签在数据里面不存在
  var len = data.length,
  i=0;
  html = '';

  for(; i<len; i++){
    html += replaceTag(data[i]); 
  }

  function replaceTag(data){
    var temTpl;
    for(var key in data){
      var reg = new RegExp("{"+key+"}", 'ig');
      temTpl = (temTpl || tpl).replace(reg, data[key]);
    }
    return temTpl;
  }

  return html;
}

var html = parseTemplate(tpl.innerHTML, data);

document.querySelector('.wrap').innerHTML = html;

  </script>
</body>
</html>