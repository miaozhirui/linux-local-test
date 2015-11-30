(function($){
    $.brandBook = {
        cfg: {
        	panelInited:false,
        	catesLoaded:false
        },
        
        wallData:{
        	wallRcds:[]
        },
        
        init: function(options) {
        	$("#brand_book").bind("loadpanel", function(e) {
        		if(e.data.goBack){
        			$.ckj.showHideWallRcds($.brandBook.wallData.wallRcds, '#J_brand_wall');
        			return;
        		}
        		$.brandBook.panelInit();
        		//page params
        		var params = $.query("#brand_book").data('params'),
        		    cid = params[0],
        		    wall = $.query('#J_brand_wall');
                
                if(!$.ckj.cfg.backResetPanel && cid ==  wall.attr('curCid')) {
                    if(wall.find('.wall_brand').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') {
                        $.ckj.showHideWallRcds($.brandBook.wallData.wallRcds, '#J_brand_wall');
                        return;
                    } 
                }  
                
        		wall.attr({'curCid': cid});
        		$.feed.resetWall('#J_brand_wall', true);
        		$.brandBook.loadCates();
        		$.brandBook.loadBrands();
    		});
        	
        	$.query("#brand_book").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
        	        $.feed.resetWall('#J_brand_wall', true);
        	    } else {
        	        $.ckj.hideWallRcds($.brandBook.wallData.wallRcds, Math.abs($.query('#J_brand_wall_wrap').scroller().scrollTop));
        	    }
    		});
        },
        
        panelInit: function(){
        	if( $.brandBook.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_brand_wall_wrap"), wall = $.query('#J_brand_wall'), padding=15;
    		padding = parseInt($.vv.cfg.cWidth*0.05);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-125});
        	
        	$.feed.init('#J_brand_wall');
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
            
        	$.vv.ui.moreBlock('#brand_book');
        	$.brandBook.selectCate();
        	$.brandBook.selectOrder();

            if($.os.ios8)$('#brand_book .J_block_wrap').attr('init_height', '35.5px');
        	$.query('#brand_book').attr('scrollTgt', '#J_brand_wall_wrap');
        	$.brandBook.cfg.panelInited = true;
        },
        
        selectCate: function(){
        	$.query('#J_brand_b_c').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		var showTri = $this.closest('.J_block_wrap').find('.J_block_show');
        		if(showTri.attr('unfolded') == 'y') {
        			$.query('#J_brand_b_c a').removeClass('active');
        			$this.addClass('active');
	        		$this.insertAfter($.query('#J_brand_b_c a:first-child'));
	        		//load brands
	        		var wall 	= $.query('#J_brand_wall');
	        		var cid 	= $this.attr('cid');
	        		wall.attr('curCid', cid);
	        		$.feed.resetWall('#J_brand_wall', true);
	        		$.brandBook.loadBrands();
        		}
        		showTri.trigger('click'); 
        	});
        },
        selectOrder: function(){
        	$.query('#J_brand_orderrank').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		var showTri = $this.closest('.J_block_wrap').find('.J_block_show');
        		if(showTri.attr('unfolded') == 'y') {
	        		$this.insertBefore($.query('#J_brand_orderrank a:first-child'));
	        		//load brands
	        		var wall 	= $.query('#J_brand_wall');
	        		var sort 	= $this.attr('sort');
	        		wall.attr('sort', sort);
	        		$.feed.resetWall('#J_brand_wall', true);
	        		$.brandBook.loadBrands();
        		}
        		showTri.trigger('click'); 
        	});
        },
        loadCates: function(cid){
            if($.brandBook.cfg.catesLoaded) return;
        	var ckey = 'brand_cates', cates = $.vv.ls.get(ckey);
        	if(cates) {showCates(cates); return true;}
        	
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=brand&a=get_cates',
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time: 3000}); 
                	} else {
                		showCates(rst.data.cates);
                		$.vv.ls.set(ckey, rst.data.cates, $.ckj.cacheTime.brandCate);
                		$.brandBook.cfg.catesLoaded = true;
                	}
                },
                dataType: "json"
            });
        	
        	function showCates(cates){
        		var chtml = $.ckj.renderPopupCates(cates);
        		$.query('#J_brand_b_c').html(chtml);
        	}
        },
        loadBrands: function() {
        	var wall = $.query('#J_brand_wall');
        	var uri = '/?m=brand&a=book&cid='+wall.attr('curCid')+'&sort='+wall.attr('sort');
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.brandBook.init();
})(af);
