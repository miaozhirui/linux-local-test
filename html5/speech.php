<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
<input type="text" class="text" x-webkit-speech/>
<input type="text" placeholder="输入 回车搜索" autofocus x-webkit-speech x-webkit-grammar="builtin:translate">
  <script>
function speak(textToSpeak) {
   //创建一个 SpeechSynthesisUtterance的实例
   var newUtterance = new SpeechSynthesisUtterance();

   // 设置文本
   newUtterance.text = textToSpeak;

   // 添加到队列
   window.speechSynthesis.speak(newUtterance);
}
window.speechSynthesis.getVoices();
speak('Welcome to Smashing Magazine');

  </script>
</body>
</html>