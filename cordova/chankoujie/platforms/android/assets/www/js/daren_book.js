(function($) {
    $.darenBook = {
        cfg: {
        	panelInited:false
        },
        wCache: {},
        wallData: {
        	wallRcds:[]
        },
        
        init: function(options) {
        	$("#daren_book").bind("loadpanel",function(e) {
        	    $.darenBook.panelInit();
        		if(e.data.goBack) {
        			$.ckj.showHideWallRcds($.darenBook.wallData.wallRcds, '#J_daren_wall');
        			return;
        		};
        		
        		$.feed.resetWall('#J_daren_wall', true);
        		$.query('#J_dr_tabs li[type="item"]').trigger('click');
    		});
        	
        	$.query("#daren_book").bind('unloadpanel', function(e){
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_daren_wall', true);
                    $.darenBook.wCache = {}; 
                    wall.attr({'curType':''});
                    $.query('#J_dr_tabs li').removeClass('on');
                } else {
                    $.ckj.hideWallRcds($.darenBook.wallData.wallRcds, Math.abs($.query('#J_daren_wall_wrap').scroller().scrollTop));
                }
    		});
        },
        
        panelInit:function() {
        	if($.darenBook.cfg.panelInited === true)return;
            $.query("#J_dr_tabs").scroller({scrollBars:false, verticalScroll:false, horizontalScroll:true, hasParent:true, useJsScroll:true});
            
        	var wallWrap = $.query("#J_daren_wall_wrap"), wall = $.query('#J_daren_wall'), padding=15;
    		padding = parseInt($.vv.cfg.cWidth*0.05);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'curType':'', 'feedRcd':'', 'cols':2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130});
            
        	$.feed.init('#J_daren_wall');
        	var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar"});
            
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
        	
        	$.darenBook.selectType();
        	$.darenBook.cfg.panelInited = true;
        },
        
        selectType: function(){
        	$.query('#J_dr_tabs').on('click', 'li', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.abortQueuedAjax();
        		
        		//switch on tap
        		var $this 	= $(this),
        		    wall  = $.query('#J_daren_wall'), 
        		    type  = $this.attr('type');
        		    
        		$.query('#J_dr_tabs li').removeClass('on');
        		$this.addClass('on');
        		
        		if(!$.ckj.cfg.tabResetPanel) {
            		var wallPg = $.query('#J_daren_wall_pageBar'),
            			cType = wall.attr('curType');
            		if(type == cType) return;
            		
            		//>>> cache the wall
            		$.darenBook.wCache[cType] = {page:wall.attr('page'), spage:wall.attr('spage'), wHtml:wall.html(), height:wall.height(),
                									scrollY: $.getCssMatrix($('#J_daren_wall_wrap > div').get(0)).f,pgHtml:wallPg.html(), 
                									swpDisp:wallPg.css('display').toLowerCase(), wTops: wall.data('wTops'), 
                									isLoading:wall.attr('isLoading'), allLoaded: wall.attr('allLoaded'),
        							        		triDisp:$.query('#J_daren_wall_triggerBar').css('display').toLowerCase(),
        							        		triHtml:$.query('#J_daren_wall_triggerBar').html()
        							             };
                }
                
        		wall.attr('curType', type);
        		$.feed.resetWall('#J_daren_wall', true);
            	
            	
        		//>>> restore the wall
            	if(!$.ckj.cfg.tabResetPanel && $.darenBook.wCache[type]){
            		var c = $.darenBook.wCache[type], wallPg = $.query('#J_daren_wall_pageBar');
            		wall.css('height', c.height + 'px').html(c.wHtml).data('wTops', c.wTops)
            			.attr({page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
            		
            		if(c.swpDisp !== 'none') wallPg.show();
            		else wallPg.hide();
            		if(c.triDisp !== 'none') $.query('#J_daren_wall_triggerBar').html(c.triHtml).show();
            		else $.query('#J_daren_wall_triggerBar').html(c.triHtml).hide();
            		
            		wallPg.html(c.pgHtml);
            		
            		$.query('#J_daren_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
            	}
            	
        		$.darenBook.loadDarens($.ckj.cfg.tabResetPanel ? null : $.darenBook.wCache[type]);
        	});
        },
        
        loadDarens: function(rtn) {
        	var wall = $.query('#J_daren_wall'), cType = wall.attr('curType');
        	var uri = '/?m=daren&a=book&t='+cType;
        	wall.attr('dataUri', uri);
        	if(rtn) return;
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        
        renderDaren: function(data, wall){
        	var html   = '';
        	
        	if(data.rlist.length > 0){
        		var type = wall.attr('curType'), rW = wall.attr('wRcdWd'), maxW = rW*1, bhtml='';
        		//$.vv.log('curType::'+type);
				$.each(data.rlist, function(idx, d){
    				bhtml = '';
    				if(type == 'recipe'){
    					bhtml = '<div class="f-f f-vc">\
    								<p class="f-al"><i>菜谱:</i>'+d.recipes+'</p>\
    								<p class="f-al"><i>作品:</i>'+d.works+'</p>\
    							</div>';
    				}else if(type == 'item'){
    					bhtml = '<div class="f-f f-vc">\
							<p class="f-al"><i>食品:</i>'+d.items+'</p>\
							<p class="f-al"><i>吃柜:</i>'+d.albums+'</p>\
						</div>';
    				}else if(type == 'rstrnt'){
    					bhtml = '<div class="f-f f-vc">\
							<p class="f-al"><i>餐馆:</i>'+d.rstrnts+'</p>\
							<p class="f-al"><i>附图:</i>'+d.rstimgs+'</p>\
						</div>';
    				}else if(type == 'group'){
    					bhtml = '<div class="f-f f-vc">\
							<p class="f-al"><i>吃群:</i>'+d.groups+'</p>\
							<p class="f-al"><i>主题:</i>'+d.subjects+'</p>\
						</div>';
    				}else if(type == 'faq'){
    					bhtml = '<div class="f-f f-vc">\
							<p class="f-al"><i>提问:</i>'+d.faqs+'</p>\
							<p class="f-al"><i>回答:</i>'+d.afaqs+'</p>\
						</div>';
    				}else if(type == 'diary'){
    					bhtml = '<div class="f-f f-vc">\
							<p class="f-al"><i>日记:</i>'+d.diarys+'</p>\
							<p class="f-al"><i>粉丝:</i>'+d.fans+'</p>\
						</div>';
    				}
    				
    				html += '<a href="#space_index/'+d.id+'" class="wall_daren">\
    							<p class="pwr" style="width:'+rW+'px; height:'+rW+'px;">\
    								<img src="'+d.avatar+'" onload="$.ckj.onImgLoad(this);" onerror="$.ckj.onImgError(this);" />\
    							</p>'
    							+bhtml+'\
					        </a>';
				});
        	} 
        	return html;
        },
    };
    
    $.darenBook.init();
})(af);
