<!DOCTYPE html>
<html>
<head>
  <meta charset='utf8'>
</head>
<body>
  <div ng-app>
    <p>在输入框中尝试输入：</p>
    <p>
      姓名：
     <input type="text" ng-model="name"></p>
    <p ng-bind="name"></p>
  </div>
    <script type="text/javascript" src="./js/angular.js"></script>
  <!-- // <script type="text/javascript" src="./js/"></script> -->
  <!-- // <script src="//www.w3cschool.cc/try/angularjs/1.2.5/angular.min.js"></script> -->
</body>
</html>