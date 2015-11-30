(function($){
    $.stuffDtl = {
    	cfg: {
    		id:0,
    		loadingStuff:'y',
    		panelInited:false,
    		
    		stuffLoaded:false,
    		rciLoaded:false
    	},
    	
        wallData:{
        	wallRcds:[]
        },
    	
		infoScroller:false,
		rciScroller:false,
		
    	shareInfo: {
    		stitle:'',
    		sname:'',
    		imgUrl:'',
    		dtlUrl:''
    	},
    	
    	shareMsg: [	{'pre':'饮食健康很重要，食材营养搭配要知道，来看看', 'suf':'相关营养搭配知识吧！为自己，为家人~'}, 
	    	        {'pre':'你知道', 'suf':'营养和搭配禁忌吗？不知道的来了解了解吧。涨姿势很重要滴说哦~'}
    	          ],
        
        init: function(options) {
        	$("#stuff_detail").bind("loadpanel",function(e){
        	    $.stuffDtl.panelInit();
        	    
        		var params = $.query("#stuff_detail").data('params'), stuffId = params[0];
        		
        		if(e.data.goBack) {
        			if($.query("#stuff_detail .angle_tabs .cur").attr('t') == 'recipe')
        				$.ckj.showHideWallRcds($.stuffDtl.wallData.wallRcds, '#J_stuff_dt_recipes_wall');
        			$('#stuff_detail').css('opacity', '1');
        			return;
        		}
        		
                if(!$.ckj.cfg.backResetPanel && stuffId == $.stuffDtl.cfg.id && $.stuffDtl.cfg.stuffLoaded) {
                    if($.query("#stuff_detail .angle_tabs .cur").attr('t') == 'recipe')
                        $.ckj.showHideWallRcds($.stuffDtl.wallData.wallRcds, '#J_stuff_dt_recipes_wall');
                    $('#stuff_detail').css('opacity', '1');
                    return;
                }
        		
                $.stuffDtl.cfg.stuffLoaded  = false;
                $.stuffDtl.cfg.loadingStuff = 'y'; 
                $.stuffDtl.cfg.rciLoaded    = false;
                    
        		$.stuffDtl.cfg.id = stuffId;
        		
        		$.query("#stuff_detail .angle_tabs a[t=info]").trigger('click');
    		});
    		
            $.query("#stuff_detail").bind('unloadpanel', function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_stuff_dt_recipes_wall', true);
                } else {
                    if($.query("#stuff_detail .angle_tabs .cur").attr('t') == 'recipe')
                        $.ckj.hideWallRcds($.stuffDtl.wallData.wallRcds, Math.abs($.query('#J_stuff_dt_recipes_wall_wrap').scroller().scrollTop));
                }
            });
        },
        
        panelInit: function() {
        	if( $.stuffDtl.cfg.panelInited === true ) return;
        	$.query('#stuff_detail').on('click', '.J_socialShareStuff', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ckj.sShare($.stuffDtl.shareInfo, $.stuffDtl.shareMsg);
        	});
        	//tab switch
            $("#stuff_detail .angle_tabs").on('click',"a",function(e) {
            	e.stopPropagation();e.preventDefault();
            	
            	var type = $(this).attr('t'), wallWrap = null, wall = null;
            	
                $.query("#stuff_detail .angle_tabs a").removeClass('cur');
                $(this).addClass('cur');
                $.query("#stuff_detail .J_tab_panel").hide();

                if( type == 'info' ){
                	wallWrap = $.query('#J_stuff_dt_info_wrap');
                	wallWrap.show();
                    if(!$.stuffDtl.infoScroller) {
                    	$.stuffDtl.infoScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
                    }
                    if(!$.stuffDtl.cfg.stuffLoaded){
                    	$.stuffDtl.loadStuff($.stuffDtl.cfg.id);
                    }
                    
                    $.query('#stuff_detail').attr('scrollTgt', '#J_stuff_dt_info_wrap');
                } else if( type == 'recipe' ) {
                	wallWrap = $.query('#J_stuff_dt_recipes_wall_wrap');
                	wall = $.query('#J_stuff_dt_recipes_wall');
                	wallWrap.show();
                	//recipeScroller.unlock(); cmtScroller.lock();
                    if(!$.stuffDtl.rciScroller) {
                    	wall.addClass('list_wall');
                    	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': 0, 'wWallPad': 0, 'initHeight': $.vv.cfg.cHeight - 135});
                    	$.feed.init('#J_stuff_dt_recipes_wall');
                    	$.stuffDtl.rciScroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
            
                        if($.ckj.cfg.useInfinite) {
                            $.stuffDtl.rciScroller.addInfinite();
                            $.bind($.stuffDtl.rciScroller, "infinite-scroll", function () {
                                $.asap(function(r){
                                    if( wall.attr('isLoading')=='y' || wall.attr('allLoaded') == 'y' || 
                                        $.query(wall.attr('pageBar')).css('display') != 'none') return;
                                    $.query(wall.attr('triggerBar')).trigger('click');
                                }, null, []);
                            });
                        }
                    }
                    if(!$.stuffDtl.cfg.rciLoaded){
                    	wall.attr('sid', $.stuffDtl.cfg.id);
                    	$.feed.resetWall('#J_stuff_dt_recipes_wall', true);
                    	$.stuffDtl.loadRecipes();
                    }
                    
                    $.query('#stuff_detail').attr('scrollTgt', '#J_stuff_dt_recipes_wall_wrap');
                }
            });
        	
        	// more stuffs click handler
        	$.query('#J_stuff_dt_mstuffs').on('click', 'a', function(e){
        		e.stopPropagation(); e.preventDefault();
    			$.query('#J_stuff_dt_recipes_wall').empty();
    			$.stuffDtl.cfg.id = $(this).attr('rid');
    			
    			//reset>>>
    			$.stuffDtl.cfg.stuffLoaded 	= false;
    			$.stuffDtl.cfg.loadingStuff = 'y'; 
    			$.stuffDtl.cfg.rciLoaded 	= false;
    			
    			$.stuffDtl.loadStuff($.stuffDtl.cfg.id);
    		});
            
        	$.comOp.like('#stuff_detail');
        	$.comOp.unLike('#stuff_detail');
        	
        	$.vv.ui.onPressed('#J_stuff_dt_imgops');
        	
        	$.stuffDtl.cfg.panelInited = true;
        },

        loadStuff:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=stuff&a=detail&id='+id,
                success: function(rst) {
                	if(rst.status != 0) { //error happened
                		$.vv.tip({ content:rst.msg, time:3000, icon:'error'}); 
                	} else {
                		$.vv.tip({close:true});
                		var stuff = rst.data.stuff, cates = rst.data.cates, nutris=rst.data.nutris, hasLiked=rst.data.hasLiked, html ='';
                		$.stuffDtl.shareInfo = {'stitle':stuff.name+'的营养功能和搭配禁忌','sname':stuff.name, 
                								'imgUrl':stuff.img, 'dtlUrl':$.ckj.cfg.siteUrl+'/stuff/'+stuff.id};
                		$.query('#stuff_detail *[data-id]').attr('data-id', stuff.id);
                		
                		html = '<img class="blike" src="'+stuff.img+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);" >\
	                			<ul class="ops cfx">\
		             	            <li class="likes pink '+(hasLiked ? 'J_unlike' : 'J_like' )+' vv-pressed" outdel="n" data-id='+stuff.id+' itype="stuff">\
		             	                <i class="fa fa-heart-add"></i><span class="num J_like_n">'+stuff.likes+'</span>\
		             	                <p class="ltip">'+(hasLiked ? '取消喜欢' : '喜欢' )+'</p>\
		             	            </li>\
		             	            <li class="share green J_socialShareStuff vv-pressed">\
		             	                <i class="fa fa-share2"></i>\
		             	                <p>分享给...</p>\
		             	            </li>\
		             	        </ul>';
                		
                		$.query('#J_stuff_dt_imgops').html(html);
                		
                		html = '';
                		html += '<div class="top"><span class="title">'+stuff.name+'</span></div>';
                		if(stuff.alias) html += '<div class="alias"><i class="label fl">别名:</i><i class="val">'+stuff.alias+'</i></div>';
                		if(stuff.cates) html += '<div class="cates"><i class="label fl">分类:</i> <i class="val">'+stuff.cates+'</i></div>';
                		if(stuff.intro) html += '<div class="intro">'+stuff.intro+'</div>';
                		$.query('#J_stuff_dt_meta').html(html);
                		
                		//func
                		html = '';
                		if(nutris.length>0){
                			html += '<div class="ckjbox">\
                						<h1 class="title">营养成分</h1>\
                						<div class="stf_nutri cfx">';
                			$.each(nutris, function(idx, n){
                				html += '<i class="head">'+n.name+'</i><i class="val">'+n.amount+'</i>'
                			});
                			html += '	</div>\
                					</div>';
                		}
                		
                		if(stuff.nutrition) html += '<div class="ckjbox"><h1 class="title">营养价值</h1><div class="cnt">'+stuff.nutrition+'</div></div>';
                		if(stuff.taboo) html += '<div class="ckjbox"><h1 class="title">食用禁忌</h1><div class="cnt">'+stuff.taboo+'</div></div>';
                		if(stuff.effect) html += '<div class="ckjbox"><h1 class="title">使用效果</h1><div class="cnt">'+stuff.effect+'</div></div>';
                		if(stuff.people) html += '<div class="ckjbox"><h1 class="title">适用人群</h1><div class="cnt">'+stuff.people+'</div></div>';
                		if(stuff.choose) html += '<div class="ckjbox"><h1 class="title">挑选技巧</h1><div class="cnt">'+stuff.choose+'</div></div>';
                		if(stuff.storeway) html += '<div class="ckjbox"><h1 class="title">储存方法</h1><div class="cnt">'+stuff.storeway+'</div></div>';
                		
                		$.query('#J_stuff_dt_func').html(html);
                		$('#stuff_detail').css('opacity', '1');
                		
                		//scroll to top
                		$.stuffDtl.cfg.loadingStuff = 'n';
                		$.stuffDtl.cfg.stuffLoaded = true;
                    	$.query("#J_stuff_dt_info_wrap").scroller().scrollToTop();
                    	$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':4, 'title':r.name, 'img':r.img});}, null, [stuff]);
                	}
                },
                dataType: "json"
            });
        },

        loadRecipes: function() {
        	var wall = $.query('#J_stuff_dt_recipes_wall');
        	var uri = '/?m=stuff&a=recipes&sid='+wall.attr('sid')+'&masonry='+wall.attr('masonry');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        	
    		$.stuffDtl.cfg.rciLoaded = true;
        }
    };
    $.stuffDtl.init();
})(af);
