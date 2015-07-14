<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>模仿</title>
  <link rel="stylesheet" type="text/css" href="fullPage.js/jquery.fullPage.css">
  <script src="../../js/jquery-1.8.3.js"></script>
  <script type="text/javascript" src="fullPage.js/jquery.fullPage.js"></script>
</head>
<body>
  <div id="fullpage">
    <div class="section" style="">1今天的天气不错啊</div>
    <div class="section">2 section</div>
    <div class="section">3 section</div>
    <div class="section">4 section</div>
</div>
<div class="section">
    <div class="slide"> Slide 1 </div>
    <div class="slide"> Slide 2 </div>
    <div class="slide"> Slide 3 </div>
    <div class="slide"> Slide 4 </div>
</div>
<ul id="myMenu">
    <li data-menuanchor="firstPage" class="active"><a href="#firstPage">First section</a></li>
    <li data-menuanchor="secondPage"><a href="#secondPage">Second section</a></li>
    <li data-menuanchor="thirdPage"><a href="#thirdPage">Third section</a></li>
    <li data-menuanchor="fourthPage"><a href="#fourthPage">Fourth section</a></li>
</ul>
<script type="text/javascript">
  $(document).ready(function() {
    $('#fullpage').fullpage({
    anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
    menu: '#myMenu'
});
});
</script>
</body>
</html>