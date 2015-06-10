var userInfoModule = angular.module('userInfoModule', []);

userInfoModule.controller('userInfoCtrl', ['$scope', function($scope) {
  $scope.userInfo = {
    email: '123456@qq.com',
    password: '123456',
    autoLogin: true
  };

  $scope.getFormData = function() {
    console.log($scope.userInfo);
  }
  $scope.setFormData = function() {
    $scope.userInfo = {
      email: '1078142728@qq.com',
      password: '654321',
      autoLogin: false
    };
  }
  $scope.resetFormData = function() {
    $scope.userInfo = {
      email: '123456@qq.com',
      password: '123456',
      autoLogin: true
    };
  }
}])