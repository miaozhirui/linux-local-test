//psersonal space
(function($) {
    $.user = {
        cfg: {
        	foUserBtn: '.J_fo_u', //follow people element
            unFoUserBtn: '.J_unfo_u', //follow people element
            userUnit:'.J_user',
            
            toUrl:'',
            okFunc:null,
            okData:null,
            noFunc:null,
            noData:null,
            popUp:null
        },
        follow: function(ctx) {
        	var s = $.user.cfg;
            $(ctx).on('click', s.foUserBtn, function(e) {
            	e.stopPropagation();e.preventDefault();
            	if(!$.user.isLogin({
            		okFunc:function($this){
                        var uid = $this.attr('data-uid');
                        $.vv.tip({icon:'loading'});
                        $.getJSON($.ckj.cfg.mapi + '/?m=user&a=follow', {uid:uid}, function(result) {
                            $.vv.tip({close:true});
                            if(result.status == 0 ) {
                            	$this.replaceClass('J_fo_u', 'J_unfo_u');
                            	$this.find('.tip').html('已关注');
                            	if(result.data == 1) $this.find('.fa').removeClass('fa-user-add-o').addClass('fa-check'); //I followed her
                            	else $this.find('.fa').removeClass('fa-user-add-o').addClass('fa-transfer'); //we followed each other
                            } else {
                                $.vv.tip({content:result.msg,  icon:'error'});
                            }
                        });
            		},
            		okData:$(this)
            	})) return false;
            });
        },
        unFollow: function(ctx){
        	var s = $.user.cfg;
            $(ctx).on('click', s.unFoUserBtn, function(e){
            	e.stopPropagation();e.preventDefault();
            	if(!$.user.isLogin({
            		okFunc:function($this){
            		    $.vv.tip({icon:'loading'});
                        var uid = $this.attr('data-uid');
                        $.getJSON($.ckj.cfg.mapi + '/?m=user&a=unfollow', {uid:uid}, function(result){
                            $.vv.tip({close:true});
                            if(result.status == 0 ) {
                                if($this.attr('outdel') == 'y')$this.closest(s.userUnit).remove();
                                else {
                                	$this.replaceClass('J_unfo_u', 'J_fo_u');
                                	$this.find('.fa').removeClass('fa-check, fa-transfer').addClass('fa-user-add-o');
                                	$this.find('.tip').html('关注');
                                }
                            } else {
                                $.vv.tip({content:result.msg,  icon:'error'});
                            }
                        });
            		},
            		okData:$(this)
            	})) return false;
            });
        },
        isLogin: function(options) {
        	$.user.rstLgCfg(); //reset ...
        	options && $.extend($.user.cfg, options);
        	var s=$.user.cfg;
            if($.ckj.user.isLogin) {
                if(s.toUrl) $.ui.loadContent(s.toUrl,false,false,$.ckj.cfg.formTrans);
                else if(s.okFunc)s.okFunc(s.okData);
                s.okFunc = s.noFunc = s.toUrl = null; //avoid next call use this callback
                return true;
            } else { 
            	$.user.popLogin();
            }
        },
        popLogin: function() {
        	//todo dialog login
        	$.ui.loadContent('#user_login',false,false, $.ckj.cfg.formTrans);
        	return;
        },
        rstLgCfg: function() {
        	$.extend($.user.cfg, {
                toUrl:'',
                okFunc:null,
                okData:null,
                noFunc:null,
                noData:null,
                popUp:null
        	});
        }
    };
})(af);
