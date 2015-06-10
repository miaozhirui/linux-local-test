<!DOCTYPE html>
<html lang="en" ng-app="ngClassModule">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style type="text/css">
  .error{background: red;}
  .warning{background: yellow}
  </style>
</head>
<body>
  <div ng-controller="headCtrl">
    <p ng-class="{error: isError, warning: isWarning}" ng-bind="message"></p>
    <button type='button' ng-click="showError()">showError</button>
    <button type='button' ng-click="showWarning()">showWarning</button>
  </div>
  <script type="text/javascript" src="./js/angular.js"></script>
  <script type="text/javascript" src="./js/ng_class.js"></script>
</body>
</html>