(function($) {
    $.brandDtl = {
    	cfg: {
    		id:0,
    		loadingBrand:'y',
    		panelInited:false,
    		
    		brandLoaded:false,
    		itemLoaded:false
    	},
    	
        wallData:{
        	wallRcds:[]
        },
    	
		infoScroller:false,
		itemScroller:false,
        
        init: function(options) {
        	$("#brand_detail").bind("loadpanel",function(e){
        	    $.brandDtl.panelInit();
        	    
        		var params = $.query("#brand_detail").data('params'), 
        		    brandId = params[0];
        		if(e.data.goBack) {
        			if($.query("#brand_detail .angle_tabs .cur").attr('t') == 'item')
        				$.ckj.showHideWallRcds($.brandDtl.wallData.wallRcds, '#J_brand_dt_items_wall');
        		    $('#brand_detail').css('opacity', '1');
        			return;
        		}
        		
        		if(!$.ckj.cfg.backResetPanel && brandId == $.brandDtl.cfg.id && $.brandDtl.cfg.panelInited) {
                    if($.query("#brand_detail .angle_tabs .cur").attr('t') == 'item')
                        $.ckj.showHideWallRcds($.brandDtl.wallData.wallRcds, '#J_brand_dt_items_wall');
                    $('#brand_detail').css('opacity', '1');
                    return;
                }
        		
        		$.brandDtl.cfg.brandLoaded    = false;
                $.brandDtl.cfg.loadingBrand = 'y'; 
                $.brandDtl.cfg.itemLoaded   = false;
                    
        		$.brandDtl.cfg.id = brandId;

        		$.query("#brand_detail .angle_tabs *[t=info]").trigger('click');
    		});
    		
            $.query("#brand_detail").bind('unloadpanel', function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_brand_dt_items_wall', true);
                } else {
                    if($.query("#brand_detail .angle_tabs .cur").attr('t') == 'item')
                        $.ckj.hideWallRcds($.brandDtl.wallData.wallRcds, Math.abs($.query('#J_brand_dt_items_wall_wrap').scroller().scrollTop));
                }
            });
        },
        
        panelInit: function() {
        	if( $.brandDtl.cfg.panelInited === true ) return;
        	
        	$.query('#brand_detail').on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent('#comment_book/brand/'+$.brandDtl.cfg.id, false, false,$.ckj.cfg.cmtTrans);
        	});
        	
        	//tab switch
            $("#brand_detail .angle_tabs").on('click',"a",function(e) {
            	e.preventDefault();
            	
            	var type = $(this).attr('t'), wallWrap = null, wall = null;
            	
            	if(type != 'cmt') {
                    $.query("#brand_detail .angle_tabs *").removeClass('cur');
                    $(this).addClass('cur');
                    $.query("#brand_detail .J_tab_panel").hide();
            	}

                if( type == 'info' ){
                	wallWrap = $.query('#J_brand_dt_info_wrap');
                	wallWrap.show();
                    if(!$.brandDtl.infoScroller) {
                    	$.brandDtl.infoScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
                    }
                    if(!$.brandDtl.cfg.brandLoaded){
                    	$.brandDtl.loadBrand($.brandDtl.cfg.id);
                    }
                    $.query('#brand_detail').attr('scrollTgt', '#J_brand_dt_info_wrap');
                }else if( type == 'item' ){
                	wallWrap = $.query('#J_brand_dt_items_wall_wrap');
                	wall = $.query('#J_brand_dt_items_wall');
                	wallWrap.show();
                	//itemScroller.unlock(); cmtScroller.lock();
                    if(!$.brandDtl.itemScroller) {
                    	var padding = parseInt($.vv.cfg.cWidth*0.04);
                    	padding = padding >= 20 ? 20 : padding;
                    	wall.attr({'cols':2,'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
                    	
                    	$.feed.init('#J_brand_dt_items_wall');
                    	$.brandDtl.itemScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
                    	if($.ckj.cfg.useInfinite) {
                            $.brandDtl.itemScroller.addInfinite();
                            $.bind($.brandDtl.itemScroller, "infinite-scroll", function () {
                                $.asap(function(r){
                                    if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                                        $.query(wall.attr('pageBar')).css('display') != 'none') return;
                                    $.query(wall.attr('triggerBar')).trigger('click');
                                }, null, []);
                            });
                        } 
                    }
                    if(!$.brandDtl.cfg.itemLoaded){                    	
                    	wall.attr('bid', $.brandDtl.cfg.id);
                    	$.feed.resetWall('#J_brand_dt_items_wall', true);
                    	$.brandDtl.loadItems();
                    }
                    $.query('#brand_detail').attr('scrollTgt', '#J_brand_dt_items_wall_wrap');
                }
            });
        	
        	// more brands click handler
        	$.query('#J_brand_dt_mbrands').on('click', 'a', function(e){
        		e.stopPropagation(); e.preventDefault();
    			$.query('#J_brand_dt_items_wall').empty();
    			$.brandDtl.cfg.id = $(this).attr('bid');
    			
    			//reset>>>
    			$.brandDtl.cfg.brandLoaded 	= false;
    			$.brandDtl.cfg.loadingBrand = 'y'; 
    			$.brandDtl.cfg.itemLoaded 	= false;
    			
    			$.brandDtl.loadBrand($.brandDtl.cfg.id);
    		});

        	$.comOp.follow('#brand_detail');
        	$.comOp.unFollow('#brand_detail');
        	
        	$.brandDtl.cfg.panelInited = true;
        },

        loadBrand:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=brand&a=detail&id='+id,
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time:3000, icon:'error'}); 
                	} else {
                		$.vv.tip({close:true});
                		var brand = rst.data.brand, html = '', fHtml = '';
                		
                		$.query('#brand_detail *[data-id]').attr('data-id', brand.id);
                		
                		$.query('#J_brand_dt_cover').attr('src', brand.cover);
                		
                		html 	= '';
                		html 	= ' <div class="logo_wrap">\
			                            <img class="logo" src="'+brand.blogo+'" \
			                                 onload="$.ckj.onImgLoad(this);" onerror="$.ckj.onImgError(this);" >\
			                        </div>\
			                        <div class="nmcoll cfx">\
			                            <div class="name pink fl"><i class="fa fa-flag"></i>'+brand.name+' </div>\
			                            <div class="coll fr '+(rst.data.hasFollowed ? 'J_unfollow' : 'J_follow')+'" itype="brand" data-id="'+brand.id+'">\
			                                <i class="fa fa-star-o"></i><span class="ltip">'+(rst.data.hasFollowed ? '已收藏' : '收藏品牌')+'</span>\
			                            </div>\
			                        </div>\
			                        <p class="title"><strong>“</strong>'+brand.title+'<strong>”</strong></p>';
                		$.query('#J_brand_dt_sum').html(html);
                	
                		$.query('#J_brand_dt_likes').html(brand.likes);
                		$.query('#J_brand_dt_follows').html(brand.follows);
                		$.query('#J_brand_dt_items').html(brand.items);
                		$.query('#J_brand_dt_address').html(brand.address);
                		$.query('#J_brand_dt_comments').html(brand.comments);
                				
	    				if(brand.story){
	                		html = '';
	                		html =' <h1 class="title">品牌故事</h1>\
	                            	<div class="story">'+brand.story+'</div>';
	                		$.query('#J_brand_dt_story').html(html);
	            		} else {
	            			$.query('#J_brand_dt_story').hide();
	            		}
	            		
	            		$('#brand_detail').css('opacity', '1');

                		//scroll to top
                		$.brandDtl.cfg.loadingBrand = 'n';
                		$.brandDtl.cfg.brandLoaded = true;
                    	$.query("#J_brand_dt_info_wrap").scroller().scrollToTop();
                    	$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':8, 'title':r.name, 'img':r.blogo});}, null, [brand]);
                	}
                },
                dataType: "json"
            });
        },

        loadItems: function() {
        	var wall = $.query('#J_brand_dt_items_wall');
        	var uri = '/?m=brand&a=items&bid='+wall.attr('bid')+'&masonry='+wall.attr('masonry');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        	
    		$.brandDtl.cfg.itemLoaded = true;
        }
    };
    $.brandDtl.init();
})(af);
