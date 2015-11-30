(function($){
    $.spaceAlbum = {
        cfg: {
        	panelInited:false
        },
        wCache: {},
        init: function(options) {
        	$("#space_album").bind("loadpanel", function(e) {
        	    $.spaceAlbum.panelInit();
        	    
        		var params = $.query("#space_album").data('params'),
        			uid = params[0], 
        			uid = uid || $.ckj.user.id, 
        			wall = $.query('#J_spalbum_wall');
        		
        		$.spaceAlbum.selectType();
        		
        		if(uid == $.ckj.user.id) {
                    $.query('#space_album').on('click', '.wall_album', function(e){
                    	e.preventDefault(); e.stopPropagation();
                		var wall = $.query('#J_spalbum_wall');
                        var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), 
                        	did=$(this).attr('did'), cnt='';
                        //<p class="J_lopGoHash" aUrl="#album_add/'+did+'">编辑吃柜<i class="fa fa-angle-right"></i></p>\
                        if(!wall.attr('curType') || wall.attr('curType') == 'pub') {
                        	cnt = '<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_album" wallId="J_spalbum_wall">\
                        				<p data-pressed="true" class="J_lopGoHash" aUrl="#album_detail/'+did+'" >查看详情<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=album&a=delete&id='+did+'" \
			            					tipTit="删除吃柜" tipMsg="删除吃柜后寻找该吃柜收藏的食品会麻烦哦，确定要删除么？">删除吃柜<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopCel">取消</p>\
			            			</div>';
                        } else {
                        	cnt = '<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_album" wallId="J_spalbum_wall">\
                        				<p data-pressed="true" class="J_lopGoHash" aUrl="#album_detail/'+did+'">查看详情<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=album&a=unfollow&id='+did+'" \
			            					tipTit="取消收藏" tipMsg="确定要取消收藏该吃柜么？">取消收藏<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopCel">取消</p>\
			            			</div>';
                        }
                		jpop.setCnt(cnt);
                    });
                    $.ui.setTitle('我的吃柜');
                    $.query('#J_spalbum_tabs a[t="pub"]').text('我发表的');
                    $.query('#J_spalbum_tabs a[t="followed"]').text('我收藏的');
        		} else {
            		$.query('#space_album').on('click', '.wall_album', function(e){
            			$.ui.loadContent('#album_detail/'+$(this).attr('did'),false,false);
                    });
            		$.ui.setTitle('Ta的吃柜');
                    $.query('#J_spalbum_tabs a[t="pub"]').text('Ta发表的');
                    $.query('#J_spalbum_tabs a[t="followed"]').text('Ta收藏的');
        		}
        		
        		if(e.data.goBack) return;
        		if(!$.ckj.cfg.backResetPanel && uid ==  wall.attr('uid') && 
                    (wall.find('.wall_album').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y')) return;
                    
        		$.spaceAlbum.wCache = {}; 
        		wall.attr('curType', '');

        		wall.attr('uid', uid);
        		$.query('#J_spalbum_tabs a[t=pub]').trigger('click');
    		});
        	
        	$("#space_album").bind("unloadpanel", function(e){
                if($.ckj.cfg.backResetPanel && e.data.goBack){
                    $.feed.resetWall('#J_spalbum_wall', true);
                    $.spaceAlbum.wCache = {}; 
                    $.query('#J_spalbum_tabs a').removeClass('cur');
                    $.query('#J_spalbum_tabs a[t=pub]').addClass('cur');
                }
                
        		$.query('#space_album').off('click', '.wall_album');
        		$.query('#J_spalbum_tabs').off('click', 'a');
        	});
        },
        
        panelInit: function() {
        	if( $.spaceAlbum.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_spalbum_wall_wrap"), wall = $.query('#J_spalbum_wall'), padding=15;
    		padding = parseInt($.vv.cfg.cWidth*0.05);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130});
        	
        	$.feed.init('#J_spalbum_wall');
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
        	
        	$.query('#space_album').attr('scrollTgt', '#J_spalbum_wall_wrap');
        	$.spaceAlbum.cfg.panelInited = true;
        },
        
        selectType: function(){
        	$.query('#J_spalbum_tabs').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.vv.tip({close:true});
        		$.abortQueuedAjax(); //must use this or the previous trigger bar may not work anymore
        		
        		//switch on tap
        		var $this 	= $(this),
        		    wall  = $.query('#J_spalbum_wall'), 
        		    type  = $this.attr('t');
        		$.query('#J_spalbum_tabs a').removeClass('cur');
        		$this.addClass('cur');

                if(!$.ckj.cfg.tabResetPanel) {        		
            		//>>> cache the wall
            		var wallPg = $.query('#J_spalbum_wall_pageBar'),
            			cType = wall.attr('curType');
            		
            		if(cType) $.spaceAlbum.wCache[cType] = {
            		                            page:wall.attr('page'), 
            		                            spage:wall.attr('spage'), 
            		                            wHtml:wall.html(), 
            		                            height:wall.height(),
            									scrollY: $.getCssMatrix($('#J_spalbum_wall_wrap > div').get(0)).f,
            									pgHtml:wallPg.html(), 
            									swpDisp:wallPg.css('display').toLowerCase(), wTops: wall.data('wTops'), 
            									isLoading:wall.attr('isLoading'), allLoaded: wall.attr('allLoaded'),
    							        		triDisp:$.query('#J_spalbum_wall_triggerBar').css('display').toLowerCase(),
    							        		triHtml:$.query('#J_spalbum_wall_triggerBar').html()
    							      };
                }
                
                wall.attr('curType', type);
                wall.attr('noDataMsg', type == 'pub'? "<i class='fa fa-smile-o'></i>还没发布过吃柜" : "<i class='fa fa-smile-o'></i>还没收藏过吃柜");
        		$.feed.resetWall('#J_spalbum_wall', true);
            	
            	if(!$.ckj.cfg.tabResetPanel) {
                    //>>> restore the wall
                    if($.spaceAlbum.wCache[type]){
                        var c = $.spaceAlbum.wCache[type], wallPg = $.query('#J_spalbum_wall_pageBar');
                        wall.css('height', c.height + 'px').html(c.wHtml).data('wTops', c.wTops)
                            .attr({page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
                        
                        if(c.swpDisp !== 'none') wallPg.show();
                        else wallPg.hide();
                        if(c.triDisp !== 'none') $.query('#J_spalbum_wall_triggerBar').html(c.triHtml).show();
                        else $.query('#J_spalbum_wall_triggerBar').html(c.triHtml).hide();
                        
                        wallPg.html(c.pgHtml);
                        
                        $.query('#J_spalbum_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
                    } 
            	}

        		$.spaceAlbum.loadAlbums($.ckj.cfg.tabResetPanel ? null : $.spaceAlbum.wCache[type]);
        	});
        },

        loadAlbums: function(rtn) {
        	var wall = $.query('#J_spalbum_wall');
        	var uri = '/?m=space&a=album&uid='+wall.attr('uid')+'&type='+wall.attr('curType');
        	wall.attr('dataUri', uri);
            
        	if(rtn) return;
        	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.spaceAlbum.init();
})(af);