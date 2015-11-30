(function($) {
    $.spaceIndex = {
    	cfg:{
    		uid:0,
    		panelInited: false,
    		loadingUser:'y',
    		userLoaded:false
    	},
    	
        init: function(options) {
        	$("#space_index").bind("loadpanel",function(e){
        		var uid = $.query("#space_index").data('params');
        		uid = uid > 0 ? uid : $.ckj.user.id;
        		if(!uid) {
        		    if(e.data.goBack){
                        //$.vv.log('e.data.goBack::'+e.data.goBack);
                        window.setTimeout(function(){$.ui.goBack()}, 50); //>>> avoid loadpanel event runing before the first loadpanel 
                        return;
                    }
        			$.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
        			return;
        		}
        		
        		if(!$.ckj.refresh.avatar && !$.ckj.refresh.cover && uid == $.spaceIndex.cfg.uid && $.spaceIndex.cfg.userLoaded) {
        		    $.ckj.msgTip(true);
        		    $('#space_index').css('opacity', '1');
        			return;
        		}
        			
        	    $.query('#J_spaceidx_top').css({'background-image':''});
        			
        		$.spaceIndex.cfg.uid = uid;
        		$.spaceIndex.cfg.userLoaded = false;
        		$.spaceIndex.panelInit();
        		$.spaceIndex.loadUser(uid);
    		});
    		
    		$.ckj.hooks.logout.push(function(){
    		    $.vv.log('------------space_index hooks.logout---------');
                if($.spaceIndex)$.spaceIndex.cfg.uid = 0;
            });
        },
        
        panelInit:function() {
            if( $.spaceIndex.cfg.panelInited === true ) return;
            var wallWrap = $.query('#space_index');
            wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
            wallWrap.addClass('scroll_nobar');
            
        	//sign in
        	$('#space_index').on('click', '#J_spaceidx_signin', function(){
        		$.ajax({
                    url: $.ckj.cfg.mapi+'/?m=user&a=signin',
                    success: function(result){
                    	if(result.status == 0 || result.status == 8){
                    		$.query('#J_spaceidx_signin').html('<i class="fa fa-check"></i>已签到');
                    		$.vv.tip({content:result.msg, icon:'success', time: 3000});
                    		var n = new Date();
                    			expire = new Date(n.getFullYear(), n.getMonth(), n.getDay()+1, 0, 0, 0).getTime()/1000 - n.getTime()/1000;
                    		$.vv.ls.set('user_'+$.ckj.user.id+'_signin', 'y', expire);
                    	} else {
                    		$.vv.tip({content:result.msg, icon:'error', time: 3000});
                    	}
                    },
                    dataType: "json",
                    timeout:5000
               });
        	   return false;
        	});
            
        	$.user.follow('#space_index');
        	$.user.unFollow('#space_index');
        	
            $.query('#space_index').attr('scrollTgt', '#space_index');
            $.spaceIndex.cfg.panelInited = true;
        },
        
        loadUser:function(uid) {
            var ckey = 'my_space_profile';
        	if(!$.ckj.refresh.avatar && !$.ckj.refresh.cover) $.vv.tip({ icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=space&a=user&uid='+uid,
                dataType: "json",
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ icon:'error', content:rst.msg, time:3000}); 
                		var cUser = $.vv.ls.get(ckey);
                        if(cUser) renderUser(cUser);
                	} else {
                		$.vv.tip({close:true});
                		renderUser(rst.data);
                		if(uid == $.ckj.user.id) {
                		    $.vv.ls.set(ckey, rst.data);
                		    $.ckj.msgTip(true);
                		}
                		$.spaceIndex.cfg.userLoaded = true;
                	}
                	
                	$.spaceIndex.cfg.loadingUser = 'n';
                },
                error: function(xhr, why) {
                    if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                    var cUser = $.vv.ls.get(ckey);
                    if(cUser) renderUser(cUser);
                }
            });
            
            function renderUser(uData) {
                
                var u = uData.user,
                    darenInfo = uData.darenInfo; 
                    atHome = ($.spaceIndex.cfg.uid == $.ckj.user.id), who = atHome ? '我' : 'Ta', html ='';  
                $.ui.setTitle(atHome ? '我的家园' : $.vv.util.equalSubStr(u.username, 6) + "的美食家园");
                if($.ckj.refresh.avatar) {
                    u.avatar = u.avatar + '?rand='+(new Date()).getTime();
                    $.ckj.refresh.avatar = false;
                }
                $.query('#J_spaceidx_avatar').attr('src', u.avatar);
                
                if(atHome) { 
                    //$.query('#header .fa-gear').css('visibility', 'visible');
                    $.query('#space_index .J_athome_show').show(); $.query('#space_index .J_athome_hide').hide();
                    //$.ckj.renderFollowShipBtn(u.id, $.ckj.user.id, u.ship)
                    $.query('#J_spaceidx_top .follow_u').remove();
                    if(u.cover) {
                        if($.ckj.refresh.cover){
                            u.cover = u.cover+'?rnd='+(new Date()).getTime();
                            $.ckj.refresh.cover = false;
                        }
                        $.query('#J_spaceidx_top').css({'background-image':'url('+u.cover+')', 'background-size':'100% 100%'});
                    }
                    $('#space_index .JgoSetting').attr('href', '#setting_basic');
                }
                else{ 
                    //$.query('#header .fa-gear').css('visibility', 'hidden');
                    $.query('#space_index .J_athome_show').hide(); $.query('#space_index .J_athome_hide').show();
                    $.query('#J_spaceidx_top').append($.ckj.renderFollowShipBtn(u.id, $.ckj.user.id, u.ship))
                    $('#space_index .JgoSetting').removeAttr('href');
                }
                
                $.query('#space_index .J_href_uid').each(function(){
                    $.vv.log('mod_attr::'+$(this).attr('href').replace(/(#[^\/]+?)\/.*/, '$1'));
                    $(this).attr('href', $(this).attr('href').replace(/(#[^\/]+?)\/.*/, '$1')+'/'+u.id);
                });
                
                $.query('#space_index .JsendPrivMsg').attr('href', '#privmsg_talk/'+(parseInt(u.id)+parseInt($.ckj.user.id)));
                
                $.query('#space_index .J_setval').each(function(){
                    $(this).text(u[$(this).attr('f')]);}
                );
                
                $.query('#space_index .J_wt').text(who);
                
                $.query('#J_spaceidx_daren .daren').each(function(){
                    var tp = $(this).attr('tp');
                    if(tp && darenInfo[tp+'_dr'] && darenInfo[tp+'_dr'] > 0) $(this).addClass(tp);
                    else $(this).removeClass(tp);
                });
                
                //user intro
                $.query('#J_spaceidx_intro').html(u.intro ? u.intro : '这家伙真懒， 什么也没有留下~').closest('a').attr('href', '#space_uinfo/'+u.id);
                
                var hasSigned = $.vv.ls.get('user_'+$.ckj.user.id+'_signin');
                $.vv.log('hasSigned::'+hasSigned);
                if(atHome && !hasSigned) $.query('#J_spaceidx_signin').html('<i class="fa fa-edit"></i>签到');
                else $.query('#J_spaceidx_signin').html('<i class="fa fa-check"></i>已签到');
                if(!$.ckj.user.id || u.id != $.ckj.user.id)
                    $.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':15, 'title':r.username, 'img':u.avatar});}, null, [u]);
                
                $('#space_index').css('opacity', '1');
                
                if(uid == $.ckj.user.id) $.ckj.msgTip(true);
                $.query('#space_index').scroller().scrollToTop();
            }
        }
    };
    $.spaceIndex.init();
})(af);
