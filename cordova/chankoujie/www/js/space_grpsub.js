(function($){
    $.spaceGrpsub = {
        cfg: {
        	panelInited:false
        },
        wCache: {},
        init: function(options) {
        	$("#space_grpsub").bind("loadpanel", function(e) {
        		var params = $.query("#space_grpsub").data('params'),
        			uid = params[0], wall = $.query('#J_sp_grpsub_wall');

        		uid = uid || $.ckj.user.id;
        		$.spaceGrpsub.selectType();
        		
        		if(uid == $.ckj.user.id) {
                    $.query('#space_grpsub').on('click', '#J_sp_grpsub_wall > *', function(e){
                    	e.preventDefault(); e.stopPropagation();
                		var wall = $.query('#J_sp_grpsub_wall'), rType=$(this).attr('class'), curType = wall.attr('curType'), 
                			did=$(this).attr('did'), mod = rType == 'subject_rcd' ? 'subject' : 'group';
                		
                		if(curType != 'mypub') {
                			$.ui.loadContent('#'+mod+'_detail/'+did, false, false); //>>> go to detail panel directly
                			return;
                		}
                		
                        var rname= rType == 'subject_rcd' ? '群主题' : '吃群',
                        	jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true});
                        	
                        $.vv.log('rType:: '+rType+' rname:: '+rname);
                        //my published subject operation
                		jpop.setCnt('<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".subject_rcd" wallId="J_sp_grpsub_wall">\
		                				<p class="J_lopGoHash" aUrl="#subject_detail/'+did+'" data-pressed="true">阅读主题<i class="fa fa-angle-right"></i></p>\
		                				<p class="J_lopGoHash" aUrl="#subject_share/sid/'+did+'" data-pressed="true">编辑主题<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopDoAjax" aUrl="/?m=subject&a=delete&id='+did+'" \
			            					tipTit="删除主题" tipMsg="确定要删除该主题么？">删除主题<i class="fa fa-angle-right" data-pressed="true"></i></p>\
			            				<p class="J_lopCel" data-pressed="true">取消</p>\
			            			</div>');
                		
                    });
                    $.ui.setTitle('我的吃群');
        		} else {
        			//somebody else home
        			$.query('#space_grpsub').on('click', '#J_sp_grpsub_wall > *', function(e){
        			    var rType=$(this).attr('class');
        			    if(rType == 'subject_rcd') rType = 'subject';
        			    else if(rType == 'sgroup_rcd') rType = 'group';
        			    
            			$.ui.loadContent('#'+rType+'_detail/'+$(this).attr('did'),false,false);
                    });
            		$.ui.setTitle('Ta的吃群');
        		}
        		
        		if(e.data.goBack) return;
                if(!$.ckj.cfg.backResetPanel && uid ==  wall.attr('uid')) return;
        		
        		$.spaceGrpsub.wCache = {};
        		wall.attr('curType', '');
        		$.spaceGrpsub.panelInit();
        		wall.attr('uid', uid);
        		if(uid == $.ckj.user.id) {
        			$.query('#J_sp_grpsub_tabs .who').text('我');
        			$('#J_sp_grpsub_tabs li[type=all]').show();
        			$('#J_sp_grpsub_tabs li[type=all]').trigger('click');
        		} else {
        			$.query('#J_sp_grpsub_tabs .who').text('Ta');
        			$('#J_sp_grpsub_tabs li[type=all]').hide();
        			$('#J_sp_grpsub_tabs li[type=mypub]').show();
        			$('#J_sp_grpsub_tabs li[type=mypub]').trigger('click');
        		}
    		});
    		
            $("#space_grpsub").bind("unloadpanel", function(e){
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_sp_grpsub_wall', true);
                    $.spaceGrpsub.wCache = {}; 
                    $.query('#J_sp_grpsub_tabs li').removeClass('on');
                }
                
                $.query('#space_grpsub').off('click', '#J_sp_grpsub_wall > *');
                $.query('#J_sp_grpsub_tabs').off('click', 'li');
            });
        },
        
        panelInit: function() {
        	if( $.spaceGrpsub.cfg.panelInited === true ) return;
        	
        	$.query("#J_sp_grpsub_tabs").scroller({ scrollBars : false,  verticalScroll : false,  
        	                                        horizontalScroll : true, hasParent:true, useJsScroll:true});
        	
        	$.feed.init('#J_sp_grpsub_wall');
        	
        	var scroller = $.query("#J_sp_grpsub_wall_wrap").scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"}),
        	    wall   = $.query('#J_sp_grpsub_wall');
            
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
            
        	$.query('#space_grpsub').attr('scrollTgt', '#J_sp_grpsub_wall_wrap');
        	$.spaceGrpsub.cfg.panelInited = true;
        },
        
        selectType: function(){
        	$.query('#J_sp_grpsub_tabs').on('click', 'li', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.vv.tip({close:true});
        		$.abortQueuedAjax();
        		
        		var $this = $(this),
        		    wall  = $.query('#J_sp_grpsub_wall'), 
        		    type  = $this.attr('type');
        		    
        		$.query('#J_sp_grpsub_tabs li').removeClass('on');
        		$this.addClass('on');
        		
        		if(!$.ckj.cfg.tabResetPanel) {
            		var wallWrap = $.query("#J_sp_grpsub_wall_wrap"), 
            			wallPg = $.query('#J_sp_grpsub_wall_pageBar'), 
            			cType = wall.attr('curType');
            		
            		//>>> cache the wall
            		if(cType) $.spaceGrpsub.wCache[cType] = {
            		                page:wall.attr('page'), spage:wall.attr('spage'), wHtml:wall.html(), height:wall.height(),
    								scrollY: $.getCssMatrix($('#J_sp_grpsub_wall_wrap > div').get(0)).f, pgHtml:wallPg.html(), 
    								swpDisp:wallPg.css('display').toLowerCase(), wTops: wall.data('wTops'), masonry:wall.attr('masonry'),
    								cols:wall.attr('cols'), 'wOffX':wall.attr('wOffX'), 'wOffY':wall.attr('wOffY'), 'wWallPad':wall.attr('wWallPad'),
    								feedRcd:wall.attr('feedRcd'), renderFunc:wall.attr('renderFunc'), delta:wall.attr('delta'), oImgWd:wall.attr('oImgWd'),
    								sizeUnit: wall.attr('sizeUnit'), 'initHeight':wall.attr('initHeight'), isLoading:wall.attr('isLoading'), 
    								allLoaded: wall.attr('allLoaded'), triDisp:$.query('#J_sp_grpsub_wall_triggerBar').css('display').toLowerCase(),
    								triHtml: $.query('#J_sp_grpsub_wall_triggerBar').html()
    				};
            		if(type == 'owngrp' || type == 'joingrp') $.spaceGrpsub.wCache[cType].padding = wall.css('padding');
        		}

                var tipMsg = '暂无动态';
                if (type == 'mypub') tipMsg = '还没有发表过群主题';
                else if (type == 'reply') tipMsg = '还没有回应过群主题';
                else if (type == 'collect') tipMsg = '还没有收藏过群主题';
                else if (type == 'owngrp') tipMsg = '还没有管理吃群';
                else if (type == 'joingrp') tipMsg = '还没有加入过吃群';
                
                wall.attr({'curType':type, 'noDataMsg':tipMsg});

        		//>>> restore the wall
        		if(!$.ckj.cfg.tabResetPanel && $.spaceGrpsub.wCache[type]){
            		var c = $.spaceGrpsub.wCache[type], wallPg = $.query('#J_sp_grpsub_wall_pageBar');
            		
            		wall.attr({ masonry:c.masonry, cols:c.cols, wOffX:c.wOffX, wOffY:c.wOffY, wWallPad:c.wWallPad, 
            					initHeight:c.initHeight, sizeUnit:c.sizeUnit, feedRcd:c.feedRcd, renderFunc:c.renderFunc,
            					delta:c.delta, oImgWd:c.oImgWd
            			});
            		
            		$.feed.resetWall('#J_sp_grpsub_wall', true);
            		
            		wall.attr({ page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
            		wall.css('height', c.height + 'px').html(c.wHtml).data('wTops', c.wTops);
            		
            		if(type == 'owngrp' || type == 'joingrp') wall.css('padding', c.padding);
            		
            		if(c.swpDisp !== 'none') wallPg.show();
            		else wallPg.hide();
            		if(c.triDisp !== 'none') $.query('#J_sp_grpsub_wall_triggerBar').html(c.triHtml).show();
            		else $.query('#J_sp_grpsub_wall_triggerBar').html(c.triHtml).hide();
            		
            		wallPg.html(c.pgHtml);
            		
            		$.query('#J_sp_grpsub_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
            	} 
            	
            	if($.ckj.cfg.tabResetPanel || !$.spaceGrpsub.wCache[type]){
            		var padding=0;
            		if(type == 'all' || type == 'mypub' || type == 'reply' || type == 'collect'){
                		padding = 0;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'subject_rcd', 'sizeUnit':'', 'renderFunc':'$.ckj.renderSubjects',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n'
                    			 });
            		} else if(type == 'owngrp' || type == 'joingrp') {
                    	wall.attr({ 'masonry':'n', 'cols':'', 'feedRcd':'sgroup_rcd', 'sizeUnit':'', 'renderFunc':'$.ckj.renderSgroups',
                    				'oImgWd':'', 'wOffX': '', 'wOffY': '', 'wWallPad': '', 'initHeight':$.vv.cfg.cHeight-130, 'delta':'n'
                    			 }).css('padding', '15px');
            		} 
            		
            		$.feed.resetWall('#J_sp_grpsub_wall', true);
            	}
            	
            	if(wall.attr('masonry') == 'y') $.feed.setMasonryParams(wall); //params reset
            	
        		$.spaceGrpsub.loadGrpsubs($.ckj.cfg.tabResetPanel ? null : $.spaceGrpsub.wCache[type]);
        	});
        },

        loadGrpsubs: function(rtn) {
        	var wall = $.query('#J_sp_grpsub_wall'), 
        	    type = wall.attr('curType'),
        	    uri = '/?m=spacegr&a=index&uid='+wall.attr('uid')+'&type='+type;
        	wall.attr('dataUri', uri);

        	if(rtn) return;
        	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.spaceGrpsub.init();
})(af);