<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>sessionStorage</title>
</head>
<body>
  <span class="text">0</span>
  <button class="btn">add</button>
  <script type="text/javascript">
  var text = document.querySelector('.text');
  var btn = document.querySelector('.btn');
  if(sessionStorage.text) {
    var num = sessionStorage.text;
  } else {
    var num = 0;
  }
  btn.addEventListener('click', addNum, false);
  function addNum() {
     ++num;
     sessionStorage.text = num;
     showNum();
  }
  function showNum() {
    text.innerHTML = sessionStorage.text;
  }
  showNum()
  </script>
</body>
</html>