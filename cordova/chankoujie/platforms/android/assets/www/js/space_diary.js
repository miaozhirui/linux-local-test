(function($){
    $.spaceDiary = {
        cfg: {
        	panelInited:false
        },
        wCache: {},
        init: function(options) {
        	$("#space_diary").bind("loadpanel", function(e) {
        	    $.spaceDiary.panelInit();
        	    
        		var params = $.query("#space_diary").data('params'),
        			uid = params[0], wall = $.query('#J_sp_diary_wall');
        		uid = uid || $.ckj.user.id;
        		$.spaceDiary.selectType();
        		
           		if(uid == $.ckj.user.id) {
                    $.query('#space_diary').on('click', '.wall_diary', function(e){
                    	e.preventDefault(); e.stopPropagation();
                		var wall = $.query('#J_sp_diary_wall');
                        var jpop = $.ui.popup({id:"J_listOptsPopup", supressFooter:true, supressTitle:true, blockUI:true}), 
                        	did=$(this).attr('did'), cnt='';
                        
                        if(!wall.attr('curType') || wall.attr('curType') == 'pub') {
                        	cnt = '<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_diary" wallId="J_sp_diary_wall">\
                        				<p class="J_lopGoHash" aUrl="#diary_detail/'+did+'" data-pressed="true">查看详情<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopGoHash" aUrl="#diary_publish/'+did+'"  data-pressed="true">编辑日记<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopDoAjax" aUrl="/?m=diary&a=delete&id='+did+'" \
			            					tipTit="删除日记" tipMsg="删除日记后寻找该日记收藏的食品会麻烦哦，确定要删除么？"  data-pressed="true">删除日记<i class="fa fa-angle-right"></i></p>\
			            				<p class="J_lopCel" data-pressed="true">取消</p>\
			            			</div>';
                        } else {
                        	cnt = '<div id="J_listOpts" class="listOpsBtn" rId="'+did+'" iType=".wall_diary" wallId="J_sp_diary_wall">\
                        				<p data-pressed="true" class="J_lopGoHash" aUrl="#diary_detail/'+did+'">查看详情<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopDoAjax" aUrl="/?m=diary&a=unfollow&id='+did+'" \
			            					tipTit="取消收藏" tipMsg="确定要取消收藏该日记么？">取消收藏<i class="fa fa-angle-right"></i></p>\
			            				<p data-pressed="true" class="J_lopCel">取消</p>\
			            			</div>';
                        }
                		jpop.setCnt(cnt);
                    });
                    $.ui.setTitle('我的美食日记');
                    $.query('#J_sp_diary_tabs a[t="pub"]').text('我发表的');
                    $.query('#J_sp_diary_tabs a[t="collect"]').text('我收藏的');
        		} else {
            		$.query('#space_diary').on('click', '.wall_diary', function(e){
            			$.ui.loadContent('#diary_detail/'+$(this).attr('did'),false,false);
                    });
            		$.ui.setTitle('Ta的美食日记');
                    $.query('#J_sp_diary_tabs a[t="pub"]').text('Ta发表的');
                    $.query('#J_sp_diary_tabs a[t="collect"]').text('Ta收藏的');
        		}
        		
                if(e.data.goBack) return;
                if(!$.ckj.cfg.backResetPanel && uid ==  wall.attr('uid')) return;
                
        		$.spaceDiary.wCache = {}; wall.attr('curType', '');

        		wall.attr('uid', uid);
        		$.query('#J_sp_diary_tabs a[t=pub]').trigger('click');
    		});
        	
        	$("#space_diary").bind("unloadpanel", function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.feed.resetWall('#J_sp_diary_wall', true);
                    $.spaceDiary.wCache = {}; 
                    $.query('#J_sp_diary_tabs a').removeClass('cur');
                }
                
        		$.query('#space_diary').off('click', '.wall_diary');
        		$.query('#J_sp_diary_tabs').off('click', 'a');
        	});
        },
        
        panelInit: function() {
        	if( $.spaceDiary.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_sp_diary_wall_wrap"), wall = $.query('#J_sp_diary_wall'), padding=15;
    		padding = 0;
        	wall.attr({'masonry':'y','cols':1, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130});
        	
        	$.feed.init('#J_sp_diary_wall');
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

        	$.query('#space_diary').attr('scrollTgt', '#J_sp_diary_wall_wrap');
        	$.spaceDiary.cfg.panelInited = true;
        },
        
        selectType: function(){
        	$.query('#J_sp_diary_tabs').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.vv.tip({close:true});
        		$.abortQueuedAjax();
        		
        		//switch on tap
        		var $this = $(this),
        		    wall  = $.query('#J_sp_diary_wall'),
        		    type  = $this.attr('t');
        		    
        		$.query('#J_sp_diary_tabs a').removeClass('cur');
        		$this.addClass('cur');
        		
                if(!$.ckj.cfg.tabResetPanel) {              
            		var wallPg = $.query('#J_sp_diary_wall_pageBar'),
            			cType = wall.attr('curType');
            		
            		//>>> cache the wall
            		if(cType) $.spaceDiary.wCache[cType] = {page:wall.attr('page'), spage:wall.attr('spage'), wHtml:wall.html(), height:wall.height(),
            									scrollY: $.getCssMatrix($('#J_sp_diary_wall_wrap > div').get(0)).f,pgHtml:wallPg.html(), 
            									swpDisp:wallPg.css('display').toLowerCase(), wTops: wall.data('wTops'), 
            									isLoading:wall.attr('isLoading'), allLoaded: wall.attr('allLoaded'),
    							        		triDisp:$.query('#J_sp_diary_wall_triggerBar').css('display').toLowerCase(),
    							        		triHtml:$.query('#J_sp_diary_wall_triggerBar').html()
    							        };
				}
				
				var tipMsg = '';
                if(type == 'pub') tipMsg = '还有写过日记';
                else if (type == 'collect') tipMsg = '还没有收藏过日记';

        		wall.attr({'curType': type, 'noDataMsg': tipMsg});
        		$.feed.resetWall('#J_sp_diary_wall', true);
            	
            	if(!$.ckj.cfg.tabResetPanel) {
            		//>>> restore the wall
                	if($.spaceDiary.wCache[type]){
                		var c = $.spaceDiary.wCache[type], wallPg = $.query('#J_sp_diary_wall_pageBar');
                		wall.css('height', c.height + 'px').html(c.wHtml).data('wTops', c.wTops)
                			.attr({page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
                		
                		if(c.swpDisp !== 'none') wallPg.show();
                		else wallPg.hide();
                		if(c.triDisp !== 'none') $.query('#J_sp_diary_wall_triggerBar').html(c.triHtml).show();
                		else $.query('#J_sp_diary_wall_triggerBar').html(c.triHtml).hide();
                		
                		wallPg.html(c.pgHtml);
                		
                		$.query('#J_sp_diary_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
                	}
            	}
            	
        		$.spaceDiary.loadDiarys($.ckj.cfg.tabResetPanel ? null : $.spaceDiary.wCache[type]);
        	});
        },

        loadDiarys: function(rtn) {
        	var wall = $.query('#J_sp_diary_wall'),
        	    type = wall.attr('curType'),
        	    uri = '/?m=spcdry&a=index&uid='+wall.attr('uid')+'&type='+type;
        	wall.attr('dataUri', uri);
        	
        	if(rtn) return;
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        
        renderDiarys: function(data) {
        	var html   = '', imHtml='', dImgs = data.dImgs, tArr=[], curDiv = $.ui.activeDiv.id;
        	if(data.rlist.length > 0) {
				$.each(data.rlist, function(idx, d){
					imHtml = '', tArr=[];
					dImgs[d.id] &&  $.vv.log(d.id+'==='+dImgs.length + '===' + dImgs[d.id].length);
					if(dImgs[d.id]){
						$.each(dImgs[d.id], function(idx, img){
							imHtml += '<img src="'+img+'">';
						});
						imHtml = '<div class="imgs">'+imHtml+'</div>';
						$.vv.log('imgHtml:: ' + imHtml);
					};
					
					tArr = d.add_time.split(/[:\s-]+/);
    				html += '<div '+(curDiv != 'space_diary' ? '' : 'did="'+d.id+'"')+' class="wall_diary f-f" data-id="'+d.id+'">\
				    		    <div class="ltime">\
				                    <div class="year">'+tArr[0]+'</div>\
				                    <div class="mday">'+tArr[1]+'/'+tArr[2]+'</div>\
				                    <div class="hmin">'+tArr[3]+':'+tArr[4]+'</div>\
				                </div>\
				                <div class="info f-al">\
				                    <p class="title">'+d.title+'</p>\
				                    <div class="sum">'+$.vv.util.equalSubStr(d.cnt_sum.strip_tags(), 60)+'</div>'
				                    +imHtml+
				                    '<div class="meta">阅读:<i>'+d.hits+'</i>收藏:<i>'+d.collects+'</i>被赞:<i>'+d.praises+'</i>评论:<i>'+d.comments+'</i></div>\
				                </div>'+
				                    (curDiv != 'space_diary' ? '<a href="#diary_detail/'+d.id+'" class="go"></a>' : '')+
				            '</div>';
    			});
        	} 
        	return html;
        },
    };
    $.spaceDiary.init();
})(af);