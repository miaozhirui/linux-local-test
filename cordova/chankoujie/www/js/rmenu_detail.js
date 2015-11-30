(function($){
    $.rmenuDtl = {
    	cfg:{
    		id:0,
    		loadingRmenu:'y',
    		panelInited:false,
    		
    		rmenuLoaded:false,
    		rciLoaded:false
    	},
        wallData:{
        	wallRcds:[]
        },
    	
		infoScroller:false,
		rciScroller:false,
        
        init: function(options) {
        	$("#rmenu_detail").bind("loadpanel",function(e){
        	    $.rmenuDtl.panelInit();
        	    
        		var params = $.query("#rmenu_detail").data('params'), 
        		    rmenuId = params[0];   		
        		    
        		if(e.data.goBack) {
        			if($.query("#rmenu_detail .angle_tabs .cur").attr('t') == 'recipe')
        				$.ckj.showHideWallRcds($.rmenuDtl.wallData.wallRcds, '#J_rmenu_dt_recipes_wall');
        		    $('#rmenu_detail').css('opacity', '1');
        			return;
        		}
        		
        		if(!$.ckj.cfg.backResetPanel && rmenuId == $.rmenuDtl.cfg.id && $.rmenuDtl.cfg.rmenuLoaded) {
                    if($.query("#rmenu_detail .angle_tabs .cur").attr('t') == 'recipe')
                        $.ckj.showHideWallRcds($.rmenuDtl.wallData.wallRcds, '#J_rmenu_dt_recipes_wall');
                    $('#rmenu_detail').css('opacity', '1');
                    return;
                }
        		
        		$.rmenuDtl.cfg.id = rmenuId;

    			$.rmenuDtl.cfg.rmenuLoaded 	= false;
    			$.rmenuDtl.cfg.loadingRmenu = 'y'; 
    			$.rmenuDtl.cfg.rciLoaded 	= false;
        		
        		$.query("#rmenu_detail .angle_tabs a[t=info]").trigger('click');
    		});
        	
        	$.query("#rmenu_detail").bind('unloadpanel', function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_rmenu_dt_recipes_wall', true);
                } else {
            		if($.query("#rmenu_detail .angle_tabs .cur").attr('t') == 'recipe')
            			$.ckj.hideWallRcds($.rmenuDtl.wallData.wallRcds, Math.abs($.query('#J_rmenu_dt_recipes_wall_wrap').scroller().scrollTop));
                }
    		});
        },
        
        panelInit: function() {
        	if( $.rmenuDtl.cfg.panelInited === true ) return;
        	//tab switch
            $("#rmenu_detail .angle_tabs").on('click',"a",function(e) {
            	e.stopPropagation();e.preventDefault();
            	
            	var type = $(this).attr('t'), wallWrap = null, wall = null;
            	
            	if(type != 'cmt') {
                    $.query("#rmenu_detail .angle_tabs a").removeClass('cur');
                    $(this).addClass('cur');
                    $.query("#rmenu_detail .J_tab_panel").hide();
            	} else {
                	$.ui.loadContent('#comment_book/rmenu/'+$.rmenuDtl.cfg.id, false, false,$.ckj.cfg.cmtTrans);
            	}

                if( type == 'info' ){
                	wallWrap = $.query('#J_rmenu_dt_info_wrap');
                	wallWrap.show();
                    if(!$.rmenuDtl.infoScroller) {
                    	$.rmenuDtl.infoScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
                    }
                    if(!$.rmenuDtl.cfg.rmenuLoaded){
                    	$.rmenuDtl.loadRmenu($.rmenuDtl.cfg.id);
                    }
                    $.query('#rmenu_detail').attr('scrollTgt', '#J_rmenu_dt_info_wrap');
                }else if( type == 'recipe' ){
                	wallWrap = $.query('#J_rmenu_dt_recipes_wall_wrap');
                	wall = $.query('#J_rmenu_dt_recipes_wall');
                	wallWrap.show();
                	//recipeScroller.unlock(); cmtScroller.lock();
                    if(!$.rmenuDtl.rciScroller) {
                    	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': 0, 'wWallPad': 0, 'initHeight':$.vv.cfg.cHeight-135});
                    	$.feed.init('#J_rmenu_dt_recipes_wall');
                    	$.rmenuDtl.rciScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
                        if($.ckj.cfg.useInfinite) {
                            $.rmenuDtl.rciScroller.addInfinite();
                            $.bind($.rmenuDtl.rciScroller, "infinite-scroll", function () {
                                $.asap(function(r){
                                    if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                                        $.query(wall.attr('pageBar')).css('display') != 'none') return;
                                    $.query(wall.attr('triggerBar')).trigger('click');
                                }, null, []);
                            });
                        } 
                    }
                    if(!$.rmenuDtl.cfg.rciLoaded){
                    	var usrCfg = $.vv.ls.get('usrCfg'), bMode='list', cols=1, padding = 0;
	            		if(usrCfg && usrCfg.recipeBrowseMode && usrCfg.recipeBrowseMode == 'masonry') bMode = 'masonry';
	
	                	if(bMode == 'list') {
	                		wall.addClass('list_wall');
	                		cols=1;
	                	} else {
	                	    cols=2;
	                	    wall.removeClass('list_wall');
	                		padding = parseInt($.vv.cfg.cWidth*0.05);
	                		padding = padding >= 20 ? 20 : padding;
	                	}
	                	
	                	wall.attr({'cols':cols, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding});
                    	wall.attr('aid', $.rmenuDtl.cfg.id);
                    	$.feed.setMasonryParams(wall);
                    	$.feed.resetWall('#J_rmenu_dt_recipes_wall', true);
                    	$.rmenuDtl.loadRecipes();
                    }
                    
                    $.query('#rmenu_detail').attr('scrollTgt', '#J_rmenu_dt_recipes_wall_wrap');
                }
            });
        	
        	// more rmenus click handler
        	$.query('#J_rmenu_dt_mrmenus').on('click', 'a', function(e){
        		e.stopPropagation(); e.preventDefault();
    			$.feed.resetWall('#J_rmenu_dt_recipes_wall', true);
    			$.rmenuDtl.cfg.id = $(this).attr('rid');
    			
    			//reset>>>
    			$.rmenuDtl.cfg.rmenuLoaded 	= false;
    			$.rmenuDtl.cfg.loadingRmenu = 'y'; 
    			$.rmenuDtl.cfg.rciLoaded 	= false;
    			
    			$.rmenuDtl.loadRmenu($.rmenuDtl.cfg.id);
    		});
            
        	$.user.follow('#rmenu_detail');
        	$.user.unFollow('#rmenu_detail');
        	$.comOp.follow('#rmenu_detail');
        	$.comOp.unFollow('#rmenu_detail');
        	
        	$.rmenuDtl.cfg.panelInited = true;
        },

        loadRmenu:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=rmenu&a=detail&id='+id,
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time:3000, icon:'error'}); 
                	} else {
                		$.vv.tip({close:true});
                		var rmenu = rst.data.rmenu, mrmenus = rst.data.mrmenus, html = '', fHtml = '';
                		
                		$.query('#rmenu_detail *[data-id]').attr('data-id', rmenu.id);
                		
                		$.query('#J_rmenu_dt_cover').attr('src', rmenu.cover ? rmenu.cover : 'data/rmenu/default_cover.jpg');
                		$.query('#J_rmenu_dt_name').html('<i class="fa fa-clipboard"></i> '+rmenu.title);
                		
                		html 	= '';
                		fHtml 	= $.ckj.renderFollowShipBtn(rmenu.uid, $.ckj.user.id, rst.data.authorShip);
                		html 	= ' <a href="#space_index/'+rmenu.uid+'">\
                		                 <img class="pabs" src="'+rmenu.avatar+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);">\
                		            </a>\
			                       	<div class="uname prel">'+rmenu.uname+'</div>\
			                        '+fHtml+'\
			                        <div class="coll fr '+(rst.data.hasFollowed ? 'J_unfollow' : 'J_follow')+'" itype="rmenu" data-id="'+rmenu.id+'">\
			                            <i class="fa fa-star-o"></i><span class="ltip">'+(rst.data.hasFollowed ? '已收藏' : '收藏菜单')+'</span>\
			                      </div>';
                		$.query('#J_rmenu_dt_meta').html(html);
                		
                		$.query('#J_rmenu_dt_recipes').html(rmenu.recipes);
                		$.query('#J_rmenu_dt_comments').html(rmenu.comments);
                		$.query('#J_rmenu_dt_likes').html(rmenu.likes);
                		$.query('#J_rmenu_dt_follows').html(rmenu.follows);
                		
                		html = '';
                		if(rmenu.intro) {
                			html = '<h1 class="title">介绍</h1><div class="intro">'+rmenu.intro+'</div>';
                			$.query('#J_rmenu_dt_intro').html(html).show();
                		} else $.query('#J_rmenu_dt_intro').hide();
                		
                		if(mrmenus.length>0) {
                			html='<h1 class="title">'+(rmenu.uid == $.ckj.user.id ? '我' : 'Ta') + '的更多菜单' + '</h1> <div class="more_rmenus">';
                			$.each(mrmenus, function(idx, r){
                				html += '<a rid='+r.id+' data-pressed="true">'+r.title+'<span class="recipes">(<i>'+r.recipes+'</i> 菜谱)</span></a>';
                			});
                			html+='</div>';
                			$.query('#J_rmenu_dt_mrmenus').html(html).show();
                		} else {
                			$.query('#J_rmenu_dt_mrmenus').hide();
                		}
                		
                		$('#rmenu_detail').css('opacity', '1');
                		
                		//scroll to top
                		$.rmenuDtl.cfg.loadingRmenu = 'n';
                		$.rmenuDtl.cfg.rmenuLoaded = true;
                    	$.query("#J_rmenu_dt_info_wrap").scroller().scrollToTop();
                    	
                    	$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':2, 'title':r.title, 'img':r.avatar});}, null, [rmenu]);
                	}
                },
                dataType: "json"
            });
        },

        loadRecipes: function() {
        	var wall = $.query('#J_rmenu_dt_recipes_wall');
        	var uri = '/?m=rmenu&a=recipes&aid='+wall.attr('aid')+'&masonry='+(wall.hasClass('list_wall') ? 'n' : 'y');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        	
    		$.rmenuDtl.cfg.rciLoaded = true;
        }
    };
    $.rmenuDtl.init();
})(af);
