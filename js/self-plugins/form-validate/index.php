<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>form表单的验证插件</title>
  <script type="text/javascript" src="../../jquery-1.8.3.js"></script>
  <style type="text/css">
    b{
      position: relative;
      display: inline-block;
      font-weight: 400;
    }
    .form-validate-error-info{
      color:red;
      position: absolute;
      left:0px;
      bottom:-20px;
      background: none;
    }
    .first{
      height:100px;
    }
  </style>
</head>
<body>
  <!-- <input type="text" valType="required"> -->
<div class="wrapper">
  <b><input type="text" valType="required" msg="姓名不能为空" class="first"></b>
  <b><input type="text" valType="required" msg="手机号不能为空"></b>
</div>

  <script type="text/javascript">
   function FormVal(context){
      var $ele = $('[valType]', context);
      self = this;
      this.$ele = $ele;
      this.attrWrap = {};

      $ele.each(function(index, e){
        self.attrWrap[index] = {
          'msg': $(e).attr('msg'),
          'valType': $(e).attr('valType')
        };
      })
    }

    FormVal.prototype.execute = function(){
        var $ele = this.$ele, attrWrap = this.attrWrap, len = $ele.length, i=0;
        this.valStatus = true;//验证状态默认是正确的，只要有一项不通过就变为false;

        for(; i<len; i++){
              var msg = attrWrap[i].msg,
              valType = attrWrap[i].valType,
              el = $ele[i];

              if(!this[valType]){
                throw new Error('Function '+valType + ' is not defined')
              } else {
                this[valType]($(el),msg);
              }
        }

        return this.valStatus;
    }

    FormVal.prototype.required = function($el,msg){
      var value = getValue($el);
        if(value==''){
          createErrorInfo($el,msg);
          this.valStatus = false;
        } else {
          $el.parent().remove('mark');
        }
    }

    function createErrorInfo($el,msg){
      var $span = $('<mark></mark>').
      html(msg).
      addClass('form-validate-error-info');

      $el.after($span);
    }

    function getValue($el){
      return $el.val().replace(/\s\S/g,'');
    }




  console.log(new FormVal($('.wrapper')).execute())

  </script>
  <script type="text/javascript">
  // var formVal = {
  //   execute: function(context){
  //     var $ele = $('[valType]',context), self = this;
  //     this.wrapper = {}

  //     $ele.each(function(index,e){//把之后验证不通过的存起来，下次再用
  //       self.wrapper[index] = $(e).attr('msg');
  //     })
      

  //   }
  // }

  // formVal.execute($('.wrapper'));
  </script>
</body>
</html>