<!DOCTYPE html>
<html lang="en" ng-app="userInfoModule">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link rel="stylesheet" type="text/css" href="../bower_components/bootstrap/dist/css/bootstrap.min.css">
    <script type="text/javascript" src="./js/angular.js"></script>
<script type="text/javascript" src="./js/form.js"></script>
</head>
<body>
  <div class="panel panel-primary">
      <div class="panel-heading">
        <div class="panel-title">双向数据绑定</div>
      </div>
      <div class="panel-body">
        <div class="row">
          <div class="col-md-12">
            <form action="" class="form-horizontal" role="form" ng-controller='userInfoCtrl'>
              <div class="form-group">
                <label for="" class="col-md-2 control-label">
                  邮箱:
                </label>
                <div class="col-md-10">
                  <input type="email" class="form-control" placeholder='请输入你的邮箱' ng-model="userInfo.email">
                </div>
                <div class="form-group">
                  <label for="" class="col-md-2 control-label">
                    密码:
                  </label>
                  <div class="col-md-10">
                    <input type="text" class="form-control" placeholder="请输入你的密码" ng-model="userInfo.password">
                  </div>
                </div>
                <div class="col-md-offset-2 col-sm-10">
                  <div class="checkbox">
                    <label>
                      <input type="checkbox" ng-model = "userInfo.autoLogin">
                      自动登录
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <div class="col-md-offset-2 col-md-10">
                    <button class="btn btn-default"  ng-click="getFormData()">获取form表单的值</button>
                    <button class="btn btn-default"  ng-click="setFormData()">设置form表单的值</button>
                    <button class="btn btn-default"  ng-click="resetFormData()">重置form表单的值</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
  </div>

</body>
</html>