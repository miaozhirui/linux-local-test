(function($){
    $.spFlwBook = {
        cfg: {
        	uid:0,
        	panelInited:false
        },
        init: function(options) {
        	$("#space_follows").bind("loadpanel", function(e) {
        		if(e.data.goBack){return;}
        		$.spFlwBook.panelInit();
        		var params = $.query("#space_follows").data('params'),
    				uid  = params[0];
	    		if(!$.ckj.cfg.backResetPanel && $.spFlwBook.cfg.uid == uid) return; //avoid loading the same ...
	    		else $.spFlwBook.cfg.uid  = uid;
        		$.feed.resetWall('#J_sp_flw_wall', true);
        		$.spFlwBook.loadFollows(uid);
        		if(uid == $.ckj.user.id) $.ui.setTitle('我的关注');
        		else  $.ui.setTitle('Ta的关注');
    		});
    		
            $.query("#space_follows").bind('unloadpanel', function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_sp_flw_wall', true);
                }
            });
        },
        
        panelInit: function() {
        	if( $.spFlwBook.cfg.panelInited === true ) return;

        	var wallWrap = $.query("#J_sp_flw_wall_wrap"), wall = $.query('#J_sp_flw_wall'), padding=0;
    		padding = parseInt($.vv.cfg.cWidth*0);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-83});
        	
        	$.feed.init('#J_sp_flw_wall');
        	var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, useJsScroll:false});
            
            if($.ckj.cfg.useInfinite) {
                scroller.addInfinite();
                $.bind(scroller, "infinite-scroll", function () {
                    $.asap(function(r){
                        if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                            $.query(wall.attr('pageBar')).css('display') != 'none') return;
                        $.query(wall.attr('triggerBar')).trigger('click');
                    }, null, []);
                });
            }
        	
        	$.query('#space_follows').attr('scrollTgt', '#J_sp_flw_wall_wrap');
        	$.spFlwBook.cfg.panelInited = true;
        },  

        loadFollows: function(uid) {
        	var wall = $.query('#J_sp_flw_wall');
        	var uri = '/?m=space&a=follows&uid='+uid;
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        
        renderFollows: function(data) {
        	var html   = '';
        	if(data.rlist.length > 0) {
        		$.each(data.rlist, function(idx, u) {
        			html += '<a href="#space_index/'+u.uid+'" class="cfx">\
		        		        <img src="'+u.avatar+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/><span class="uname ofh">'+u.uname+'</span>\
		        		    </a>';
            	});
        	} 
        	return html;
        },
    };
    $.spFlwBook.init();
})(af);