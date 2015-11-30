(function($){
    $.spaceLike = {
        cfg: {
        	panelInited:false
        },
        wCache: {},
        actMap:{ 'recipe':'unlike', 'work':'unlike', 'stuff':'unlike', 'item':'unlike', 'store':'unfollow', 
        		'brand':'unfollow', 'rstrnt':'unlike', 'rstimg':'unlike'},
        init: function(options) {
        	$("#space_like").bind("loadpanel", function(e) {
        	    $.spaceLike.panelInit();
        	    
        		var params = $.query("#space_like").data('params'),
        			uid = params[0], wall = $.query('#J_like_wall');
        		uid = uid || $.ckj.user.id;
        		
        		$.spaceLike.selectType();
        		
        		if(uid == $.ckj.user.id) {
                    $.query('#space_like').on('click', '#J_like_wall > *', function(e){
                    	e.preventDefault(); e.stopPropagation();
                		var wall = $.query('#J_like_wall');
                        var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), 
                        	did=$(this).attr('did'), cnt='', rType=$(this).attr('class').replace('wall_', ''), rname = $.ckj.rcdMap[rType];
                        $.vv.log('rType:: '+rType+' rname:: '+rname);

                		jpop.setCnt('<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_'+rType+'" wallId="J_like_wall">\
		                				<p class="J_lopGoHash" aUrl="#'+rType+'_detail/'+did+'" data-pressed="true">查看详情<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopDoAjax" aUrl="/?m='+rType+'&a='+$.spaceLike.actMap[rType]+'&id='+did+'" \
			            					tipTit="取消喜欢" tipMsg="确定取消喜欢该'+rname+'么？" data-pressed="true">取消喜欢<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopCel" data-pressed="true">取消</p>\
			            			</div>');
                    });
                    $.ui.setTitle('我的喜欢');
        		} else {
        			$.query('#space_like').on('click', '#J_like_wall > *', function(e){
        			    var rType=$(this).attr('class').replace('wall_', '');
                        //$.vv.log('===========>rType:: '+rType, '===========> did:: '+$(this).attr('did'));
            			$.ui.loadContent('#'+rType+'_detail/'+$(this).attr('did'),false,false);
                    });
            		$.ui.setTitle('Ta的喜欢');
        		}
        		
        		if(e.data.goBack) return;
        		if(!$.ckj.cfg.backResetPanel && uid ==  wall.attr('uid')) return;
        		
        		$.spaceLike.wCache = {}; 
        		wall.attr('curType', '');
        		
        		wall.attr('uid', uid);
        		$.query('#J_like_tabs li[type=recipe]').trigger('click');
    		});
        	
        	$("#space_like").bind("unloadpanel", function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_like_wall', true);
                    $.spaceLike.wCache = {}; 
                    $.query('#J_like_tabs li').removeClass('on');
                }
                
        		$.query('#space_like').off('click', '#J_like_wall > *');
        		$.query('#J_like_tabs').off('click', 'li');
        	});
        },
        
        panelInit: function() {
        	if( $.spaceLike.cfg.panelInited === true ) return;
        	
        	$.query("#J_like_tabs").scroller({ scrollBars : false,  verticalScroll : false,  
        	                                   horizontalScroll : true, hasParent:true, useJsScroll:true});
        	
        	$.feed.init('#J_like_wall');
        	var scroller = $.query("#J_like_wall_wrap").scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"}),
                wall   = $.query('#J_like_wall');
            
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
        	
        	$.query('#space_like').attr('scrollTgt', '#J_like_wall_wrap');
        	$.spaceLike.cfg.panelInited = true;
        },
        
        selectType: function(){
        	$.query('#J_like_tabs').on('click', 'li', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.vv.tip({close:true});
        		$.abortQueuedAjax();
        		
        		var $this = $(this),
            		wall  = $.query('#J_like_wall'),
            		type  = $this.attr('type');
            		
        		$.query('#J_like_tabs li').removeClass('on');
        		$this.addClass('on');
        		
        		if(!$.ckj.cfg.tabResetPanel) {
            		var wallWrap = $.query("#J_like_wall_wrap"), 
            			wallPg = $.query('#J_like_wall_pageBar'), 
            			cType = wall.attr('curType');

            		//>>> cache the wall
            		if(cType) $.spaceLike.wCache[cType] = {page:wall.attr('page'), spage:wall.attr('spage'), wHtml:wall.html(), height:wall.height(),
    								scrollY: $.getCssMatrix($('#J_like_wall_wrap > div').get(0)).f, pgHtml:wallPg.html(), 
    								swpDisp:wallPg.css('display').toLowerCase(), wTops: wall.data('wTops'), masonry:wall.attr('masonry'),
    								cols:wall.attr('cols'), 'wOffX':wall.attr('wOffX'), 'wOffY':wall.attr('wOffY'), 'wWallPad':wall.attr('wWallPad'),
    								feedRcd:wall.attr('feedRcd'), renderFunc:wall.attr('renderFunc'), delta:wall.attr('delta'), oImgWd:wall.attr('oImgWd'),
    								sizeUnit: wall.attr('sizeUnit'), 'initHeight':wall.attr('initHeight'), isLoading:wall.attr('isLoading'), 
    								allLoaded: wall.attr('allLoaded'), triDisp:$.query('#J_like_wall_triggerBar').css('display').toLowerCase(),
    								triHtml:$.query('#J_like_wall_triggerBar').html()
    				};
            		if(cType == 'work') $.spaceLike.wCache[cType].padding = wall.css('padding');
        		}
        		
        		wall.attr('curType', type);
        		if(type == 'recipe') wall.addClass('list_wall');
        		else wall.removeClass('list_wall');
                if(type == 'work') wall.css('height', 'auto');//non absoulte position rcd need this...
                
        		//>>> restore the wall
            	if(!$.ckj.cfg.tabResetPanel && $.spaceLike.wCache[type]){
            		var c = $.spaceLike.wCache[type], wallPg = $.query('#J_like_wall_pageBar');
            		
            		wall.attr({ masonry:c.masonry, cols:c.cols, wOffX:c.wOffX, wOffY:c.wOffY, wWallPad:c.wWallPad, 
            					initHeight:c.initHeight, sizeUnit:c.sizeUnit, feedRcd:c.feedRcd, renderFunc:c.renderFunc,
            					delta:c.delta, oImgWd:c.oImgWd
            			});
            		
            		$.feed.resetWall('#J_like_wall', true);
            		
            		wall.attr({ page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
            		wall.css('height', c.height + 'px').html(c.wHtml).data('wTops', c.wTops);
            		
            		if(type == 'work') wall.css('padding', c.padding);
            		
            		if(c.swpDisp !== 'none') wallPg.show();
            		else wallPg.hide();
            		if(c.triDisp !== 'none') $.query('#J_like_wall_triggerBar').html(c.triHtml).show();
            		else $.query('#J_like_wall_triggerBar').html(c.triHtml).hide();
            		
            		wallPg.html(c.pgHtml);
            		
            		$.query('#J_like_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
            	} 
            	
                if($.ckj.cfg.tabResetPanel || !$.spaceLike.wCache[type]){
            		var padding=0;
            		if(type == 'recipe'){
                		padding = 0;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_recipe', 'sizeUnit':'', 'renderFunc':'$.ckj.renderRecipes',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有喜欢的菜谱'
                    			 });
            		}  else if(type == 'work'){
            			var paddingLR = ($.vv.cfg.cWidth * 0.14) / 2;
                    	paddingLR = paddingLR >= 30 ? 30 : paddingLR;
                    	wall.attr({ 'masonry':'n', 'cols':1, 'feedRcd':'wall_work', 'sizeUnit':'', 'renderFunc':'$.ckj.renderWorks',
                    				'oImgWd':'', 'wOffX': '', 'wOffY': '', 'wWallPad': '', 'initHeight':$.vv.cfg.cHeight-130, 'delta':'n',
                    				'noDataMsg':'<i class="fa fa-smile-o"></i>还没有喜欢的菜谱作品'
                    			 }).css('padding', paddingLR+'px '+paddingLR+'px 10px '+paddingLR+'px');
            		} else if(type == 'stuff'){
                		padding = parseInt($.vv.cfg.cWidth*0.05);
                		padding = padding >= 20 ? 20 : padding;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_stuff', 'sizeUnit':'', 'renderFunc':'$.ckj.renderStuffs',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有喜欢的食材'
                    			 });
            		} else if(type == 'item') {
                		padding = parseInt($.vv.cfg.cWidth*0.04);
                		padding = padding >= 20 ? 20 : padding;
                    	wall.attr({ 'masonry':'y', 'cols':2, 'feedRcd':'wall_item', 'sizeUnit':'.pic', 'renderFunc':'$.ckj.renderItems',
                    				'oImgWd':210, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'y', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有喜欢的食品'
                    			 });
            		} else if(type == 'store'){
                		padding = parseInt($.vv.cfg.cWidth*0.05);
                		padding = padding >= 20 ? 20 : padding;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_store', 'sizeUnit':'', 'renderFunc':'$.ckj.renderStores',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有喜欢的好吃店'
                    			 });
            		} else if(type == 'brand'){
                		padding = parseInt($.vv.cfg.cWidth*0.05);
                		padding = padding >= 20 ? 20 : padding;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_brand', 'sizeUnit':'', 'renderFunc':'$.ckj.renderBrands',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有喜欢的食品品牌'
                    			 });
            		} else if(type == 'rstrnt'){
                		padding = 0;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_rstrnt', 'sizeUnit':'', 'renderFunc':'$.ckj.renderRstrnts',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有喜欢的餐馆'
                    			 });
            		} else if(type == 'rstimg'){
                		padding = parseInt($.vv.cfg.cWidth*0.05);
                		padding = padding >= 20 ? 20 : padding;
                    	wall.attr({ 'masonry':'y', 'cols':2, 'feedRcd':'wall_rstimg', 'sizeUnit':'', 'renderFunc':'$.ckj.renderRstimgs',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有喜欢的餐馆图片'
                    			 });
            		}
            		$.feed.resetWall('#J_like_wall', true);
            	}
            	
            	if(wall.attr('masonry') == 'y') $.feed.setMasonryParams(wall); //params reset
            	
        		$.spaceLike.loadLikes($.ckj.cfg.tabResetPanel ? null : $.spaceLike.wCache[type]);
        	});
        },

        loadLikes: function(rtn) {
        	var wall = $.query('#J_like_wall'),
        	    type = wall.attr('curType'),
        	    uri  = '/?m=space&a=like&uid='+wall.attr('uid')+'&type='+type;
        	wall.attr('dataUri', uri);
        	
        	if(rtn) return;
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.spaceLike.init();
})(af);
