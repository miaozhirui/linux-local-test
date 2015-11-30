(function($){
    $.spaceShare = {
        cfg: {
        	panelInited:false
        },
        wCache: {},
        init: function(options) {
        	$("#space_share").bind("loadpanel", function(e) {
        	    $.spaceShare.panelInit();
        	    
        		var params = $.query("#space_share").data('params'),
        			uid = params[0], wall = $.query('#J_share_wall');
        		uid = uid || $.ckj.user.id;
        		
        		$.spaceShare.selectType();
        		if(uid == $.ckj.user.id) {
                    $.query('#space_share').on('click', '#J_share_wall > *', function(e){
                    	e.preventDefault(); e.stopPropagation();
                		var wall = $.query('#J_share_wall'), eHtml = '';
                        var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), 
                        	did=$(this).attr('did'), cnt='', rType=$(this).attr('class').replace('wall_', ''), rname = $.ckj.rcdMap[rType];
                        $.vv.log('rType:: '+rType+' rname:: '+rname);
                        if(rType == 'recipe' || rType == 'rstrnt' ) {
                            eHtml = '<p class="J_lopGoHash" aUrl="#'+rType+'_share/'+did+'" data-pressed="true">编辑'+rname+'<i class="fa fa-angle-right"></i></p>';
                        }
                		jpop.setCnt('<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_'+rType+'" wallId="J_share_wall">\
		                				<p class="J_lopGoHash" aUrl="#'+rType+'_detail/'+did+'" data-pressed="true">查看详情<i class="fa fa-angle-right"></i></p>'+
		                				eHtml + '\
			            				<p class="J_lopDoAjax" aUrl="/?m='+rType+'&a=delete&id='+did+'" \
			            					tipTit="删除'+rname+'" tipMsg="确定删除该'+rname+'么？" data-pressed="true">删除'+rname+'<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopCel" data-pressed="true">取消</p>\
			            			</div>');
                    });
                    $.ui.setTitle('我的分享');
        		} else {
        			$.query('#space_share').on('click', '#J_share_wall > *', function(e){
        			    var rType=$(this).attr('class').replace('wall_', '');
            			$.ui.loadContent('#'+rType+'_detail/'+$(this).attr('did'),false,false);
                    });
            		$.ui.setTitle('Ta的分享');
        		}
        		
        		if(e.data.goBack) return;
                if(!$.ckj.cfg.backResetPanel && uid ==  wall.attr('uid')) return;
                
        		$.spaceShare.wCache = {}; wall.attr('curType', '');
        		
        		wall.attr('uid', uid);
        		$.query('#J_share_tabs li[type=recipe]').trigger('click');
    		});
        	
        	$("#space_share").bind("unloadpanel", function(e){
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_share_wall', true);
                    $.spaceShare.wCache = {}; 
                    $.query('#J_share_tabs li').removeClass('on');
                    $.query('#J_share_tabs li[type=recipe]').addClass('on');
                }
                
        		$.query('#space_share').off('click', '#J_share_wall > *');
        		$.query('#J_share_tabs').off('click', 'li');
        	});
        },
        
        panelInit: function() {
        	if( $.spaceShare.cfg.panelInited === true ) return;
        	
        	$.query("#J_share_tabs").scroller({ scrollBars : false,  verticalScroll : false,  
        	                                    horizontalScroll : true, hasParent:true, useJsScroll:true});
        	
        	$.feed.init('#J_share_wall');
        	
        	var scroller = $.query("#J_share_wall_wrap").scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"}),
        	    wall   = $.query('#J_share_wall');
            
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

        	$.query('#space_share').attr('scrollTgt', '#J_share_wall_wrap');
        	$.spaceShare.cfg.panelInited = true;
        },
        
        selectType: function(){
        	$.query('#J_share_tabs').on('click', 'li', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.vv.tip({close:true});
        		$.abortQueuedAjax();
        		
        		var $this 	= $(this),
        		    wall  = $.query('#J_share_wall'), 
        		    type = $this.attr('type');
        		    
        		$.query('#J_share_tabs li').removeClass('on');
        		$this.addClass('on');
        		
        		if(!$.ckj.cfg.tabResetPanel) {
            		var wallWrap = $.query("#J_share_wall_wrap"), 
            			wallPg   = $.query('#J_share_wall_pageBar'), 
            			cType    = wall.attr('curType');
            		
            		//>>> cache the wall
            		if(cType)$.spaceShare.wCache[cType] = {page:wall.attr('page'), spage:wall.attr('spage'), wHtml:wall.html(), height:wall.height(),
    								scrollY: $.getCssMatrix($('#J_share_wall_wrap > div').get(0)).f, pgHtml:wallPg.html(), 
    								swpDisp:wallPg.css('display').toLowerCase(), wTops: wall.data('wTops'), masonry:wall.attr('masonry'),
    								cols:wall.attr('cols'), 'wOffX':wall.attr('wOffX'), 'wOffY':wall.attr('wOffY'), 'wWallPad':wall.attr('wWallPad'),
    								feedRcd:wall.attr('feedRcd'), renderFunc:wall.attr('renderFunc'), delta:wall.attr('delta'), oImgWd:wall.attr('oImgWd'),
    								sizeUnit: wall.attr('sizeUnit'), 'initHeight':wall.attr('initHeight'), isLoading:wall.attr('isLoading'), 
    								allLoaded: wall.attr('allLoaded'), triDisp:$.query('#J_share_wall_triggerBar').css('display').toLowerCase(),
    								triHtml:$.query('#J_share_wall_triggerBar').html()
    				};
    				if(cType == 'work') $.spaceShare.wCache[cType].padding = wall.css('padding');
				}

        		wall.attr('curType', type);
        		if(type == 'recipe') wall.addClass('list_wall');
        		else wall.removeClass('list_wall');

        		//>>> restore the wall
            	if(!$.ckj.cfg.tabResetPanel && $.spaceShare.wCache[type]){
            		var c = $.spaceShare.wCache[type], wallPg = $.query('#J_share_wall_pageBar');
            		
            		wall.attr({ masonry:c.masonry, cols:c.cols, wOffX:c.wOffX, wOffY:c.wOffY, wWallPad:c.wWallPad, 
            					initHeight:c.initHeight, sizeUnit:c.sizeUnit, feedRcd:c.feedRcd, renderFunc:c.renderFunc,
            					delta:c.delta, oImgWd:c.oImgWd
            			});
            		
            		$.feed.resetWall('#J_share_wall', true);
            		
            		wall.attr({ page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
            		wall.css('height', c.height + 'px').html(c.wHtml).data('wTops', c.wTops);
            		
            		if(type == 'work') wall.css('padding', c.padding);
            		
            		if(c.swpDisp !== 'none') wallPg.show();
            		else wallPg.hide();
            		if(c.triDisp !== 'none') $.query('#J_share_wall_triggerBar').html(c.triHtml).show();
            		else $.query('#J_share_wall_triggerBar').html(c.triHtml).hide();
            		
            		wallPg.html(c.pgHtml);
            		
            		$.query('#J_share_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
            	} 
            	
                if($.ckj.cfg.tabResetPanel || !$.spaceShare.wCache[type]){
            		var padding=0;
            		if(type == 'recipe'){
                		padding = 0;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_recipe', 'sizeUnit':'', 'renderFunc':'$.ckj.renderRecipes',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有分享过菜谱'
                    			 });
            		}  else if(type == 'work'){
            			var paddingLR = ($.vv.cfg.cWidth * 0.14) / 2;
                    	paddingLR = paddingLR >= 30 ? 30 : paddingLR;
                    	wall.attr({ 'masonry':'n', 'cols':1, 'feedRcd':'wall_work', 'sizeUnit':'', 'renderFunc':'$.ckj.renderWorks',
                    				'oImgWd':'', 'wOffX': '', 'wOffY': '', 'wWallPad': '', 'initHeight':$.vv.cfg.cHeight-130, 'delta':'n',
                    				'noDataMsg':'<i class="fa fa-smile-o"></i>还没有分享过作品'
                    			 }).css('padding', paddingLR+'px '+paddingLR+'px 10px '+paddingLR+'px');
            		} else if(type == 'item') {
                		padding = parseInt($.vv.cfg.cWidth*0.04);
                		padding = padding >= 20 ? 20 : padding;
                    	wall.attr({ 'masonry':'y', 'cols':2, 'feedRcd':'wall_item', 'sizeUnit':'.pic', 'renderFunc':'$.ckj.renderItems',
                    				'oImgWd':210, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'y', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有分享过食品'
                    			 });
            		} else if(type == 'rstrnt'){
                		padding = 0;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_rstrnt', 'sizeUnit':'', 'renderFunc':'$.ckj.renderRstrnts',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有分享过餐馆'
                    			 });
            		} else if(type == 'rstimg'){
                		padding = parseInt($.vv.cfg.cWidth*0.05);
                		padding = padding >= 20 ? 20 : padding;
                    	wall.attr({ 'masonry':'y', 'cols':2, 'feedRcd':'wall_rstimg', 'sizeUnit':'', 'renderFunc':'$.ckj.renderRstimgs',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n', 'noDataMsg':'<i class="fa fa-smile-o"></i>还没有分享过餐馆附图'
                    			 });
            		}
            		
            		$.feed.resetWall('#J_share_wall', true);
            	}
            	
            	if(wall.attr('masonry') == 'y') $.feed.setMasonryParams(wall); //params reset
            	
        		$.spaceShare.loadShares($.ckj.cfg.tabResetPanel ? null : $.spaceShare.wCache[type]);
        	});
        },

        loadShares: function(rtn) {
        	var wall   = $.query('#J_share_wall'),
        	    type   = wall.attr('curType'), 
        	    uri    = '/?m=space&a=share&uid='+wall.attr('uid')+'&type='+type;
        	wall.attr('dataUri', uri);
                	
        	if(rtn) return;
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.spaceShare.init();
})(af);
