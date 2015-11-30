(function($){
    $.faqBook = {
        cfg: {
        	panelInited:false
        },
        wallData:{
        	wallRcds:[]
        },
        init: function(options) {
        	$("#faq_book").bind("loadpanel", function(e) {
        		var params = $.query("#faq_book").data('params'), 
        		    key = params ? params[0] : '';
        		$.query('#J_faq_wall').attr({'q':key});
        		if(e.data.goBack){
        			$.ckj.showHideWallRcds($.faqBook.wallData.wallRcds, '#J_faq_wall');
        			return;
        		}
        		$.faqBook.panelInit();
        		//page params
        		$.feed.resetWall('#J_faq_wall', true);
        		$.faqBook.loadFaqs();
        		$.faqBook.loadKeys();
    		});
        	
        	$.query("#faq_book").bind('unloadpanel', function(e) {
        	    if(e.data.goBack) {
                    $.feed.resetWall('#J_faq_wall', true);
                } else {
                    $.ckj.hideWallRcds($.faqBook.wallData.wallRcds, Math.abs($.query('#J_faq_wall_wrap').scroller().scrollTop));
                }
    		});
        },
        panelInit: function(){
        	if( $.faqBook.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_faq_wall_wrap"), wall = $.query('#J_faq_wall'), padding=0;
    		padding = parseInt($.vv.cfg.cWidth*0);
    		padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
            
        	$.feed.init('#J_faq_wall');
        	
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
 
        	
        	$.vv.ui.toggleNavOrder('#faq_book');
        	$.faqBook.selectType();
        	$.faqBook.selectKey();
        	
        	$.query('#faq_book').attr('scrollTgt', '#J_faq_wall_wrap');
        	$.faqBook.cfg.panelInited = true;
        },
        loadFaqs: function() {
        	var wall = $.query('#J_faq_wall');
        	var uri = '/?m=faq&a=book&type='+wall.attr('curType')+'&q='+encodeURIComponent(wall.attr('q'));
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        loadKeys: function() {
        	var kkey = 'faq_hotkeys', keys = $.vv.ls.get(kkey);
        	if(keys) {showKeys(keys); return true;}
        	
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=faq&a=hot_keys',
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time: 3000}); 
                	} else {
                    	showKeys(rst.data);
                    	$.vv.ls.set(kkey, rst.data, $.ckj.cacheTime.faqHotKeys);
                	}
                },
                dataType: "json"
            });
        	
        	function showKeys(keys){
        		var html = $.ckj.renderPopupKeys(keys);
        		$.query('#J_faq_keys').html(html);
        	}
        },
        selectKey: function(){
        	$.query('#J_faq_keys').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_faq_keys a').removeClass('active');
        		$this.addClass('active');
        		//load faqs
        		var wall 	= $.query('#J_faq_wall');
        		var key 	= $this.text().trim();
        		wall.attr('q', key);
        		$.feed.resetWall('#J_faq_wall', true);
        		$.faqBook.loadFaqs();
        		$.query($(this).closest('div').attr('relTri')).trigger($.vv.cfg.clickEvt).find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        selectType: function(){
        	$.query('#J_faq_type').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_faq_type a').removeClass('active');
        		$this.addClass('active');
        		//load faqs
        		var wall 	= $.query('#J_faq_wall');
        		var type 	= $this.attr('type');
        		wall.attr({'curType': type, 'q':''}); //empty query keys
        		$.feed.resetWall('#J_faq_wall', true);
        		$.faqBook.loadFaqs();
        		$.query($(this).closest('div').attr('relTri')).trigger($.vv.cfg.clickEvt).find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        }
    };
    $.faqBook.init();
})(af);