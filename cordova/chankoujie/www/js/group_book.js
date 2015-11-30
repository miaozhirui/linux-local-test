(function($){
    $.groupBook = {
        cfg: {
        	panelInited:false
        },
        wallData:{
        	wallRcds:[]
        },
        init: function(options) {
        	$("#group_book").bind("loadpanel", function(e) {
        	    var wall = $('#J_group_wall');
        		if(e.data.goBack || (wall.find('.wall_group').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y')){
        			$.ckj.showHideWallRcds($.groupBook.wallData.wallRcds, '#J_group_wall');
        			return;
        		}
        		
        		$.groupBook.panelInit();
        		
        		$.feed.resetWall('#J_group_wall', true);
        		$.groupBook.loadGroups();
    		});
        	
        	$.query("#group_book").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_group_wall', true);
                } else {
                    $.ckj.hideWallRcds($.groupBook.wallData.wallRcds, Math.abs($.query('#J_group_wall_wrap').scroller().scrollTop));
        		}
    		});
        },
        
        panelInit: function() {
        	if( $.groupBook.cfg.panelInited === true ) {
        		return;
        	}
        	
        	var wallWrap = $.query("#J_group_wall_wrap"), wall = $.query('#J_group_wall'), padding=0;
    		padding = parseInt($.vv.cfg.cWidth*0);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
        	
        	$.feed.init('#J_group_wall');
        	var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
            
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
        	
        	$.groupBook.selectOrder();
        	
        	$.query('#group_book').attr('scrollTgt', '#J_group_wall_wrap');
        	$.groupBook.cfg.panelInited = true;
        },  
        
        selectOrder: function() {
        	$("#group_book .angle_tabs").on('click',".order",function() {
        		$("#group_book .angle_tabs a").removeClass('cur');
                var $this = $(this), sort = $this.attr('sort'), wall = $.query('#J_group_wall');
                $this.addClass('cur');
        		wall.attr('sort', sort);
        		$.feed.resetWall('#J_group_wall', true);
        		$.groupBook.loadGroups();
        	});
        },
        
        loadGroups: function() {
        	var wall = $.query('#J_group_wall');
        	var uri = '/?m=group&a=book&sort='+wall.attr('sort');
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.groupBook.init();
})(af);
