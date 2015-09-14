var myApp = angular.module('ngClassModule', []);

myApp.controller('headCtrl', ['$scope', function($scope) {
  $scope.isError = false;
  $scope.isWarning = false;

  $scope.showError = function(){
    $scope.message="this is error";
    $scope.isError = true;
    $scope.isWarning = false;
  }

    $scope.showWarning = function(){
    $scope.message="this is warning";
    $scope.isError = false;
    $scope.isWarning = true;
  }
 }])