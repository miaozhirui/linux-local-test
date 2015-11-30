(function($) {
    $.spUinfo = {
    	cfg: {
    		id:0,
    		loadingUser:'y',
    		panelInited:false
    	},
        init: function(options) {
        	$("#space_uinfo").bind("loadpanel",function(e) {
        		if(e.data.goBack)return;
        		//page params
        		var params = $.query("#space_uinfo").data('params'),
					uid = params[0];
        		uid = uid ? uid : $.ckj.user.id;
        		if(!uid) {$.ui.loadContent('#user_login',false,0,$.ckj.cfg.formTrans); return;}
        		$.spUinfo.panelInit();
	    		if($.spUinfo.cfg.id == uid) return; //avoid loading the same ...
	    		else $.spUinfo.cfg.id = uid;
        		//load user
        		$.spUinfo.loadUser(uid);
        		if(uid == $.ckj.user.id) $.ui.setTitle('我的信息');
        		else  $.ui.setTitle('Ta的详细');
    		});
        },
        panelInit: function() {
        	if( $.spUinfo.cfg.panelInited === true ) return;
        	$.query("#space_uinfo").scroller({verticalScroll: true, scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
        	$.query('#space_uinfo').attr('scrollTgt', '#space_uinfo');
        	$.spUinfo.cfg.panelInited = true;
        },  
        loadUser:function(uid) {
        	$.vv.tip({ icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=space&a=uinfo&uid='+uid,
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		$.vv.tip({close:true});
                		var user = rst.data.user, html ='', who = uid == $.ckj.user.id ? '我' : 'Ta';
                		
                		//user info
                		html = '<img src="'+user.avatar+'" class="avatar pabs" />\
			                	<div>\
			                        <div class="uname">\
                						<span>'+user.username+'</span>\
			                        	<a href="#comment_book/space/'+user.id+'" class="leaveword fr">\
			                        		<i class="fa fa-chat prt2"></i>留言簿\
			                        	</a>\
			                        </div>\
			                        <div class="intro">'+user.intro+'</div>\
			                    </div>';
                		$.query('#J_spUinfo_top').html(html);
                		
                		html ='<li class="f-f"><p class="h">性别：</p><p class="v f-al">'+(user.gender == 1 ? '男' : '女')+'</p></li>\
                				<li class="f-f"><p class="h">地区：</p><p class="v f-al">'+user.province+user.city+'</p></li>\
                				<li class="f-f"><p class="h">星座：</p><p class="v f-al">'+user.constel+'</p></li>\
                				<li class="f-f"><p class="h">血型：</p><p class="v f-al">'+user.blood+'</p></li>\
                				<li class="f-f"><p class="h">职业：</p><p class="v f-al">'+user.career+'</p></li>\
                				<li class="f-f"><p class="h">博客：</p><p class="v f-al">'+user.blog+'</p></li>\
                				<li class="f-f"><p class="h">学校：</p><p class="v f-al">'+user.college+'</p></li>\
                				<li class="f-f"><p class="h">院系：</p><p class="v f-al">'+user.colldepart+'</p></li>\
                				<li class="f-f"><p class="h">喜欢吃：</p><p class="v f-al pink">'+user.loves+'</p></li>\
                				<li class="f-f"><p class="h">个人标签：</p><p class="v f-al pink">'+user.tags+'</p></li>';
                		$.query('#J_spUinfo_info').html(html);
                	}
                	
                	$.spUinfo.cfg.loadingUser = 'n';
                },
                dataType: "json"
            });
        }
    };
    $.spUinfo.init();
})(af);
