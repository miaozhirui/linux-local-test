(function($){
    $.userBook = {
		cfg: {
			id:0,
			utype:'',
        	panelInited:false
        },
        wallData:{
        	wallRcds:[]
        },
        urlMap: {
        	'work_likers': {'title':'喜欢该作品的街友', 'url':'/?m=work&a=likers&id='},
        	'rstrnt_wantgos': {'title':'想去该餐馆的街友', 'url':'/?m=rstrnt&a=wantgoers&id='},
        	'rstrnt_wenters': {'title':'去过该餐馆的街友', 'url':'/?m=rstrnt&a=wenters&id='}
        },
        init: function(options) {	
        	$("#user_book").bind("loadpanel", function(e) {
        		$.userBook.panelInit();
        		//page params
        		var params = $.query("#user_book").data('params'),
        			utype = params[0], rid=params[1]; //relation id
        		if(e.data.goBack && utype == $.userBook.cfg.utype && rid == $.userBook.cfg.id) {
        			$.ckj.showHideWallRcds($.userBook.wallData.wallRcds, '#J_user_wall');
        			return;
        		}
        		
        		$.userBook.cfg.utype = utype;
        		$.userBook.cfg.id    = rid;
        		
        		$.query('#J_user_wall').attr({'utype': utype, 'rid': rid});
        		$.feed.resetWall('#J_user_wall', true);
        		$.userBook.loadUsers();
    		});
        	
        	$.query("#user_book").bind('unloadpanel', function() {
        		$.ckj.hideWallRcds($.userBook.wallData.wallRcds, Math.abs($.query('#J_user_wall_wrap').scroller().scrollTop));
    		});
        },
        
        panelInit: function() {
        	if( $.userBook.cfg.panelInited === true ) return;
        	//wall scroller: scroll to load users
        	var wallWrap = $.query("#J_user_wall_wrap"), wall = $.query('#J_user_wall'), padding = parseInt($.vv.cfg.cWidth*0.05);
        	padding = padding >= 20 ? 20 : padding;
        	wall.attr({cols:3, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-90});
        	$.feed.init('#J_user_wall');
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
            
        	$.query('#user_book').attr('scrollTgt', '#J_user_wall_wrap');
        	$.userBook.cfg.panelInited = true;
        },
        
        loadUsers: function() {
        	var wall = $.query('#J_user_wall'), utype = wall.attr('utype'), rid = wall.attr('rid'),
        		uri  = $.userBook.urlMap[utype].url + rid;
        	$.ui.setTitle($.userBook.urlMap[utype].title);
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    
    $.userBook.init();
})(af);
