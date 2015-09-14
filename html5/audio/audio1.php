<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <audio height="100" width='100' controls>
    <source src="./music/mother.mp3" >  
  </audio>
  <button>播放</button>
  <script type="text/javascript" src="../../js/jquery-1.8.3.js"></script>
  <script type="text/javascript">
  var btn = document.querySelector('button');
  btn.addEventListener('click', playMusic, false);
  function playMusic(){
    if(!$('audio').hasClass('play')){
      $('audio').addClass('play');
      document.querySelector('audio').play()
    } else {
      $('audio').removeClass('play');
      document.querySelector('audio').pause();
    }
  }
  </script>
</body>
</html>