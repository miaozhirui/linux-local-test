(function($){
    $.recipeBook = {
        cfg: {
        	panelInited:false
        },
        
        wallData:{
        	wallRcds:[]
        },
         
        init: function(options) {
        	$.query("#recipe_book").bind("loadpanel", function(e){
        	    $.recipeBook.panelInit();        		
        		//page params
                var params  = $.query("#recipe_book").data('params'),
                    type    = params[0], 
                    cid     = params[1], 
                    wall    = $.query('#J_recipe_wall');
                $.ui.setTitle(decodeURIComponent(params[2]));
                
        		//back transition return
                if(e.data.goBack){
                    $.ckj.showHideWallRcds($.recipeBook.wallData.wallRcds, '#J_recipe_wall');
                    return;
                };
                
        		//book the same type and cid recipes return;
        		if( !$.ckj.cfg.backResetPanel && !e.data.goBack && type ==  wall.attr('curType') && cid == wall.attr('curCid')) {
        			if(wall.find('.wall_recipe').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') {
        			    $.ckj.showHideWallRcds($.recipeBook.wallData.wallRcds, '#J_recipe_wall');
        			    return; 
        			}
        		}
        		
        		//new type/cid recipes to load
        		wall.attr({'curType': type, 'curCid': cid, 'sort':'likes'});        		
        		$.feed.resetWall('#J_recipe_wall', true);
        		$.recipeBook.loadRecipes();

        		//other reset
        		$.query('#J_recipe_orderrank_tri').find('span').html('喜欢');
        		$.query('#J_recipe_orderrank a').removeClass('active');
        		$.query('#J_recipe_orderrank a[sort=likes]').addClass('active');
    		});
        	
        	$.query("#recipe_book").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
        	        $.feed.resetWall('#J_recipe_wall', true);
        	    } else {
        	        $.ckj.hideWallRcds($.recipeBook.wallData.wallRcds, Math.abs($.query('#J_recipe_wall_wrap').scroller().scrollTop));
        	    }
    		});
        },
        panelInit: function(){
        	if( $.recipeBook.cfg.panelInited === true ) return;
        	
        	var usrCfg = $.vv.ls.get('usrCfg'), bMode='list', cols=1, padding = 0,
        		wallWrap = $.query("#J_recipe_wall_wrap"), wall = $.query('#J_recipe_wall');
        	
    		if(usrCfg && usrCfg.recipeBrowseMode && usrCfg.recipeBrowseMode == 'masonry') bMode = 'masonry';
        	//$.vv.log('usrCfg::'+JSON.stringify(usrCfg)+' navigator.userAgent::'+navigator.userAgent+' bMode::'+bMode);
    		$.vv.log('===masonry booL::', (usrCfg && usrCfg.recipeBrowseMode && usrCfg.recipeBrowseMode != 'masonry'), 'usrCfg::', usrCfg, 'bMode::', bMode);
        	if(bMode == 'list') {
        		wall.addClass('list_wall');
        		cols=1;
        	} else {
        	    cols=2;
        		padding = parseInt($.vv.cfg.cWidth * 0.05);
        		padding = padding >= 20 ? 20 : padding;
        	}
        	
        	wall.attr({'cols':cols, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
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
            
        	if(0) {
                scroller.addPullToRefresh();                
                var hideCloseTimer;
                $.bind(scroller, "refresh-release", function () {
                    var that = this;
                    clearTimeout(hideCloseTimer);
                    hideCloseTimer = setTimeout(function () {
                        that.hideRefresh();
                    }, Math.floor(Math.random() * 2000 + 1000));
                });
            }
 
        	$.feed.init('#J_recipe_wall');
        	
        	$.query('#J_recipe_listmode a[mode='+bMode+']').addClass('active');
        	$.vv.ui.toggleNavOrder('#recipe_book');
        	$.recipeBook.selectOrder();
        	$.recipeBook.selectListMode();

        	$.query('#recipe_book').attr('scrollTgt', '#J_recipe_wall_wrap');
        	$.recipeBook.cfg.panelInited = true;
        },
        loadRecipes: function() {
        	var wall = $.query('#J_recipe_wall'),
        		type = wall.attr('curType');
        	if(type == 'hot' || type == 'new') act= "day"+type;
        	else act = type;
        	var uri = '/?m=recipe_book&a='+act+'&cid='+wall.attr('curCid')+'&spic='+(parseInt(wall.attr('cols')) == 1 ? 'y' : 'n')+'&sort='+wall.attr('sort');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        selectOrder: function(){
        	$.query('#J_recipe_orderrank').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_recipe_orderrank a').removeClass('active');
        		$this.addClass('active');
        		//load recipes
        		var wall 	= $.query('#J_recipe_wall');
        		var sort 	= $this.attr('sort');
        		wall.attr('sort', sort);
        		$.feed.resetWall('#J_recipe_wall', true);
        		$.recipeBook.loadRecipes();
        		$.query($this.closest('div').attr('relTri')).trigger($.vv.cfg.clickEvt).find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        selectListMode: function() {
        	$.query('#J_recipe_listmode').on('click', 'a', function(e) {
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_recipe_listmode a').removeClass('active');
        		$this.addClass('active');
        		//load recipes
        		var wall 	= $.query('#J_recipe_wall'), mode = $this.attr('mode'), cols=2, wallWrap = $.query("#J_recipe_wall_wrap");
        		if(mode == 'masonry') {
        			wall.removeClass('list_wall');
        			var padding = parseInt($.vv.cfg.cWidth*0.05);
        			padding = padding >= 20 ? 20 : padding;
        			wall.attr({'cols': 2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding});
        		} else {
        			cols = 1;
        			wall.addClass('list_wall');
        			wall.attr({'cols': 1, 'wOffX': 0, 'wOffY': 0, 'wWallPad': 0});
        		}
        		//save user preference
        		var usrCfg = $.vv.ls.get('usrCfg');
        		usrCfg = usrCfg || {};
        		usrCfg.recipeBrowseMode = cols == 2 ? 'masonry' : 'list';
        		$.vv.ls.set('usrCfg', usrCfg);
        		$.vv.log('usrCfg::', usrCfg);
        		
        		$.feed.setMasonryParams(wall);
        		$.feed.resetWall('#J_recipe_wall', true);
        		$.recipeBook.loadRecipes();
        		$.query($(this).closest('div').attr('relTri')).trigger($.vv.cfg.clickEvt).find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        }
    };
    $.recipeBook.init();
})(af);
