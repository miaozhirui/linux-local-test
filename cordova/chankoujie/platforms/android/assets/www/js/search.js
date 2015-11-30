(function($){
    $.search = {
    	cfg:{
    		sType:'',
    		iptOldVal:'',
    		keyTimer: null,
    		histKeys: [],
    		panelInited:false
    	},
        map:{'recipe':'菜谱', 'rmenu':'菜单', 'stuff':'食材', 'item':'食品', 'album':'吃柜', 'store':'好店', 
    		 'brand':'品牌', 'rstrnt':'餐馆', 'group':'吃群', 'subject':'群主题', 'faq':'美食问题', 'diary':'美食日记', 'user':'街友'},
        init: function(options){
        	$("#search").bind("loadpanel",function(e) {
        		var params = $.query("#search").data('params'), sType = params[0] ? params[0] : 'item';
        		$.ui.setTitle($.search.map[sType] + '搜索');
        		
        		$.query("#J_search_key").on('focus', function(){      		
            		if($.search.cfg.keyTimer === null) $.search.cfg.keyTimer = setInterval($.search.checkKey, 500);//input key check timer 		
            	}).on('blur', function(){
            		clearInterval($.search.cfg.keyTimer);$.search.cfg.keyTimer = null;//clear check key Timer
            		//setTimeout(function() {$.query('#J_search_hist_wrap').hide();}, 50); //>>> workaround for clicking history searching keys
            	}).on('click', function(){$.query('#J_search_hist_wrap').show();});
            	
            	$.query('#J_search_btn').on('click', function(){ $.search.submitSch(); });

            	$('#J_search_hist').on('click', 'li', function(){
            		$this = $(this);
            		if($this.attr('clearhist') == 'y') {
            			$.query('#J_search_hist').empty();
            			$.search.cfg.histKeys = [];
            			$.search.clearHistKeys();
            			$.query("#J_search_key").val('');
            		} else {
            			$.query("#J_search_key").val($this.text());
            			$.search.submitSch();
            		}
            	});
            	
            	$.vv.ui.onPressed('#search');
        		
        		if(e.data.goBack && sType == $.search.cfg.sType) return; //>>> back
        		
        		$.search.panelInit();
        		
        		if(sType == 'rstrnt'){
        			$.query('#J_search_wall_wrap').hide();
        			$.query('#J_search_hist_wrap').show();
        			$.query('#search').attr('scrollTgt', '#J_search_hist_wrap');
        		} else {
        			if(sType == 'recipe') $.query('#J_search_wall').addClass('list_wall');
        			else $.query('#J_search_wall').removeClass('list_wall');
        			$.query('#J_search_wall_wrap').show();
        			$.query('#J_search_hist_wrap').hide();
        			$.query('#search').attr('scrollTgt', '#J_search_wall_wrap');
        			$.feed.resetWall('#J_search_wall', true);
        			$.query('#J_search_wall_triggerBar').hide();
        		}
        		$.search.cfg.sType = sType;

        		$.search.initHistKeys();
        	});
        	
        	$("#search").bind("unloadpanel",function(e) {
        	    if(e.data.goBack) {
        	        $.search.cfg.sType = '';
        	        $.feed.resetWall('#J_search_wall', true);
        	    }
        	    
        		$.search.saveHistKeys();
        		clearInterval($.search.cfg.keyTimer);$.search.cfg.keyTimer = null;
        		$.query("#J_search_key").off('focus').off('blur').off('click');
        		$.query('#J_search_btn').off('click');
        		$('#J_search_hist').off('click', 'li');
        		$.vv.ui.offPressed('#search');
        	});
        },
        panelInit: function(){
        	if($.search.cfg.panelInited == true) return;

        	$.query("#J_search_hist").scroller({scrollBars: false, vScrollCSS: "afScrollbar", hasParent:true, useJsScroll:true});
        	var wallWrap = $.query("#J_search_wall_wrap"), wall = $.query('#J_search_wall'), padding=0;
        	wall.attr({'cols':1, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-140});
        	$.feed.init('#J_search_wall');
        	var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, useJsScroll:false});

        	//inited flag
        	$.search.cfg.panelInited = true
        },
        initHistKeys: function(){	
        	if($.search.cfg.histKeys.length < 1) $.search.cfg.histKeys = $.search.getHistKeys();
        	var keys = $.search.cfg.histKeys, html = '';
        	$.each(keys, function(idx, key){
        		html += '<li class="hover">'+key+'</li>';
        	});
        	if(keys.length > 0) html += '<li clearhist="y" class="clearhist">清空搜索历史</li>';
        	$.query('#J_search_hist').empty().html(html);
        },
        getHistKeys:function(){
        	var hkeys = $.vv.ls.get('searchHist');
        	return hkeys ? hkeys : [];
        },
        saveHistKeys:function(){
        	if($.search.cfg.histKeys.length > 0) $.vv.ls.set('searchHist', $.search.cfg.histKeys);
        },
        clearHistKeys:function(){
        	$.search.cfg.histKeys = [];
        	if($.search.cfg.sType == 'rstrnt') $.rstBook.cfg.schKey = '';
        	$.vv.ls.del('searchHist');
        },
        checkKey: function () {
        	var tVal = $.query("#J_search_key").val().trim(), okKeys = [], html = '';
        	//equal to old val, then return
        	if(tVal == $.search.cfg.iptOldVal) return;
        	$.search.cfg.iptOldVal = tVal;
        	if(tVal) {
        		var ptn =  new RegExp(tVal,"i");
            	$.each($.search.cfg.histKeys, function(idx, key){
            		if(ptn.test(key)) okKeys.push(key);
            	});
        	} else {
        		okKeys = $.search.cfg.histKeys;
        	}
        	$.each(okKeys, function(idx, key){
        		html += '<li class="hover">'+key+'</li>';
        	});
        	if(okKeys.length > 1) html += '<li clearhist="y" class="clearhist">清理搜索历史</li>';
        	$.query('#J_search_hist').empty().html(html);
        },
        submitSch:function(){
        	var tVal = $.query("#J_search_key").val();
        	if(tVal && $.search.cfg.histKeys.indexOf(tVal) == -1) { $.search.cfg.histKeys.unshift(tVal); }
        	
        	if($.search.cfg.sType == 'rstrnt') {
        		$.rstBook.cfg.schKey = tVal;
            	$.ui.goBack();
        	} else {
        		$.query('#J_search_hist_wrap').hide();
        		$.query('#J_search_wall_wrap').show();
        		$.query('#J_search_wall_triggerBar').show();
        		
        		var wall = $.query('#J_search_wall'), wallWrap = $.query("#J_search_wall_wrap"), padding=0, type = $.search.cfg.sType;
        		if (type == 'recipe') {
            		padding = 0;
                	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_recipe', 'sizeUnit':'', 'renderFunc':'$.ckj.renderRecipes',
                				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'delta':'n'
                			 });
        		} else if (type == 'rmenu') {
            		padding = parseInt($.vv.cfg.cWidth*0.05);
            		padding = padding >= 20 ? 20 : padding;
                	wall.attr({ 'masonry':'y', 'cols':2, 'feedRcd':'wall_rmenu', 'sizeUnit':'', 'renderFunc':'$.ckj.renderRmenus',
        				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'delta':'n'
        			 });
        		} else if(type == 'stuff') {
            		padding = parseInt($.vv.cfg.cWidth*0.05);
            		padding = padding >= 20 ? 20 : padding;
                	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_stuff', 'sizeUnit':'', 'renderFunc':'$.ckj.renderStuffs',
                				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'delta':'n'
                			 });
        		} else if(type == 'item') {
            		padding = parseInt($.vv.cfg.cWidth*0.04);
            		padding = padding >= 20 ? 20 : padding;
                	wall.attr({ 'masonry':'y', 'cols':2, 'feedRcd':'wall_item', 'sizeUnit':'.pic', 'renderFunc':'$.ckj.renderItems',
                				'oImgWd':210, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'delta':'y'
                			 });
        		} else if(type == 'album') {
            		padding = parseInt($.vv.cfg.cWidth*0.05);
            		padding = padding >= 20 ? 20 : padding;
                	wall.attr({ 'masonry':'y', 'cols':2, 'feedRcd':'wall_album', 'sizeUnit':'', 'renderFunc':'$.ckj.renderAlbums',
        				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding,
        				'delta':'n'
        			 });
        		} else if(type == 'store') {
            		padding = parseInt($.vv.cfg.cWidth*0.05);
            		padding = padding >= 20 ? 20 : padding;
                	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_store', 'sizeUnit':'', 'renderFunc':'$.ckj.renderStores',
                				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding,
                				'delta':'n'
                			 });
        		} else if(type == 'brand'){
            		padding = parseInt($.vv.cfg.cWidth*0.05);
            		padding = padding >= 20 ? 20 : padding;
                	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_brand', 'sizeUnit':'', 'renderFunc':'$.ckj.renderBrands',
                				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding,
                				'delta':'n'
                			 });
        		} else if (type == 'group'){
                	wall.attr({ 'masonry':'n', 'cols':'', 'feedRcd':'sgroup_rcd', 'sizeUnit':'', 'renderFunc':'$.ckj.renderSgroups',
        				'oImgWd':'', 'wOffX': '', 'wOffY': '', 'wWallPad': '', 'delta':'n'
        			 }).css('padding', '15px');
        		} else if (type == 'subject'){
            		padding = 0;
                	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'subject_rcd', 'sizeUnit':'', 'renderFunc':'$.ckj.renderSubjects',
        				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'delta':'n'
        			 });
        		} else if(type == 'faq'){
            		padding = 0;
                	wall.attr({ 'masonry':'y', 'cols':1, 'feedRcd':'wall_faq', 'sizeUnit':'', 'renderFunc':'$.ckj.renderFaqs',
                				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'delta':'n'
                			 });
        		} else if(type == 'user'){
        			padding = parseInt($.vv.cfg.cWidth*0.05);
                	padding = padding >= 20 ? 20 : padding;
                	wall.attr({ 'masonry':'y', 'cols':3, 'feedRcd':'block_user', 'sizeUnit':'', 'renderFunc':'$.ckj.renderBookUsers',
                				'oImgWd':'', 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'delta':'n'
                			 });
        		}
        		
        		$.feed.resetWall('#J_search_wall', true);
        		if(wall.attr('masonry') == 'y') $.feed.setMasonryParams(wall); //params reset
        		$.search.loadSearch();
        	}
        },
        loadSearch: function() {
        	var wall = $.query('#J_search_wall');
        	var uri = '/?m=search&t='+$.search.cfg.sType+'&q='+$.query("#J_search_key").val();
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        	$.search.saveHistKeys();
        },
    };
    
    $.search.init();
})(af);