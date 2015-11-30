(function($){
    $.rmenuBook = {
        cfg: {
        	panelInited:false,
        	catesLoaded:false
        },
        wallData:{
        	wallRcds:[]
        },
        init: function(options) {
        	$("#rmenu_book").bind("loadpanel", function(e) {
        		$.rmenuBook.panelInit();
        		
        		if(e.data.goBack){
                    $.ckj.showHideWallRcds($.rmenuBook.wallData.wallRcds, '#J_rmenu_wall');
                    return;
                }
        		//page params
        		var params = $.query("#rmenu_book").data('params'),
                    cid = params[0],
                    wall = $.query('#J_rmenu_wall');
        		
        	    if(!$.ckj.cfg.backResetPanel && cid ==  wall.attr('curCid')) {
                    if(wall.find('.wall_rmenu').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') {
                        $.ckj.showHideWallRcds($.rmenuBook.wallData.wallRcds, '#J_rmenu_wall');
                        return;
                    } 
                }

        		wall.attr({'curCid': cid});
        		$.feed.resetWall('#J_rmenu_wall', true);
        		$.rmenuBook.loadCates();
        		$.rmenuBook.loadRmenus();
    		});
    		
        	$.query("#rmenu_book").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_rmenu_wall', true);
                } else {
                    $.ckj.hideWallRcds($.rmenuBook.wallData.wallRcds, Math.abs($.query('#J_rmenu_wall_wrap').scroller().scrollTop));
        		}
    		});
        },
        
        panelInit: function(){
        	if( $.rmenuBook.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_rmenu_wall_wrap"), wall = $.query('#J_rmenu_wall'), padding=15;
    		padding = parseInt($.vv.cfg.cWidth*0.05);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-125});
        	
        	$.feed.init('#J_rmenu_wall');
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
        	
        	$.vv.ui.moreBlock('#rmenu_book');
        	$.rmenuBook.selectCate();
        	$.rmenuBook.selectOrder();

            if($.os.ios8)$('#rmenu_book .J_block_wrap').attr('init_height', '35.5px');
        	$.query('#rmenu_book').attr('scrollTgt', '#J_rmenu_wall_wrap');
        	$.rmenuBook.cfg.panelInited = true;
        },
        
        selectCate: function(){
        	$.query('#J_rmenu_b_c').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		var showTri = $this.closest('.J_block_wrap').find('.J_block_show');
        		if(showTri.attr('unfolded') == 'y') {
        			$.query('#J_rmenu_b_c a').removeClass('active');
        			$this.addClass('active');
	        		$this.insertAfter($.query('#J_rmenu_b_c a:first-child'));
	        		//load rmenus
	        		var wall 	= $.query('#J_rmenu_wall');
	        		var cid 	= $this.attr('cid');
	        		wall.attr('curCid', cid);
	        		$.feed.resetWall('#J_rmenu_wall', true);
	        		$.rmenuBook.loadRmenus();
        		}
        		showTri.trigger('click'); 
        	});
        },
        selectOrder: function(){
        	$.query('#J_rmenu_orderrank').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		var showTri = $this.closest('.J_block_wrap').find('.J_block_show');
        		if(showTri.attr('unfolded') == 'y') {
	        		$this.insertBefore($.query('#J_rmenu_orderrank a:first-child'));
	        		//load rmenus
	        		var wall 	= $.query('#J_rmenu_wall');
	        		var sort 	= $this.attr('sort');
	        		wall.attr('sort', sort);
	        		$.feed.resetWall('#J_rmenu_wall', true);
	        		$.rmenuBook.loadRmenus();
        		}
        		showTri.trigger('click'); 
        	});
        },
        loadCates: function(){
            if($.rmenuBook.cfg.catesLoaded) return;
        	var ckey = 'rmenu_cates', cates = $.vv.ls.get(ckey);
        	if(cates) {showCates(cates); return true;}
        	
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=rmenu&a=get_cates',
                success: function(rst) {
                	if(rst.status != 0) $.vv.tip({content:rst.msg, time: 3000}); 
                	else {
                		showCates(rst.data.cates);
                		$.vv.ls.set(ckey, rst.data.cates, $.ckj.cacheTime.rmenuCate);
                		$.rmenuBook.cfg.catesLoaded = true;
                	}
                },
                dataType: "json"
            });
        	
        	function showCates(cates){
        		var chtml = $.ckj.renderPopupCates(cates);
        		$.query('#J_rmenu_b_c').html(chtml);
        	}
        },
        loadRmenus: function() {
        	var wall = $.query('#J_rmenu_wall');
        	var uri = '/?m=rmenu&a=book&cid='+wall.attr('curCid')+'&sort='+wall.attr('sort');
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.rmenuBook.init();
})(af);
