(function($){
    $.userReg = {
        cfg: {
        	form:'#J_reg_form',
        	ruleCache:null,
        	panelInited:false
        },
        ruleObj: {
        	'J_reg_email':{'reg':/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/, 'msg':'邮箱格式错误', 'minLength':3, 'maxLength':512, 'eventName':'blur'},
        	'J_reg_username':{'reg':/^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/, 'msg':'用户名由1-24个字母,数字,汉字,-_组成', 'minLength':1, 'maxLength':24, 'eventName':'blur'},
        	'J_reg_password':{'reg':/.+/, 'msg':'密码长度6-20位之间', 'minLength':6, 'maxLength':20, 'eventName':'blur'},
        	'J_reg_captcha':{'reg':/.+/, 'msg':'请正确填写验证码', 'minLength':1, 'maxLength':4, 'eventName':'blur'},
        },
        init: function(options) {
            $("#user_register").bind("loadpanel", function(e) {
            	if(e.data.goBack)return;
        		$.userReg.panelInit();
        		setTimeout(function(){$.query('#J_reg_captcha_img').trigger('click');}, 500);
    		});
    		
    		$("#user_register").bind("unloadpanel", function(e) {
                $('#J_reg_email, #J_reg_username, #J_reg_password, #J_reg_captcha').val('');
            });
        },
        panelInit: function(){
        	if( $.userReg.cfg.panelInited === true ) return;
        	
        	var s = $.userReg.cfg;
            $.userReg.loginValidate();
            var form = $(s.form);
            
            form.submit(function(e){
            	e.preventDefault();
            	
                if(!$('#J_reg_agreement').is(':checked')) {
                    $.vv.tip({content:'请同意馋口街网络服务协议'});
                    return false;
                }
                
            	if (!RuleCache.checkForm(s.ruleCache)) {
            		//$.vv.log('check failed');
    				return false;
    			};
    			
    			$.vv.tip({icon:'loading'});
    			$.ajax({
                    url: $.ckj.cfg.mapi+form.attr('action'),
                    type:'post',
                    data:form.serialize(),
                    success: function(rst){
                        $.vv.tip({close:'true'});
                        
                    	if(rst.status != 0){ //error happened
                    		$.vv.tip({ content:rst.msg, icon:'error', time:3000}); 
                    		if(rst.data.errors) RuleCache.setErrors(rst.data.errors);
                    	} else {
                    		//$.vv.log('register_user_info::', JSON.stringify(rst.data.user_info));
                    		$.vv.tip({ content:'恭喜，成功注册城口街啦！', time:2000});
                    		
                    		$.ckj.user.id		= rst.data.user_info.id;
                    		$.ckj.user.name		= rst.data.user_info.username;
                    		$.ckj.user.isLogin  = true;
                    		
                    		$.query('#J_side_user_login').hide();
                    		$.query('#J_side_user_logout').html('<a><i class="fa fa-logout"></i>退出('+$.vv.util.equalSubStr($.ckj.user.name, 5)+')</a>').show();
                    		setTimeout(function(){
                    			//todo register success welcome/guide page...
                    			$.ui.loadContent('#space_index', false, false, $.ckj.cfg.formTrans);
                    		}, 1500);
                    	}
                    },
                    dataType: "json",
                    timeout:10000,
                    error: function(xhr, why) {
                        if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                    }
               });
            });
        	
        	$.userReg.cfg.panelInited = true;
        },
        //login page
        loginValidate: function(){
        	var s = $.userReg.cfg;
        	s.ruleCache =  new RuleCache( $.userReg.ruleObj);
        	s.ruleCache.registerEvent(s.ruleCache);
        }
    };
    $.userReg.init();
})(af);
