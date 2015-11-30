(function($){
    $.stuffBook = {
		cfg: {
        	panelInited:false
        },
        wallData:{
        	wallRcds:[]
        },
        init: function(options) {
        	$.query("#stuff_book").bind("loadpanel", function(e) {
        	    var params  = $.query("#stuff_book").data('params'), 
                    cid     = params[0],
                    wall    = $.query('#J_stuff_wall');
                $.ui.setTitle('食材-'+decodeURIComponent(params[1]));
                
        		if(e.data.goBack){
        			$.ckj.showHideWallRcds($.stuffBook.wallData.wallRcds, '#J_stuff_wall');
        			return;
        		}
        		
        		$.stuffBook.panelInit();
        		
                //book the same type and cid recipes return;
                if(!$.ckj.cfg.backResetPanel && !e.data.goBack && cid == wall.attr('curCid')) {
                    if(wall.find('.wall_stuff').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') {
                        $.ckj.showHideWallRcds($.stuffBook.wallData.wallRcds, '#J_stuff_wall');
                        return; 
                    }
                }
        		
        		wall.attr({'curCid': cid});
        		$.feed.resetWall('#J_stuff_wall', true);
        		$.stuffBook.loadStuffs();
        		$.stuffBook.loadCates(cid);
    		});
    		
        	$.query("#stuff_book").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_stuff_wall', true);
                } else {
                    $.ckj.hideWallRcds($.stuffBook.wallData.wallRcds, Math.abs($.query('#J_stuff_wall_wrap').scroller().scrollTop));
                }
    		});
        },
        
        panelInit: function(){
        	if( $.stuffBook.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_stuff_wall_wrap"), wall = $.query('#J_stuff_wall'), padding=15;
    		padding = parseInt($.vv.cfg.cWidth*0.05);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-125});
        	
        	$.feed.init('#J_stuff_wall');
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
            
        	$.vv.ui.moreBlock('#stuff_book');
        	$.stuffBook.selectCate();
        	
        	$.query('#stuff_book').attr('scrollTgt', '#J_stuff_wall_wrap');
        	if($.os.ios8)$('#stuff_book .J_block_wrap').attr('init_height', '35.5px');
        	
        	$.stuffBook.cfg.panelInited = true;
        },
        
        loadCates: function(cid) {
        	var ckey = 'stuff_scates_'+cid, cates = $.vv.ls.get(ckey);
        	if(cates) { showCates(cates, cid); return true; }
        	
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=stuff&a=get_subcates&cid='+cid,
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time: 3000}); 
                	} else {
                		showCates(rst.data.sub_cates, cid);
                		$.vv.ls.set(ckey, rst.data.sub_cates, $.ckj.cacheTime.stuffCate);
                	}
                },
                dataType: "json"
            });
        	
        	function showCates(cates, cid){
            	var chtml = $.ckj.renderPopupCates(cates, cid);
            	$.query('#J_stuff_b_c').html(chtml);
            	$.query('#J_stuff_b_c_tri').find('span').html(cates[cid]['name']);
        	}
        },
        
        selectCate: function(){
        	$.query('#J_stuff_b_c').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		var showTri = $this.closest('.J_block_wrap').find('.J_block_show');
        		if(showTri.attr('unfolded') == 'y') {
        			$.query('#J_stuff_b_c a').removeClass('active');
        			$this.addClass('active');
	        		$this.insertAfter($.query('#J_stuff_b_c a:first-child'));
	        		//load stuffs
	        		var wall 	= $.query('#J_stuff_wall');
	        		var cid 	= $this.attr('cid');
	        		wall.attr('curCid', cid);
	        		$.feed.resetWall('#J_stuff_wall', true);
	        		$.stuffBook.loadStuffs();
        		}
        		showTri.trigger('click'); 
        	});
        },
        
        loadStuffs: function() {
        	var wall = $.query('#J_stuff_wall');
        	var uri  =  '/?m=stuff&a=book&cid='+wall.attr('curCid');
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    
    $.stuffBook.init();
})(af);
