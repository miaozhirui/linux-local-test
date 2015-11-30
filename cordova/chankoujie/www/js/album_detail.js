(function($){
    $.albumDtl = {
    	cfg:{
    		id:0,
    		loadingAlbum:'y',
    		panelInited:false,
    		
    		albumLoaded:false,
    		itemLoaded:false
    	},
        wallData:{
        	wallRcds:[]
        },
    	
		infoScroller:false,
		itemScroller:false,
        
        init: function(options) {
        	$("#album_detail").bind("loadpanel",function(e){
        	    $.albumDtl.panelInit();
        	            		
        		var params = $.query("#album_detail").data('params'), 
        		    albumId = params[0];
        		if(e.data.goBack) {
        			if($.query("#album_detail .angle_tabs .cur").attr('t') == 'item')
        				$.ckj.showHideWallRcds($.albumDtl.wallData.wallRcds, '#J_album_dt_items_wall');
        		    $('#album_detail').css('opacity', '1');
        			return;
        		}
        		
        		if(!$.ckj.cfg.backResetPanel && albumId == $.albumDtl.cfg.id && $.albumDtl.cfg.albumLoaded) {
                    if($.query("#album_detail .angle_tabs .cur").attr('t') == 'item')
                        $.ckj.showHideWallRcds($.albumDtl.wallData.wallRcds, '#J_album_dt_items_wall');
                    $('#album_detail').css('opacity', '1');
                    return;
                }
        		
    			$.albumDtl.cfg.albumLoaded 	= false;
    			$.albumDtl.cfg.loadingAlbum = 'y'; 
    			$.albumDtl.cfg.itemLoaded 	= false;
    			
    			$.albumDtl.cfg.id = albumId;
        		
        		$.query("#album_detail .angle_tabs a[t=info]").trigger('click');
    		});
        	
        	$.query("#album_detail").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
        	        $.feed.resetWall('#J_album_dt_items_wall', true);
        	    } else {
        	        if($.query("#album_detail .angle_tabs .cur").attr('t') == 'item')
                        $.ckj.hideWallRcds($.albumDtl.wallData.wallRcds, Math.abs($.query('#J_album_dt_items_wall_wrap').scroller().scrollTop)); 
        	    }	
    		});
        },
        
        panelInit: function() {
        	if( $.albumDtl.cfg.panelInited === true ) return;
        	//tab switch
            $("#album_detail .angle_tabs").on('click',"a",function(e) {
            	e.stopPropagation();e.preventDefault();
            	
            	var type = $(this).attr('t'), wallWrap = null, wall = null;
            	
            	if(type != 'cmt') {
                    $.query("#album_detail .angle_tabs a").removeClass('cur');
                    $(this).addClass('cur');
                    $.query("#album_detail .J_tab_panel").hide();
            	} else {
                	$.ui.loadContent('#comment_book/album/'+$.albumDtl.cfg.id, false, false,$.ckj.cfg.cmtTrans);
            	}

                if( type == 'info' ){
                	wallWrap = $.query('#J_album_dt_info_wrap');
                	wallWrap.show();
                    if(!$.albumDtl.infoScroller) {
                    	$.albumDtl.infoScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
                    }
                    if(!$.albumDtl.cfg.albumLoaded){
                    	$.albumDtl.loadAlbum($.albumDtl.cfg.id);
                    }
                    $.query('#album_detail').attr('scrollTgt', '#J_album_dt_info_wrap');
                }else if( type == 'item' ){
                	wallWrap = $.query('#J_album_dt_items_wall_wrap');
                	wall = $.query('#J_album_dt_items_wall');
                	wallWrap.show();
                	//itemScroller.unlock(); cmtScroller.lock();
                    if(!$.albumDtl.itemScroller) {
                    	var padding = parseInt($.vv.cfg.cWidth * 0.04);
                    	padding = padding >= 20 ? 20 : padding;
                    	wall.attr({cols:2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
                    	wallWrap.attr({'masonryPad': padding+'px'}); //for list/masonry browse mode
                    	$.feed.init('#J_album_dt_items_wall');
                    	
                    	$.albumDtl.itemScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
                        if($.ckj.cfg.useInfinite) {
                            $.albumDtl.itemScroller.addInfinite();
                            $.bind($.albumDtl.itemScroller, "infinite-scroll", function () {
                                $.asap(function(r){
                                    if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                                        $.query(wall.attr('pageBar')).css('display') != 'none') return;
                                    $.query(wall.attr('triggerBar')).trigger('click');
                                }, null, []);
                            });
                        } 
                    }
                    if(!$.albumDtl.cfg.itemLoaded){
                    	wall.attr('aid', $.albumDtl.cfg.id);
                    	$.feed.resetWall('#J_album_dt_items_wall', true);
                    	$.albumDtl.loadItems();
                    }
                    $.query('#album_detail').attr('scrollTgt', '#J_album_dt_items_wall_wrap');
                }
            });
        	
        	// more albums click handler
        	$.query('#J_album_dt_malbums').on('click', 'a', function(e){
        		e.stopPropagation(); e.preventDefault();
    			$.feed.resetWall('#J_album_dt_items_wall', true);
    			$.albumDtl.cfg.id = $(this).attr('aid');
    			
    			//reset>>>
    			$.albumDtl.cfg.albumLoaded 	= false;
    			$.albumDtl.cfg.loadingAlbum = 'y'; 
    			$.albumDtl.cfg.itemLoaded 	= false;
    			
    			$.albumDtl.loadAlbum($.albumDtl.cfg.id);
    		});
            
        	$.user.follow('#album_detail');
        	$.user.unFollow('#album_detail');
        	$.comOp.follow('#album_detail');
        	$.comOp.unFollow('#album_detail');
        	
        	$.albumDtl.cfg.panelInited = true;
        },

        loadAlbum:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=album&a=detail&id='+id,
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time:3000, icon:'error'}); 
                	} else {
                		$.vv.tip({close:true});
                		var album = rst.data.album, malbums = rst.data.malbums, html = '', fHtml = '';
                		
                		$.query('#album_detail *[data-id]').attr('data-id', album.id);
                		
                		$.query('#J_album_dt_cover').attr('src', album.cover ? album.cover : 'data/album/default_cover.jpg');
                		$.query('#J_album_dt_name').html('<i class="fa fa-archive"></i> '+album.title);
                		
                		html 	= '';
                		fHtml 	= $.ckj.renderFollowShipBtn(album.uid, $.ckj.user.id, rst.data.authorShip);
                		html 	= '<a href="#space_index/'+album.uid+'"><img class="pabs" src="'+album.avatar+'" onload="$.ckj.onImgLoad(this);"  onerror="$.ckj.onImgError(this);"></a>\
			                       	<div class="uname prel">'+album.uname+'</div>\
			                        '+fHtml+'\
			                        <div class="coll fr '+(rst.data.hasFollowed ? 'J_unfollow' : 'J_follow')+'" itype="album" data-id="'+album.id+'">\
			                            <i class="fa fa-star-o"></i><span class="ltip">'+(rst.data.hasFollowed ? '已收藏' : '收藏')+'</span>\
			                      </div>';
                		$.query('#J_album_dt_meta').html(html);
                		
                		$.query('#J_album_dt_items').html(album.items);
                		$.query('#J_album_dt_comments').html(album.comments);
                		$.query('#J_album_dt_likes').html(album.likes);
                		$.query('#J_album_dt_follows').html(album.follows);
                		
                		html = '';
                		if(album.intro) {
                			html = '<h1 class="title">介绍</h1><div class="intro">'+album.intro+'</div>';
                			$.query('#J_album_dt_intro').html(html).show();
                		} else $.query('#J_album_dt_intro').hide();
                		
                		if(malbums.length>0) {
                			html='<h1 class="title">'+(album.uid == $.ckj.user.id ? '我' : 'Ta') + '的更多吃柜' + '</h1> <div class="more_albums">';
                			$.each(malbums, function(idx, r){
                				html += '<a aid='+r.id+'>'+r.title+'<span class="items">(<i>'+r.items+'</i> 食品)</span></a>';
                			});
                			html+='</div>';
                		}
                		$.query('#J_album_dt_malbums').html(html);
                		
                		$('#album_detail').css('opacity', '1');
                		
                		//scroll to top
                		$.albumDtl.cfg.loadingAlbum = 'n';
                		$.albumDtl.cfg.albumLoaded = true;
                    	$.query("#J_album_dt_info_wrap").scroller().scrollToTop();
                    	$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':6, 'title':r.title, 'img':r.avatar});}, null, [album]);
                	}
                },
                dataType: "json"
            });
        },

        loadItems: function() {
        	var wall = $.query('#J_album_dt_items_wall');
        	var uri = '/?m=album&a=items&aid='+wall.attr('aid')+'&masonry='+wall.attr('masonry');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        	
    		$.albumDtl.cfg.itemLoaded = true;
        }
    };
    $.albumDtl.init();
})(af);
