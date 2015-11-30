(function($){
    $.spaceRmenu = {
        cfg: {
        	panelInited:false
        },
        wCache: {},
        init: function(options) {
        	$("#space_rmenu").bind("loadpanel", function(e) {
        	    $.spaceRmenu.panelInit();
        	    
        		var params = $.query("#space_rmenu").data('params'),
        			uid = params[0], uid = uid || $.ckj.user.id, wall = $.query('#J_sprmenu_wall');

        		$.spaceRmenu.selectType();
        		
        		if(uid == $.ckj.user.id) {
                    $.query('#space_rmenu').on('click', '.wall_rmenu', function(e){
                    	e.preventDefault(); e.stopPropagation();
                		var wall = $.query('#J_sprmenu_wall');
                        var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), 
                        	did=$(this).attr('did'), cnt='';
                        //<p class="J_lopGoHash" aUrl="#rmenu_add/'+did+'">编辑菜单<i class="fa fa-angle-right"></i></p>\
                        if(!wall.attr('curType') || wall.attr('curType') == 'pub') {
                        	cnt = ' <div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_rmenu" wallId="J_sprmenu_wall">\
                        				<p data-pressed="true" class="J_lopGoHash" aUrl="#rmenu_detail/'+did+'">查看详情<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=rmenu&a=delete&id='+did+'" \
			            					tipTit="删除菜单" tipMsg="删除菜单后寻找该菜单收藏的食品会麻烦哦，确定要删除么？">删除菜单<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopCel">取消</p>\
			            			</div>';
                        } else {
                        	cnt = ' <div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_rmenu" wallId="J_sprmenu_wall">\
                        				<p data-pressed="true" class="J_lopGoHash" aUrl="#rmenu_detail/'+did+'">查看详情<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=rmenu&a=unfollow&id='+did+'" \
			            					tipTit="取消收藏" tipMsg="确定要取消收藏该菜单么？">取消收藏<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopCel">取消</p>\
			            			</div>';
                        }
                		jpop.setCnt(cnt);
                    });
                    $.ui.setTitle('我的菜单');
                    $.query('#J_sprmenu_tabs a[t="pub"]').text('我发表的');
                    $.query('#J_sprmenu_tabs a[t="followed"]').text('我收藏的');
        		} else {
            		$.query('#space_rmenu').on('click', '.wall_rmenu', function(e){
            			$.ui.loadContent('#rmenu_detail/'+$(this).attr('did'),false,false);
                    });
            		$.ui.setTitle('Ta的菜单');
                    $.query('#J_sprmenu_tabs a[t="pub"]').text('Ta发表的');
                    $.query('#J_sprmenu_tabs a[t="followed"]').text('Ta收藏的');
        		}

                if(e.data.goBack) return;
                
        		if(!$.ckj.cfg.backResetPanel && !$.ckj.cfg.backResetPanel && uid ==  wall.attr('uid') && 
        		    (wall.find('.wall_rmenu').length > 0 ||  wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y')) return;
        		    
        		$.spaceRmenu.wCache = {};
        		wall.attr('curType', '');
        		wall.attr('uid', uid);
        		$.query('#J_sprmenu_tabs a[t=pub]').trigger('click');
    		});
        	
        	$("#space_rmenu").bind("unloadpanel", function(e){
        	    if($.ckj.cfg.backResetPanel && e.data.goBack){
        	        $.feed.resetWall('#J_sprmenu_wall', true);
        	        $.spaceRmenu.wCache = {};
        	        $.query('#J_sprmenu_tabs a').removeClass('cur');
        	        $.query('#J_sprmenu_tabs a[t=pub]').addClass('cur');
        	    }
        		$.query('#space_rmenu').off('click', '.wall_rmenu');
        		$.query('#J_sprmenu_tabs').off('click', 'a');
        	});
        },
        
        panelInit: function() {
        	if( $.spaceRmenu.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_sprmenu_wall_wrap"), wall = $.query('#J_sprmenu_wall'), padding=15;
    		padding = parseInt($.vv.cfg.cWidth*0.05);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130});
        	
        	$.feed.init('#J_sprmenu_wall');
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
            
        	$.query('#space_rmenu').attr('scrollTgt', '#J_sprmenu_wall_wrap');
        	$.spaceRmenu.cfg.panelInited = true;
        },
        
        selectType: function(){
        	$.query('#J_sprmenu_tabs').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.abortQueuedAjax();
        		
        		//switch on tap
        		var $this 	= $(this),
        		    wall  = $.query('#J_sprmenu_wall'),
        		    type  = $this.attr('t');
        		    
        		$.query('#J_sprmenu_tabs a').removeClass('cur');
        		$this.addClass('cur');
        		
        		if(!$.ckj.cfg.tabResetPanel) {
            		//>>> cache the wall
            		var wallPg = $.query('#J_sprmenu_wall_pageBar'), 
            		    cType = wall.attr('curType');
            		    
            		if(cType) $.spaceRmenu.wCache[cType] = {page:wall.attr('page'), spage:wall.attr('spage'), wHtml:wall.html(), height:wall.height(),
            									scrollY: $.getCssMatrix($('#J_sprmenu_wall_wrap > div').get(0)).f,pgHtml:wallPg.html(), 
            									swpDisp:wallPg.css('display').toLowerCase(), wTops: wall.data('wTops'), 
            									isLoading:wall.attr('isLoading'), allLoaded: wall.attr('allLoaded'),
    							        		triDisp:$.query('#J_sprmenu_wall_triggerBar').css('display').toLowerCase(),
    							        		triHtml:$.query('#J_sprmenu_wall_triggerBar').html(),
    							             };
				}		
					        		
        		wall.attr('curType', type);
        		wall.attr('noDataMsg', type == 'pub'? "<i class='fa fa-smile-o'></i>还没发布过菜单" : "<i class='fa fa-smile-o'></i>还没收藏过菜单");
        		$.feed.resetWall('#J_sprmenu_wall', true); 
            	
            	if(!$.ckj.cfg.tabResetPanel) {
            		//>>> restore the wall
                	if($.spaceRmenu.wCache[type]){
                		var c = $.spaceRmenu.wCache[type], wallPg = $.query('#J_sprmenu_wall_pageBar');
                		wall.css('height', c.height + 'px').html(c.wHtml).data('wTops', c.wTops)
                			.attr({page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
                		
                		if(c.swpDisp !== 'none') wallPg.show();
                		else wallPg.hide();
                		if(c.triDisp !== 'none') $.query('#J_sprmenu_wall_triggerBar').html(c.triHtml).show();
                		else $.query('#J_sprmenu_wall_triggerBar').html(c.triHtml).hide();
                		
                		wallPg.html(c.pgHtml);
                		
                		$.query('#J_sprmenu_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
                	}
            	}
            	
        		$.spaceRmenu.loadRmenus($.ckj.cfg.tabResetPanel ? null : $.spaceRmenu.wCache[type]);
        	});
        },

        loadRmenus: function(rtn) {
        	var wall = $.query('#J_sprmenu_wall');
        	var uri = '/?m=space&a=rmenu&uid='+wall.attr('uid')+'&type='+wall.attr('curType');
        	wall.attr('dataUri', uri);
            
        	if(rtn) return;
        	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.spaceRmenu.init();
})(af);
