(function($){
    $.userLogin = {
        cfg: {
        	form:'#J_login_form',
        	ruleCache:null,
        	panelInited:false,
        	backStep:1
        },
        ruleObj: {
        	'J_login_username':{'reg':/^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/, 'msg':'用户名由1-24个字母,数字,汉字,-_组成', 'minLength':1, 'maxLength':24, 'eventName':'blur'},
        	'J_login_password':{'reg':/./, 'msg':'密码长度6-20位之间', 'minLength':6, 'maxLength':20, 'eventName':'blur'},
        	'J_login_captcha':{'reg':/./, 'msg':'请正确填写验证码', 'minLength':1, 'maxLength':4, 'eventName':'blur'},
        },
        init: function(options){
            var s = $.userLogin.cfg;
            $("#user_login").bind("loadpanel", function(e) {
            	if(e.data.goBack)return;
        		$.userLogin.panelInit();
        		
        		var params   = $.query("#user_login").data('params');
                    $.userLogin.cfg.backStep = numOnly(params[0]);
                    $.userLogin.cfg.backStep = ~~$.userLogin.cfg.backStep || 1;
    		});
    		
    		$("#user_login").bind("unloadpanel", function(e) {
                $('#J_login_username, #J_login_password, #J_login_captcha').val('');
            });
        },
        panelInit: function(){
        	if( $.userLogin.cfg.panelInited === true ) return;
        	
        	$.userLogin.loginValidate();
        	$.query('#J_login_captcha_img').trigger('click');
        	
        	var s = $.userLogin.cfg;
        	var form = $(s.form);
        	
            form.submit(function(e){
            	e.preventDefault();
            	if (!RuleCache.checkForm(s.ruleCache)) {
            		//$.vv.log('check failed');
    				return false;
    			};
    			//$.vv.log($.ckj.mapi+form.attr('action'));
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
                    		if(rst.data.req_verify){
                    			//$.vv.log('need verify');
                    			$.query('#J_login_captcha_wrap').show();
                    			$.query('#J_login_captcha').attr('rule_check', 'y'); //tell ruleCache to check the captcha
                    			$.query('#J_login_captcha_img').trigger('click');
                    		}
                    	} else {
                    		//$.vv.log('login_user_info::', JSON.stringify(rst.data.user_info));
                    		$.vv.tip({ content:'登陆成功', time:2000});
                    		
                    		$.ckj.user.id		= rst.data.user_info.id;
                    		$.ckj.user.name		= rst.data.user_info.username;
                    		$.ckj.user.isLogin  = true;
                    		
                    		$.query('#J_side_user_login').hide();
                    		$.query('#J_side_user_logout').html('<a><i class="fa fa-logout"></i>退出('+$.vv.util.equalSubStr($.ckj.user.name, 5)+')</a>').show();
                    		
                    		setTimeout(function(){
                    			$.ui.goBack($.userLogin.cfg.backStep);
                    			$.userLogin.cfg.backStep = 1;
                    			$.query('#J_login_captcha_wrap').hide();
                    			$.query('#J_login_captcha').attr('rule_check', 'n'); //tell ruleCache to check the captcha
                    		}, 1500);
                    		
                    		if($.ckj.hooks.login.length > 0) {    
                                $.ckj.hooks.login.forEach(function(fn) {
                                    if($.isFunction(fn))fn();
                                });
                            }
                    	}
                    },
                    dataType: "json",
                    timeout:10000,
                    error:function(xhr, err) {
                    	if(err == 'timeout')$.vv.tip({ content:'请求超时，请稍后再试!', icon:'error'});
                    	else $.vv.tip({ content:'请求出错，请稍后再试!', icon:'error'});
                    }
               });
            });
        	
        	$.userLogin.cfg.panelInited = true;
        },
        //login page
        loginValidate: function(){
        	var s = $.userLogin.cfg;
        	s.ruleCache =  new RuleCache( $.userLogin.ruleObj);
        	s.ruleCache.registerEvent(s.ruleCache);
        }
    };
    $.userLogin.init();
})(af);
