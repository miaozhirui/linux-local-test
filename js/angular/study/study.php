<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script type="text/javascript" src="../bower_components/angular/angular.js"></script>

</head>
<body>
<div ng-app='myApp' ng-controller="myController">
	<form novalidate name="myForm">
		<div>
			<input type="text" ng-model="user" required>
			<p style="color:red" ng-show="!myForm.user.$valid">必须填写此字段</p>
		</div>
		<button type="submit">submit</button>
	</form>
</div>
<script type="text/javascript">
	
	angular.module('myApp',[]).controller('myController', function($scope){
		$scope.user = '';
	})
</script>



<!-- <div ng-app="myApp" ng-controller="myController">
	<form novalidate>
		firstName:<br/>
		<input type="text" placeholder="填写firstName" ng-model="user1.firstName" required><br/>
		secondName:<br/>
		<input type="text" placeholder="填写secondName" ng-model="user1.secondName"><br/>
		<button ng-click="reset()">reset</button>
		<button type="submit">submit</button>
		<p>user={{user}}</p>
		<p>user1={{user1}}</p>
	</form>
</div> -->
<script type="text/javascript">
	
	// angular.module('myApp',[]).controller('myController', function($scope){
	// 	$scope.user={firstName: 'miaozhirui1', secondName: 'miaozhirui2'};

	// 	$scope.reset = function(){
	// 		$scope.user1 = angular.copy($scope.user);
	// 	}
	// 	$scope.reset();
	// })

</script>
<!-- <div ng-app="myApp" ng-controller="myController">
	<button ng-click="toogle()">toggle</button>
	<div ng-show="isShow" class="toogle">
		<p>{{firstName}}</p>
		<p>{{secondName}}</p>
	</div>
</div> -->
<script type="text/javascript">
	// angular.module('myApp',[]).controller('myController', function($scope){
	// 	$scope.firstName="miaozhirui1";
	// 	$scope.secondName = "miaozhirui2";
	// 	$scope.isShow=false;
	// 	$scope.toogle = function(){
	// 		$scope.isShow = !$scope.isShow;
	// 	}

	// })

</script>
<!-- <div ng-app>
	<button ng-click="count=count+1">点击</button>
	<p>{{count}}</p>
</div>
 --><!-- <div ng-app="myApp" ng-controller="myController">
	<table>
		<tr ng-repeat="item in data">
			<td>{{$index}}</td>

			<td ng-if="$even" style="color:red">{{item.name}}</td>
			<td ng-if="$odd" style="color:blue">{{item.name}}</td>
			<td>{{item.age}}</td>
		</tr>
	</table>
</div> -->

<script type="text/javascript">
	
	// angular.module('myApp', []).controller('myController', function($scope,$http){
	// 	$http.get('/ajax/angular.json').
	// 	success(function(data){
	// 		$scope.data = data;

	// 	}).error(function(xhr){
	// 		console.log(xhr)
	// 	})
	// })
</script>

<!-- <div ng-app='myApp' ng-controller="myController">
	<ul>
		<Li ng-repeat="item in data">
			<h2>姓名：{{item.name}}; 年龄：{{item.age}}</h2>
		</Li>
	</ul>
</div> -->
<script type="text/javascript">
	
	// angular.module('myApp',[]).controller('myController', function($scope,$http){

	// 	$http.get('/ajax/angular.json').
	// 	success(function(data){
	// 		$scope.data = data;

	// 	}).error(function(xhr){
	// 		alert(xhr);
	// 	});

	// 	$http({
	// 		method: 'POST',
	// 		url:'/ajax/commit.php',
	// 		headers:{
	// 			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	// 		},
	// 		data: 'name=miaozhirui&age=11',
	// 	}).
	// 	success(function(data){
	// 		console.log(data)
	// 	}).
	// 	error(function(xhr){
	// 		console.log(xhr)
	// 	})
	// })
</script>


<!-- <div ng-app="myApp" ng-controller="myController">
	<p ng-bind="firstName"></p>
	<p ng-bind="secondName"></p>
	<p ng-bind="fullName"></p>
	<div ng-controller="mycontroller1">
		<p ng-bind="firstName | uppercase"></p>
		<p ng-bind="secondName"></p>
		<p ng-bind="count*5"></p>
		<p ng-bind="person.age1 | currency"></p>
		<p ng-bind="person.age2"></p>
		<p ng-bind="arr[2]"></p>
		
		<ul>
			<li ng-repeat="item in arr" ng-style="$even? mystyle={color:'red'}:''">{{item}}</li>
		</ul>
	</div>
</div> -->
<script type="text/javascript">
		// var app = angular.module('myApp',[]);
		// app.controller('myController', function($scope){
		// 	$scope.firstName  = "miaozhirui1";
		// 	$scope.secondName = "miaozhirui2";
		// 	$scope.fullName = $scope.firstName+$scope.secondName;
		// })
		// app.controller('mycontroller1', function($scope){

		// 	$scope.firstName = "miao1";
		// 	$scope.secondName = "miao2";
		// 	$scope.count=5;
		// 	$scope.person = {
		// 		age1:100,
		// 		age2:200
		// 	}
		// 	$scope.arr = [1,2,3,4,5];
		// })
</script>
<!-- <div  ng-app='' ng-init="name='miaozhirui'">
	<input type="text" ng-model="name" placeholder="请输入您的姓名:">
	<p ng-bind="name"></p>
	<span>{{5+5}}</span>
</div> -->
</body>
</html>