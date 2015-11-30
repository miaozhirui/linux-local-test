(function($){
    $.rstimgBook = {
		cfg: {
			id:0,
			btype:'',
        	panelInited:false
        },
        wallData:{
        	wallRcds:[]
        },
        urlMap: {
        	'rstrnt': {'title':'餐馆附图', 'url':'/?m=rstimg&a=book&rid='},
        	'user': {'title':'街友上传的餐馆附图', 'url':'/?m=rstimg&a=book&uid='},
        },
        init: function(options) {	
        	$("#rstimg_book").bind("loadpanel", function(e) {
        		$.rstimgBook.panelInit();
        		//page params
        		var params = $.query("#rstimg_book").data('params'),
        			btype = params[0], 
        			rid=params[1],
        			wall = $.query('#J_rstimg_wall');
        		if(e.data.goBack && btype == $.rstimgBook.cfg.btype && rid == $.rstimgBook.cfg.id) {
        		    if(wall.find('.wall_rstimg').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') {
        			    $.ckj.showHideWallRcds($.rstimgBook.wallData.wallRcds, '#J_rstimg_wall');
                        return;
                    }
        		}
        		
        		$.rstimgBook.cfg.btype = btype;
        		$.rstimgBook.cfg.id = rid;
        		
        		wall.attr({'btype': btype, 'rid': rid});
        		$.feed.resetWall('#J_rstimg_wall', true);
        		$.rstimgBook.loadRstimgs();
    		});
        	
        	$.query("#rstimg_book").bind('unloadpanel', function() {
        		$.ckj.hideWallRcds($.rstimgBook.wallData.wallRcds, Math.abs($.query('#J_rstimg_wall_wrap').scroller().scrollTop));
    		});
        },
        
        panelInit: function() {
        	if( $.rstimgBook.cfg.panelInited === true ) return;
        	//wall scroller: scroll to load rstimgs
        	var wallWrap = $.query("#J_rstimg_wall_wrap"), wall = $.query('#J_rstimg_wall'), padding = parseInt($.vv.cfg.cWidth*0.05);
        	padding = padding >= 20 ? 20 : padding;
        	wall.attr({cols:2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-90});
        	$.feed.init('#J_rstimg_wall');
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
            
        	$.rstimgBook.cfg.panelInited = true;
        },
        
        loadRstimgs: function() {
        	var wall = $.query('#J_rstimg_wall'), btype = wall.attr('btype'), rid = wall.attr('rid'),
        		uri  = $.rstimgBook.urlMap[btype].url + rid;
        	$.ui.setTitle($.rstimgBook.urlMap[btype].title);
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    
    $.rstimgBook.init();
})(af);