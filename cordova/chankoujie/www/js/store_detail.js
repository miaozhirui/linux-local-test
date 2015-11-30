(function($) {
    $.storeDtl = {
    	cfg: {
    		id:0,
    		loadingStore:'y',
    		panelInited:false,
    		
    		storeLoaded:false,
    		itemLoaded:false
    	},
        wallData:{
        	wallRcds:[]
        },
        
		infoScroller:false,
		itemScroller:false,
        
        init: function(options) {
        	$("#store_detail").bind("loadpanel",function(e){
        	    $.storeDtl.panelInit();
        		var params = $.query("#store_detail").data('params'), 
        		    storeId = params[0];
        		if(e.data.goBack) {
        			if($.query("#store_detail .angle_tabs .cur").attr('t') == 'item')
        				$.ckj.showHideWallRcds($.storeDtl.wallData.wallRcds, '#J_store_dt_items_wall');
        		    $('#store_detail').css('opacity', '1');
        			return;
        		}
        		
        		if(!$.ckj.cfg.backResetPanel && storeId == $.storeDtl.cfg.id && $.storeDtl.cfg.storeLoaded) {
                    if($.query("#store_detail .angle_tabs .cur").attr('t') == 'item')
                        $.ckj.showHideWallRcds($.storeDtl.wallData.wallRcds, '#J_store_dt_items_wall');
                    $('#store_detail').css('opacity', '1');
                    return;
                }
        		
        		$.storeDtl.cfg.storeLoaded    = false;
                $.storeDtl.cfg.loadingStore = 'y'; 
                $.storeDtl.cfg.itemLoaded   = false;
                    
        		$.storeDtl.cfg.id = storeId;

        		$.query("#store_detail .angle_tabs > *[t=info]").trigger('click');
    		});
    		
    		$.query("#store_detail").bind('unloadpanel', function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_store_dt_items_wall', true);
                } else {
                    if($.query("#store_detail .angle_tabs .cur").attr('t') == 'item')
                        $.ckj.hideWallRcds($.storeDtl.wallData.wallRcds, Math.abs($.query('#J_store_dt_items_wall_wrap').scroller().scrollTop));
                }
            });
        },
        
        panelInit: function() {
        	if( $.storeDtl.cfg.panelInited === true ) return;
        	
        	$.query('#store_detail').on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent($(this).attr('tourl'),false,false,"slide");
        	});
        	
        	//tab switch
            $("#store_detail .angle_tabs").on('click',"a",function(e) {
            	e.stopPropagation();e.preventDefault();
            	
            	var type = $(this).attr('t'), wallWrap = null, wall = null;
            	
                $.query("#store_detail .angle_tabs a").removeClass('cur');
                $(this).addClass('cur');
                $.query("#store_detail .J_tab_panel").hide();

                if( type == 'info' ){
                	wallWrap = $.query('#J_store_dt_info_wrap');
                	wallWrap.show();
                    if(!$.storeDtl.infoScroller) {
                    	$.storeDtl.infoScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
                    }
                    if(!$.storeDtl.cfg.storeLoaded){
                    	$.storeDtl.loadStore($.storeDtl.cfg.id);
                    }
                    $.query('#store_detail').attr('scrollTgt', '#J_store_dt_info_wrap');
                }else if( type == 'item' ){
                	wallWrap = $.query('#J_store_dt_items_wall_wrap');
                	wall = $.query('#J_store_dt_items_wall');
                	wallWrap.show();
                	//itemScroller.unlock(); cmtScroller.lock();
                    if(!$.storeDtl.itemScroller) {
                    	var padding = parseInt($.vv.cfg.cWidth*0.04);
                    	padding = padding >= 20 ? 20 : padding;
                    	wall.attr({'cols':2,'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
                    	$.feed.init('#J_store_dt_items_wall');
                    	$.storeDtl.itemScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
                        if($.ckj.cfg.useInfinite) {
                            $.storeDtl.itemScroller.addInfinite();
                            $.bind($.storeDtl.itemScroller, "infinite-scroll", function () {
                                $.asap(function(r){
                                    if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                                        $.query(wall.attr('pageBar')).css('display') != 'none') return;
                                    $.query(wall.attr('triggerBar')).trigger('click');
                                }, null, []);
                            });
                        } 
                    }
                    if(!$.storeDtl.cfg.itemLoaded){
                    	wall.attr('sid', $.storeDtl.cfg.id);
                    	$.feed.resetWall('#J_store_dt_items_wall', true);
                    	$.storeDtl.loadItems();
                    }
                    $.query('#store_detail').attr('scrollTgt', '#J_store_dt_items_wall_wrap');
                }
            });
        	
        	// more stores click handler
        	$.query('#J_store_dt_mstores').on('click', 'a', function(e){
        		e.stopPropagation(); e.preventDefault();
    			$.feed.resetWall('#J_store_dt_items_wall', true);
    			$.storeDtl.cfg.id = $(this).attr('sid');
    			
    			//reset>>>
    			$.storeDtl.cfg.storeLoaded 	= false;
    			$.storeDtl.cfg.loadingStore = 'y'; 
    			$.storeDtl.cfg.itemLoaded 	= false;
    			
    			$.storeDtl.loadStore($.storeDtl.cfg.id);
    		});

        	$.comOp.follow('#store_detail');
        	$.comOp.unFollow('#store_detail');
        	
        	$.storeDtl.cfg.panelInited = true;
        },

        loadStore:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=store&a=detail&id='+id,
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time:3000, icon:'error'}); 
                	} else {
                		$.vv.tip({close:true});
                		var store = rst.data.store, html = '', fHtml = '';
                		
                		$.query('#store_detail *[data-id]').attr('data-id', store.id);
                		
                		$.query('#J_store_dt_cover').attr('src', store.cover);
                		
                		html 	= '';
                		html 	= ' <a href="'+store.url+'" class="goshop J_goout">\
			                            <i class="fa fa-hand-o-right"></i>\
			                            <span class="ltip">进店看看</span>\
			                        </a>\
			                        <a class="'+(rst.data.hasFollowed ? 'J_unfollow' : 'J_follow')+'" itype="store" data-id="'+store.id+'">\
			                            <i class="fa fa-star"></i>\
			                            <span class="ltip">'+(rst.data.hasFollowed ? '已收藏' : '收藏')+'</span>\
			                        </a>\
			                        <a class="tocmt J_tocmt" tourl="#comment_book/store/'+store.id+'">\
			                            <i class="fa fa-comments1"></i>\
			                            <span class="ltip">评论<e>'+store.comments+'</e></span>\
			                        </a>\
			                        <p class="logo"><img src="'+store.slogo+'" onload="$.ckj.onImgLoad(this);" onerror="$.ckj.onImgError(this);" ></p>';
                		$.query('#J_store_dt_storeop').html(html);
                		
                		if(store.title){
	                		html = '';
	                		html ='<div class="intro"><strong>“</strong>'+store.title+'<strong>”</strong></div>';
	                		$.query('#J_store_dt_intro').html(html);
                		} else {
                			$.query('#J_store_dt_intro').hide();
                		}
                		
                		$.query('#J_store_dt_likes').html(store.likes);
                		$.query('#J_store_dt_follows').html(store.follows);
                		$.query('#J_store_dt_items').html(store.items);
                		$.query('#J_store_dt_address').html(store.address);
                				
	    				if(store.rec_why){
	                		html = '';
	                		html =' <h1 class="title">推荐理由</h1>\
	                            	<div class="recwhy">'+store.rec_why+'</div>';
	                		$.query('#J_store_dt_recwhy').html(html);
	            		} else {
	            			$.query('#J_store_dt_recwhy').hide();
	            		}
	            		
                        $('#store_detail').css('opacity', '1');
                        
                		//scroll to top
                		$.storeDtl.cfg.loadingStore = 'n';
                		$.storeDtl.cfg.storeLoaded = true;
                    	$.query("#J_store_dt_info_wrap").scroller().scrollToTop();
                    	$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':7, 'title':r.name, 'img':r.slogo});}, null, [store]);
                	}
                },
                dataType: "json"
            });
        },

        loadItems: function() {
        	var wall = $.query('#J_store_dt_items_wall');
        	var uri = '/?m=store&a=items&sid='+wall.attr('sid')+'&masonry='+wall.attr('masonry');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        	
    		$.storeDtl.cfg.itemLoaded = true;
        }
    };
    $.storeDtl.init();
})(af);
