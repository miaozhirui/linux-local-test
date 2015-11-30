(function($) {
    $.privmsgsumBook = {
        cfg: {
        	panelInited:false
        },
        init: function(options) {
        	$("#privmsgsum_book").bind("loadpanel",function(e){
        		if(!$.ckj.user.id) { $.ui.loadContent('#user_login',false,0,$.ckj.cfg.formTrans); return;}//must login
        		if(e.data.goBack)return;
        		$.privmsgsumBook.panelInit();
        		$.feed.resetWall('#J_privmsgsum_wall', true);
        		$.privmsgsumBook.loadPrivmsgsums();
    		});
        },
        
        panelInit:function() {
        	if( $.privmsgsumBook.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_privmsgsum_wall_wrap"), wall = $.query('#J_privmsgsum_wall'), padding=0;
            wall.attr({'masonry':'n','cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-90});

            $.feed.init('#J_privmsgsum_wall');
            wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});//TODO: add pull to refresh
        	
            $.query('#privmsgsum_book').attr('scrollTgt', '#J_privmsgsum_wall_wrap');

        	$.privmsgsumBook.cfg.panelInited = true;
        },
        
        loadPrivmsgsums: function() {
        	var wall = $.query('#J_privmsgsum_wall');
        	var uri  =  '/?m=message&a=index';
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        renderPrivmsgsums:function(data){
        	var html = '';
        	if(data.rlist.length > 0) {
				$.each(data.rlist, function(idx, t){
					html += '<li class="privmsgsum ' + ((t.to_id == $.ckj.user.id && t.status == 0) ? 'new' : '')+'" ftid="'+t.ftid+'">\
								<img class="pic" src="'+t.avatar+'">\
					            <div class="atime">'+t.add_time+'</div>\
					            <div class="cnt">\
					                <div class="tname">'+t.ta_name+'</div>\
					                <div class="c_box">\
					                    <p class="ofh">'+(t.from_id == $.ckj.user.id ? '我' : t.from_name)+'说:<a>'+t.info+'</a></p>\
					                    <div class="all cfx">共'+t.num+'条私信 <i class="fa fa-chevron-right"></i></div>\
					                </div>\
					            </div>\
					            <a href="#privmsg_talk/'+t.ftid+'" class="go"></a>\
					        </li>';
    			});
        	} 
        	return html;
        },
    };
    
    $.privmsgsumBook.init();
})(af);
