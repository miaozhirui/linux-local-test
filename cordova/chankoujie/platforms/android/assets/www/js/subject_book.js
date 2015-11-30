(function($){
    $.subjectBook = {
        cfg: {
        	panelInited:false
        },
        wallData:{
        	wallRcds:[]
        },
        init: function(options) {
        	$("#subject_book").bind("loadpanel", function(e) {
        		if(e.data.goBack){
        			$.ckj.showHideWallRcds($.subjectBook.wallData.wallRcds, '#J_subject_wall');
        			return;
        		}
        		$.subjectBook.panelInit();
        		$.feed.resetWall('#J_subject_wall', true);
        		$.subjectBook.loadSubjects();
    		});
        	
        	$.query("#subject_book").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_subject_wall', true);
                } else {
                    $.ckj.hideWallRcds($.subjectBook.wallData.wallRcds, Math.abs($.query('#J_subject_wall_wrap').scroller().scrollTop));
                }
    		});
        },
        
        panelInit: function() {
        	if( $.subjectBook.cfg.panelInited === true ) return;

        	var wallWrap = $.query("#J_subject_wall_wrap"), wall = $.query('#J_subject_wall'), padding=0;
    		padding = parseInt($.vv.cfg.cWidth*0);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
        	
        	$.feed.init('#J_subject_wall');
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
            
        	$.subjectBook.selectOrder();
        	
        	$.query('#subject_book').attr('scrollTgt', '#J_subject_wall_wrap');
        	$.subjectBook.cfg.panelInited = true;
        },  
        
        selectOrder: function() {
        	$("#subject_book .angle_tabs").on('click',".order",function() {
        		$("#subject_book .angle_tabs a").removeClass('cur');
                var $this = $(this), sort = $this.attr('sort'), wall = $.query('#J_subject_wall');
                $this.addClass('cur');
        		wall.attr('sort', sort);
        		$.feed.resetWall('#J_subject_wall', true);
        		$.subjectBook.loadSubjects();
        	});
        },
        
        loadSubjects: function() {
        	var wall = $.query('#J_subject_wall');
        	var uri = '/?m=subject&a=book&sort='+wall.attr('sort');
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.subjectBook.init();
})(af);
