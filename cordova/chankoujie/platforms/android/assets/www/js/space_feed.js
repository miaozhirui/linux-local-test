(function($) {
    $.spaceFeed = {
        cfg: {
        	panelInited:false,
        	uid:0
        },
        
        wCache: {},
        
        init: function(options) {
        	$("#space_feed").bind("loadpanel",function(e){
        	    $.spaceFeed.panelInit();
        		var params   = $.query("#space_feed").data('params'),
        			uid      = params[0],
        			wall     = $.query('#J_sp_feed_wall');

        		if(uid == $.ckj.user.id) {
        		    $.spaceFeed.selectType();
        		    $.spaceFeed.bindDelTopic();
                    $.ui.setTitle('我的动态');
                    
                    $.query('#J_sp_feed_tabs').show(); 
                    $.query('#J_sp_feed_wall_wrap').css('top','40px');
                    
                    wall.attr('initHeight', $.vv.cfg.cHeight-130).attr('fType', '');
        		} else {
                    $.ui.setTitle('Ta的动态');
                    
                    $.query('#J_sp_feed_tabs').hide(); //>>> must be position absolute, or it will not be hidded on $.os.androidVersion < 4.4
                    $.query('#J_sp_feed_wall_wrap').css('top','0px');
                    
                    wall.attr('initHeight', $.vv.cfg.cHeight-90).attr('fType', 'whotpc');
        		}

                if(e.data.goBack) return;
                
        		if(!$.ckj.cfg.backResetPanel && $.spaceFeed.cfg.uid == uid && wall.find('.talk_f').length > 0 && 
        		   wall.attr('allLoaded') != 'y'  && wall.attr('isLoading') != 'y') {
        			return;
        		}

        		$.spaceFeed.cfg.uid = uid;
        		wall.attr('uid', uid);
        		$.feed.resetWall('#J_sp_feed_wall', true);
        		
        		if(uid == $.ckj.user.id) {
        			$.query('#J_sp_feed_tabs a[t=alltpc]').trigger('click');
        			$.spaceFeed.wCache = {};
        		} else {
        		    wall.attr('fType', 'whotpc');
        			$.spaceFeed.loadFeeds();
        		}
    		});
        	
        	$("#space_feed").bind("unloadpanel",function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
        	        $.feed.resetWall('#J_sp_feed_wall', true);
        	        $.spaceFeed.wCache = {};
        	        $.query('#J_sp_feed_tabs a').removeClass('cur');
                    $.query('#J_sp_feed_tabs a[t=pub]').addClass('cur');
        	    }
        		if($.spaceFeed.cfg.uid == $.ckj.user.id) {
        		    $.query('#space_feed').off('click', '.J_delTpc');
        		    $.query('#J_sp_feed_tabs').off('click', 'a');
        		}
        	});
        },
        
        panelInit: function(){
            if( $.spaceFeed.cfg.panelInited === true ) return;
            
            var wallWrap = $.query("#J_sp_feed_wall_wrap"), wall = $.query('#J_sp_feed_wall'), padding=0;
            padding = parseInt($.vv.cfg.cWidth*0.0);
            padding = padding >= 20 ? 20 : padding;
            wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-130});
            
            wall.attr('fType', 'alltpc');
            $.feed.init('#J_sp_feed_wall');
            
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
            
            if(1) {
                scroller.addPullToRefresh();
                $.bind(scroller, "refresh-trigger", function () {
                    //TODO: it's a synchronized callback, so you should return as soon as possible, use $.asap or setTimeout to ...
                });
                
                var hideCloseTimer;
                $.bind(scroller, "refresh-release", function () {
                    var that = this;
                    clearTimeout(hideCloseTimer);
                    hideCloseTimer = setTimeout(function () {
                        that.hideRefresh();
                    }, Math.floor(Math.random() * 2000 + 1000));
                });
            }
            
            $.query('#space_feed').attr('scrollTgt', '#J_sp_feed_wall_wrap');
            $.query('#space_feed').on('tap', '.talk_f', function(e){
                var orgEl = $(e.target), tn = e.target.tagName.toLowerCase();
                if(orgEl.hasClass('fa-comment') || orgEl.hasClass('fa-share') || orgEl.hasClass('fa-times') || orgEl.hasClass('avatar')) return;
                if(tn == 'a') return;
                var that = $(this), href = that.attr('data-uri');
                if(href){
                    that.addClass('pressed');
                    setTimeout(function(){
                        $.ui.loadContent(href, false, false, $.ckj.cfg.formTrans);
                        that.removeClass('pressed');
                    }, 60);
                } else {
                    $.vv.tip({content:'原文已被删除', icon:'info'});
                }
            });
            
            $.spaceFeed.bindFwdTopic();
            
            $.spaceFeed.cfg.panelInited = true;
        },
        
        selectType: function(){
            $.query('#J_sp_feed_tabs').on('click', 'a', function(e){
                e.stopPropagation();e.preventDefault();
                $.vv.tip({close:true});
                $.abortQueuedAjax();

                var $this   = $(this), 
                    wall    = $.query('#J_sp_feed_wall'),
                    fType   = $this.attr('t');
                    
                $("#J_sp_feed_tabs a").removeClass('cur');
                $this.addClass('cur');
                
                if(!$.ckj.cfg.tabResetPanel) {
                    var wallPg  = $.query('#J_sp_feed_wall_pageBar'),
                        cType   = wall.attr('fType'); 
    
                    //>>> cache the wall
                    if($.spaceFeed.cfg.uid == $.ckj.user.id && cType) $.spaceFeed.wCache[cType] = {
                        page: wall.attr('page'), 
                        spage: wall.attr('spage'), 
                        wHtml: wall.html(), 
                        height: wall.height(),
                        scrollY: $.getCssMatrix($('#J_sp_feed_wall_wrap > div').get(0)).f, 
                        pgHtml: wallPg.html(), 
                        swpDisp: wallPg.css('display').toLowerCase(), 
                        isLoading: wall.attr('isLoading'), 
                        allLoaded: wall.attr('allLoaded'),
                        triDisp: $.query('#J_sp_feed_wall_triggerBar').css('display').toLowerCase(),
                        triHtml: $.query('#J_sp_feed_wall_triggerBar').html(),
                    };
                }

                wall.attr('fType', fType);
                wall.attr('noDataMsg', "<i class='fa fa-smile-o'></i>暂无动态");
                $.feed.resetWall('#J_sp_feed_wall', true);
                
                if(!$.ckj.cfg.tabResetPanel) {
                    //>>> restore the wall
                    if($.spaceFeed.cfg.uid == $.ckj.user.id && $.spaceFeed.wCache[fType]){
                        var c = $.spaceFeed.wCache[fType], wallPg = $.query('#J_sp_feed_wall_pageBar');
                        wall.css('height', c.height + 'px').html(c.wHtml).attr({page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
                        
                        if(c.swpDisp !== 'none') wallPg.show();
                        else wallPg.hide();
                        if(c.triDisp !== 'none') $.query('#J_sp_feed_wall_triggerBar').html(c.triHtml).show();
                        else $.query('#J_sp_feed_wall_triggerBar').html(c.triHtml).hide();
                        
                        wallPg.html(c.pgHtml);
                        
                        $.query('#J_sp_feed_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
                    }
                }

                $.spaceFeed.loadFeeds(!$.ckj.cfg.tabResetPanel ? $.spaceFeed.wCache[fType] : null);
            });
        },
        
        bindDelTopic: function(){
        	$.query('#space_feed').on('click', '.J_delTpc', function(e){
        		if($.spaceFeed.cfg.uid != $.ckj.user.id) return false;
        		e.preventDefault(); e.stopPropagation();
            	if(!$.user.isLogin({
            		okFunc:function($this){
            			var tid = $this.closest('.talk_f').attr('tid');                        
                        $.ui.popup( {
                            title:"删除动态",
                            message:"您确定要删除该动态吗?",
                            cancelText:"取消",
                            cancelCallback: null,
                            doneText:"删除",
                            supressFooter:false,
                            cancelClass:'button',
                            doneClass:'button',
                            doneCallback: function () {
                                $.vv.tip({icon:'loading'});
                                $.getJSON($.ckj.cfg.mapi + '/?m=topic&a=delete&tid='+tid, function(r){
                                    if(r.status == 0){
                                        $this.closest('.talk_f').css3Animate({
                                            x: "-"+$.vv.cfg.cWidth+"px",
                                            time: "350ms",
                                            complete: function () {
                                                $this.closest('.talk_f').remove();
                                                $('#J_sp_feed_wall').css('height', 'auto');
                                                $.query($('#J_sp_feed_wall').attr('relWrap')).scroller().correctScroll();
                                            }
                                        });
                                        $.vv.tip({close:true});
                                    }else{
                                        $.vv.tip({content:r.msg, icon:'error'});
                                    }
                                });
                            },
                            cancelOnly:false,
                            blockUI:true
                        });
            		},
            		okData:$(this)
            	})) return false;
            });
        },
        
        //forward
        bindFwdTopic: function(){
            $('#space_feed').on('click', '.J_fwdTpc', function(e){
                e.preventDefault(); e.stopPropagation();
            	if(!$.user.isLogin({
            		okFunc:function($this){
            			var tid = $this.closest('.talk_f').attr('tid');
                        var jpop = $.query('#space_feed').popup({ id:"J_tpcFwd", title:'<i class="fa fa-share"></i>转发给我的粉丝',blockUI:false, addCssClass:'popBottom'});
                        $.getJSON($.ckj.cfg.mapi + '/?m=topic&a=forward', {tid:tid}, function(r){
                            if(r.status == 0){
                            	jpop.setCnt(r.data);
                                $.spaceFeed.fwdTpcFrm($('#J_fwdTpcFrm'), jpop);
                            }else{
                                $.vv.tip({content:r.msg, icon:'error'});
                            }
                        });
            		},
            		okData:$(this)
            	})) return false;
            });
        },
        
        fwdTpcFrm: function(form, jpop){
            form.submit(function(e){
            	e.preventDefault(); e.stopPropagation();
            	
            	var content = form.find('.J_content').val();
                if(content == ''){
                    $.vv.tip({content:'请输入转发内容', icon:'error'});
                    return false;
                }
                jpop.setTitle('<i class="fa fa-spinner fa-spin"></i>转发中...');
    			$.ajax({
                    url: $.ckj.cfg.mapi + form.attr('action'),
                    type:'post',
                    data:form.serialize(),
                    success: function(r){
                    	   if(r.status == 0){
                               $.vv.tip({content:r.msg, icon:'success'});
                           } else {
                               $.vv.tip({content:r.msg, icon:'error'});
                           }
                    	   jpop.hide();
                    },
                    dataType: "json"
               });
            });
        },

        loadFeeds: function(rtn) {
        	var wall = $.query('#J_sp_feed_wall');
        	var uri  =  '/?m=space&a='+wall.attr('fType')+'&uid='+wall.attr('uid');
        	wall.attr('dataUri', uri);
        	if(rtn) return;
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        renderFeeds:function(data){
        	var html   = '';
        	if(data.rlist.length > 0){
        		html = data.html;
        	} 
        	return html;
        },
    };
    
    $.spaceFeed.init();
})(af);
