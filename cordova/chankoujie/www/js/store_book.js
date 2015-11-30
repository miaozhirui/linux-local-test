(function($){
    $.storeBook = {
        cfg: {
        	panelInited:false,
        	catesLoaded:false
        },
        wallData:{
        	wallRcds:[]
        },
        init: function(options) {
        	$("#store_book").bind("loadpanel", function(e) {
        		if(e.data.goBack){
        			$.ckj.showHideWallRcds($.storeBook.wallData.wallRcds, '#J_store_wall');
        			return;
        		}
        		$.storeBook.panelInit();
        		//page params
        		var params = $.query("#store_book").data('params'),
        		    cid = params[0],
        		    wall = $.query('#J_store_wall');
                
                if(!$.ckj.cfg.backResetPanel && cid ==  wall.attr('curCid')) {
                    if(wall.find('.wall_store').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') {
                        $.ckj.showHideWallRcds($.storeBook.wallData.wallRcds, '#J_store_wall');
                        return;
                    } 
                }  
                
        		wall.attr({'curCid': cid});
        		$.feed.resetWall('#J_store_wall', true);
        		$.storeBook.loadStores();
        		$.storeBook.loadCates();
    		});
        	
        	$.query("#store_book").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
        	        $.feed.resetWall('#J_store_wall', true);
        	    } else {
        	        $.ckj.hideWallRcds($.storeBook.wallData.wallRcds, Math.abs($.query('#J_store_wall_wrap').scroller().scrollTop));
        	    } 
    		});
        },
        
        panelInit: function() {
        	if( $.storeBook.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_store_wall_wrap"), wall = $.query('#J_store_wall'), padding=15;
    		padding = parseInt($.vv.cfg.cWidth*0.05);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-125});
        	
        	$.feed.init('#J_store_wall');
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
            
        	$.vv.ui.moreBlock('#store_book');
        	
        	$.storeBook.selectCate();
        	$.storeBook.selectOrder();
        	
        	if($.os.ios8)$('#store_book .J_block_wrap').attr('init_height', '35.5px');
        	$.query('#store_book').attr('scrollTgt', '#J_store_wall_wrap');
        	$.storeBook.cfg.panelInited = true;
        },
        
        selectCate: function() {
        	$.query('#J_store_b_c').on('click', 'a', function(e) {
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		var showTri = $this.closest('.J_block_wrap').find('.J_block_show');
        		if(showTri.attr('unfolded') == 'y') {
        			$.query('#J_store_b_c a').removeClass('active');
        			$this.addClass('active');
	        		$this.insertAfter($.query('#J_store_b_c a:first-child'));
	        		//load stores
	        		var wall 	= $.query('#J_store_wall');
	        		var cid 	= $this.attr('cid');
	        		wall.attr('curCid', cid);
	        		$.feed.resetWall('#J_store_wall', true);
	        		$.storeBook.loadStores();
        		}
        		showTri.trigger('click'); 
        	});
        },
        
        selectOrder: function(){
        	$.query('#J_store_orderrank').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		var showTri = $this.closest('.J_block_wrap').find('.J_block_show');
        		if(showTri.attr('unfolded') == 'y') {
	        		$this.insertBefore($.query('#J_store_orderrank a:first-child'));
	        		//load stores
	        		var wall 	= $.query('#J_store_wall');
	        		var sort 	= $this.attr('sort');
	        		wall.attr('sort', sort);
	        		$.feed.resetWall('#J_store_wall', true);
	        		$.storeBook.loadStores();
        		}
        		showTri.trigger('click'); 
        	});
        },
        
        loadCates: function(){
            if($.storeBook.cfg.catesLoaded) return;
        	var ckey = 'store_cates', cates = $.vv.ls.get(ckey);
        	if(cates) {showCates(cates); return true;}
        	
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=store&a=get_cates',
                success: function(rst) {
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time: 3000}); 
                	} else {
                		showCates(rst.data.cates);
                		$.vv.ls.set(ckey, rst.data.cates, $.ckj.cacheTime.storeCate);
                		$.storeBook.cfg.catesLoaded = true;
                	}
                },
                dataType: "json"
            });
        	
        	function showCates(cates){
        		var chtml = $.ckj.renderPopupCates(cates);
        		$.query('#J_store_b_c').html(chtml);
        	}
        },
        
        loadStores: function() {
        	var wall = $.query('#J_store_wall');
        	var uri = '/?m=store&a=book&cid='+wall.attr('curCid')+'&sort='+wall.attr('sort');
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.storeBook.init();
})(af);
