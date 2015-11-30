(function($){
    $.spaceFaq = {
        cfg: {
        	panelInited:false
        },
        wCache: {},
        init: function(options) {
        	$("#space_faq").bind("loadpanel", function(e) {
        	    $.spaceFaq.panelInit();
        	    
        		var params = $.query("#space_faq").data('params'),
        			uid = params[0], wall = $.query('#J_sp_faq_wall');

        		uid = uid || $.ckj.user.id;
        		$.spaceFaq.selectType();
        		
        		if(uid == $.ckj.user.id) {
                    $.query('#space_faq').on('click', '#J_sp_faq_wall > *', function(e){
                    	e.preventDefault(); e.stopPropagation();
                		var wall = $.query('#J_sp_faq_wall'), rType=$(this).attr('class'), curType = wall.attr('curType'), 
                			did=$(this).attr('did'), mod = rType == 'colans_rcd' ? 'faq_answer' : 'faq';
                		
                		if(curType != 'pubfaq' && curType != 'flwfaq' && curType != 'colans') {
                			$.ui.loadContent('#'+mod+'_detail/'+did, false, false); //>>> go to detail panel directly
                			return;
                		}
                		
                        var rname= rType == 'faq_answer' ? '答案' : '问题', cnt = '',
                        	jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true});
                        	
                        $.vv.log('rType:: '+rType+' rname:: '+rname);
                        //my published subject operation
                        if(curType == 'pubfaq') {
                        	cnt = '<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_faq" wallId="J_sp_faq_wall">\
			            				<p class="J_lopGoHash" aUrl="#faq_detail/'+did+'" data-pressed="true">查看问题<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopGoHash" aUrl="#faq_publish/'+did+'"  data-pressed="true">编辑问题<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopDoAjax" aUrl="/?m=faq&a=delete&id='+did+'" \
			            					tipTit="删除问题" tipMsg="删除问题相关答案也会被删除，确定要删除么？"  data-pressed="true">删除问题<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopCel"  data-pressed="true">取消</p>\
			            			</div>';
                        } else if (curType == 'flwfaq') {
                        	cnt = '<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_faq" wallId="J_sp_faq_wall">\
			            				<p data-pressed="true" class="J_lopGoHash" aUrl="#faq_detail/'+did+'">查看问题<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=faq&a=unfollow&id='+did+'" \
			            					tipTit="取消关注" tipMsg="确定要取消关注该问题么？">取消关注<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopCel">取消</p>\
			            			</div>';
                        } else if (curType == 'colans') {
                        	cnt = ' <div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".colans_rcd" wallId="J_sp_faq_wall">\
			            				<p data-pressed="true" class="J_lopGoHash" aUrl="#faq_answer/'+did+'">查看答案<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=faq_ans&a=uncollect&id='+did+'" \
			            					tipTit="取消收藏" tipMsg="确定要取消收藏该答案么？">取消收藏<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopCel">取消</p>\
			            			</div>';
                        }
                		jpop.setCnt(cnt);
                		
                    });
                    $.ui.setTitle('我的问答');
        		} else {
        			//somebody else home
        			$.query('#space_faq').on('click', '#J_sp_faq_wall > *', function(e){
                        var $this = $(this),
                            rType = '';
                        if($this.hasClass('wall_faq')) 
                            $.ui.loadContent('#faq_detail/'+$(this).attr('did'),false,false);
                        else if($this.hasClass('colans_rcd')) rType = 'faq_answer';
            			    $.ui.loadContent('#faq_answer/'+$(this).attr('did'),false,false);
                    });
            		$.ui.setTitle('Ta的问答');
        		}
        		
                if(e.data.goBack) return;
                if(!$.ckj.cfg.backResetPanel && uid ==  wall.attr('uid')) return;
        		
        		$.spaceFaq.wCache = {}; wall.attr('curType', ''); 
        		wall.attr('uid', uid);
        		if(uid == $.ckj.user.id) $.query('#J_sp_faq_tabs .who').text('我');
        		else $.query('#J_sp_faq_tabs .who').text('Ta');
        		
        		$('#J_sp_faq_tabs li[type="pubfaq"]').trigger('click');
    		});
    		
            $("#space_faq").bind("unloadpanel", function(e){
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_sp_faq_wall', true);
                    $.spaceFaq.wCache = {}; 
                    $.query('#J_sp_faq_tabs li').removeClass('on');
                }
                
                $.query('#space_faq').off('click', '#J_sp_faq_wall > *');
                $.query('#J_sp_faq_tabs').off('click', 'li');
            });
        },
        
        panelInit: function() {
        	if( $.spaceFaq.cfg.panelInited === true ) return;
        	
        	$.query("#J_sp_faq_tabs").scroller({ scrollBars : false,  verticalScroll : false, 
        	                                     horizontalScroll : true, hasParent:true, useJsScroll:true});
        	$.feed.init('#J_sp_faq_wall');
        	var scroller = $.query("#J_sp_faq_wall_wrap").scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"}), 
				wall     = $.query('#J_sp_faq_wall');
            
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
            
        	$.query('#space_faq').attr('scrollTgt', '#J_sp_faq_wall_wrap');
        	$.spaceFaq.cfg.panelInited = true;
        },
        
        selectType: function(){
        	$.query('#J_sp_faq_tabs').on('click', 'li', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.vv.tip({close:true});
        		$.abortQueuedAjax();
        		
        		var $this 	= $(this),
        		    wall  = $.query('#J_sp_faq_wall'), 
        		    type = $this.attr('type');
        		    
        		$.query('#J_sp_faq_tabs li').removeClass('on');
        		$this.addClass('on');
        		
        		if(!$.ckj.cfg.tabResetPanel) {
            		var wallWrap = $.query("#J_sp_faq_wall_wrap"), 
            			wallPg = $.query('#J_sp_faq_wall_pageBar'), 
            			cType = wall.attr('curType');
            		
            		//>>> cache the wall
            		if(cType) $.spaceFaq.wCache[cType] = {page:wall.attr('page'), spage:wall.attr('spage'), wHtml:wall.html(), height:wall.height(),
    								scrollY: $.getCssMatrix($('#J_sp_faq_wall_wrap > div').get(0)).f, pgHtml:wallPg.html(), 
    								swpDisp:wallPg.css('display').toLowerCase(), wTops: wall.data('wTops'), masonry:wall.attr('masonry'),
    								cols:wall.attr('cols'), 'wOffX':wall.attr('wOffX'), 'wOffY':wall.attr('wOffY'), 'wWallPad':wall.attr('wWallPad'),
    								feedRcd:wall.attr('feedRcd'), renderFunc:wall.attr('renderFunc'), delta:wall.attr('delta'), oImgWd:wall.attr('oImgWd'),
    								sizeUnit: wall.attr('sizeUnit'), 'initHeight':wall.attr('initHeight'), isLoading:wall.attr('isLoading'), 
    								allLoaded: wall.attr('allLoaded'), triDisp:$.query('#J_sp_faq_wall_triggerBar').css('display').toLowerCase(),
    								triHtml: $.query('#J_sp_faq_wall_triggerBar').html()
    				};
    		    }
    		    
    		   var tipMsg = '没有查到内容';
                if(type == 'all') tipMsg = '还没有提过问题';
                else if (type == 'pubfaq') tipMsg = '没有发表过问题';
                else if (type == 'flwfaq') tipMsg = '没有关注过问题';
                else if (type == 'ansfaq') tipMsg = '没有回答过问题';
                else if (type == 'atfaq') tipMsg = '没有邀请我回答的问题';
                else if (type == 'colans') tipMsg = '没有收藏过答案';
                
        		wall.attr({'curType':type, 'noDataMsg':tipMsg});

        		//>>> restore the wall
        		if(!$.ckj.cfg.tabResetPanel && $.spaceFaq.wCache[type]){
            		var c = $.spaceFaq.wCache[type], wallPg = $.query('#J_sp_faq_wall_pageBar');
            		
            		wall.attr({ masonry:c.masonry, cols:c.cols, wOffX:c.wOffX, wOffY:c.wOffY, wWallPad:c.wWallPad, 
            					initHeight:c.initHeight, sizeUnit:c.sizeUnit, feedRcd:c.feedRcd, renderFunc:c.renderFunc,
            					delta:c.delta, oImgWd:c.oImgWd
            			});
            		
            		$.feed.resetWall('#J_sp_faq_wall', true);
            		
            		wall.attr({ page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
            		wall.css('height', c.height + 'px').html(c.wHtml).data('wTops', c.wTops);
            		
            		if(c.swpDisp !== 'none') wallPg.show();
            		else wallPg.hide();
            		if(c.triDisp !== 'none') $.query('#J_sp_faq_wall_triggerBar').html(c.triHtml).show();
            		else $.query('#J_sp_faq_wall_triggerBar').html(c.triHtml).hide();
            		
            		wallPg.html(c.pgHtml);
            		$.query('#J_sp_faq_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
            	} 
            	
                if($.ckj.cfg.tabResetPanel || !$.spaceFaq.wCache[type]){
            		var padding=0;
            		if(type == 'pubfaq' || type == 'flwfaq' || type == 'ansfaq' || type == 'atfaq'){
                		padding = 0;
                    	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_faq', 'sizeUnit':'', 'renderFunc':'$.ckj.renderFaqs',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130,
                    				'delta':'n'
                    			 });
            		} else if(type == 'colans') {
            			padding = 0;
                    	wall.attr({ 'masonry':'y', 'cols':'1', 'feedRcd':'colans_rcd', 'sizeUnit':'', 'renderFunc':'$.spaceFaq.renderCollans',
                    				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130, 
                    				'delta':'n'
                    			 });
            		} 
            		
            		$.feed.resetWall('#J_sp_faq_wall', true);
            	}
            	
            	if(wall.attr('masonry') == 'y') $.feed.setMasonryParams(wall); //params reset
            	
        		$.spaceFaq.loadFaqans($.ckj.cfg.tabResetPanel ? null : $.spaceFaq.wCache[type]);
        	});
        },

        loadFaqans: function(rtn) {
        	var wall = $.query('#J_sp_faq_wall'),
        	    type = wall.attr('curType'),
        	    uri = '/?m=spcfaq&a=index&uid='+wall.attr('uid')+'&type='+type;
        	wall.attr('dataUri', uri);
        	
        	if(rtn) return;
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        
        renderCollans: function(data){
        	var html = '', curDiv = $.ui.activeDiv.id;
        	if(data.rlist.length > 0) {
        		$.each(data.rlist, function(idx, a) {
        			html +='<li  '+(curDiv != 'space_faq'? '' : 'did="'+a.id+'"')+' class="colans_rcd">\
		        				<div class="ftitle">'+a.ftitle+'</div>\
		        				<div class="acnt"><i class="fa fa-key"></i>'+$.vv.util.equalSubStr(a.info.strip_tags(), 36)+'</div>'+
		        				(curDiv != 'space_faq'? '<a href="#faq_answer/'+a.id+'" class="go"></a>' : '')+
		        			'</li>';
        		});
        	}
        	return html;
        }
    };
    $.spaceFaq.init();
})(af);
