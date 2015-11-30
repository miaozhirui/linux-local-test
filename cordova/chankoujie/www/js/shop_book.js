(function($){
    $.shopBook = {
        cfg: {
            panelInited:false
        },
        wCache: { },
        smap: {	1:{'tname':'食材', 'fa':'fa-banana', 'color':'#00FF00'}, 
        		2:{'tname':'食品', 'fa':'fa-hdd-o', 'color':'#FFFF00'}, 
        	  },
        init: function(options) {
            $.query("#shop_book").bind("loadpanel", function(e) {
                if(e.data.goBack){ return; }
                $.shopBook.panelInit();
                $.feed.resetWall('#J_shoprcd_wall', true);
                
                $('#J_shoprcd_wall').attr('sType', '');
                $('#J_shoprcd_types a[t="1"]').trigger('click');
            });
            
            $.query("#shop_book").bind('unloadpanel', function(e) {
                if($.ckj.cfg.backResetPanel && e.data.goBack) {
                    $.shopBook.wCache = {};
                    $.feed.resetWall('#J_shoprcd_wall', true);
                } 
            });
        },
        panelInit: function(){
            if( $.shopBook.cfg.panelInited === true ) return;
            
            var wallWrap = $.query("#J_shoprcd_wall_wrap"), wall = $.query('#J_shoprcd_wall'), padding=0;
            padding = parseInt($.vv.cfg.cWidth*0.0);
            padding = padding >= 20 ? 20 : padding;
            wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-175});
            
            $.feed.init('#J_shoprcd_wall');
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
            
            var hideBuyed =  $.vv.ls.get('hide_buyed_shoprcd');
            hideBuyed = hideBuyed || 'n';
            wall.attr('hideBuyed', hideBuyed);
            
            $.shopBook.selectType();
            $.shopBook.addShopRcd();
            $.shopBook.setShopRcdBuy();
            $.shopBook.hideShowShopRcd();
            $.shopBook.delBuyedShopRcd();
            
            $.query('#shop_book').attr('scrollTgt', '#J_shoprcd_wall_wrap');
            $.shopBook.cfg.panelInited = true;
        },
        selectType: function(){
            $.query('#J_shoprcd_types').on('click', 'a', function(e){
                e.stopPropagation();e.preventDefault();
                
        		$("#J_shoprcd_types a").removeClass('cur');
                var $this = $(this), wall = $.query('#J_shoprcd_wall'),wallPg = $.query('#J_shoprcd_wall_pageBar'),
                	sType = $this.attr('t'), cType = wall.attr('sType');
                $this.addClass('cur');
                
                if(!$.ckj.cfg.tabResetPanel) {        
                    //>>> cache the wall
                    if(cType)$.shopBook.wCache[cType] = {page:wall.attr('page'), spage:wall.attr('spage'), wHtml:wall.html(), height:wall.height(),
    						scrollY: $.getCssMatrix($('#J_shoprcd_wall_wrap > div').get(0)).f,pgHtml: wallPg.html(), 
    						swpDisp:wallPg.css('display').toLowerCase(), isLoading:wall.attr('isLoading'), allLoaded: wall.attr('allLoaded'),
    		        		triDisp:$.query('#J_shoprcd_wall_triggerBar').css('display').toLowerCase(),
    		        		triHtml:$.query('#J_shoprcd_wall_triggerBar').html()
    		        };
                }
                
                $.feed.resetWall('#J_shoprcd_wall', true);
        		wall.attr({'sType':sType, 'noDataMsg':'<i class="fa fa-smile-o"></i>暂无预购'+$.shopBook.smap[sType]['tname']});
        		$.query('#J_add_shoprcd').text('新增'+$.shopBook.smap[sType]['tname']);
        		
        		if(!$.ckj.cfg.tabResetPanel) {      
            		//>>> restore the wall
                	if($.shopBook.wCache[sType]){
                		var c = $.shopBook.wCache[sType], wallPg = $.query('#J_shoprcd_wall_pageBar');
                		wall.css('height', c.height + 'px').html(c.wHtml).attr({page:c.page, spage:c.spage, isLoading:c.isLoading, allLoaded:c.allLoaded});
                		
                		if(c.swpDisp !== 'none') wallPg.show();
                		else wallPg.hide();
                		if(c.triDisp !== 'none') $.query('#J_shoprcd_wall_triggerBar').html(c.triHtml).show();
                		else $.query('#J_shoprcd_wall_triggerBar').html(c.triHtml).hide();
                		
                		wallPg.html(c.pgHtml);
                		
                		$.query('#J_shoprcd_wall_wrap').scroller().scrollTo({x:0, y:c.scrollY});
                	}
            	}
        		$.shopBook.loadShopRcds($.shopBook.wCache[sType]);
            });
        },
        delBuyedShopRcd: function(){
        	$.query('#shop_book').on('click', '#J_del_shoprcd_buyed', function(e){
        		e.stopPropagation();e.preventDefault();
        		var rcds = $.query('#J_shoprcd_wall .buyed');
        		if(rcds.length > 0){
        			var sql = '', hlds = '', sType=parseInt($.query('#J_shoprcd_wall').attr('sType')), args = [];
        			$.each(rcds, function(idx, s){
        				var $s = $(s);
        				hlds += hlds == '' ? '?' : ', ?';
        				args.push($s.attr('name'));
        			});
        			sql = 'DELETE FROM shop WHERE stype='+sType+' AND name IN('+hlds+') AND buystat=1';
        			$.vv.db.exec(	'shop', sql, args,
        						  	function(){$.query('#J_shoprcd_wall .buyed').remove();},
        						  	function(){ $.vv.tip({icon:'error', content:'抱歉， 操作失败，请稍后重试！', time:3000}); }
        			);
        		}
        	});
        },
        hideShowShopRcd: function(){
        	$.query('#shop_book').on('click', '#J_hide_shoprcd_buyed', function(e){
        		e.stopPropagation();e.preventDefault();
        		var wall = $.query('#J_shoprcd_wall'), hideBuyed = wall.attr('hideBuyed');
        		if(hideBuyed == 'y') {
        			wall.attr('hideBuyed', 'n');
        			$.vv.ls.set('hide_buyed_shoprcd', 'n');
        			$.query('#J_hide_shoprcd_buyed').text('隐藏已买');
        		} else {
        			wall.attr('hideBuyed', 'y');
        			$.vv.ls.set('hide_buyed_shoprcd', 'y');
        			$.query('#J_hide_shoprcd_buyed').text('显示已买');
        		}
        		
        		$.feed.resetWall('#J_shoprcd_wall', true);
        		$.shopBook.loadShopRcds();
        	});
        },
        setShopRcdBuy: function(){
        	$.query('#shop_book').on('click', '.shop_rcd', function(e){
        		e.stopPropagation();e.preventDefault();
        		var self = $(this), stype = parseInt($.query('#J_shoprcd_wall').attr('sType'));
        		if(self.hasClass('buyed')) {
        			$.vv.db.exec(	'shop', 'UPDATE shop SET buystat=? WHERE stype=? AND name=?', [0, stype, self.attr('name')],
        							function(){self.removeClass('buyed').find('.cbox').empty();},
        							function(){ $.vv.tip({icon:'error', content:'更新失败，请稍后重试！', time:3000}); }
        						);
        			self.removeClass('buyed').find('.cbox').empty();
        		} else {
        			$.vv.db.exec(	'shop', 'UPDATE shop SET buystat=? WHERE stype=? AND name=?', [1, stype, self.attr('name')],
									function(){
        											if($.query('#J_shoprcd_wall').attr('hideBuyed') != 'y')
        												self.addClass('buyed').find('.cbox').html('<i class="fa fa-check"></i>');
        											else self.remove();
        									  },
									function(){ $.vv.tip({icon:'error', content:'更新失败，请稍后重试！', time:3000}); }
								);
        		}
        	});
        },
        addShopRcd: function(){
        	$.query('#shop_book').on('click', '#J_add_shoprcd', function(e){
        		e.stopPropagation();e.preventDefault();
        		var cnt = ' <div id="J_add_shoprcd_pop">\
								<div class="name f-f f-vc">\
									<p class="h">名称：</p>\
									<p class="v f-al"><input type="text" class="J_name" /></p>\
								</div>\
								<div class="amount f-f f-vc">\
									<p class="h">分量：</p>\
									<p class="v f-al"><input type="text" class="J_amount" /></p>\
								</div>\
							</div>';
        		$.ui.popup({
            	    title:$.query('#J_add_shoprcd').text(),
            	    message:cnt,
            	    cancelText:"取消",
            	    cancelCallback: null,
            	    doneText:"增加",
            	    supressFooter:false,
            	    cancelClass:'button',
            	    doneClass:'button',
            	    doneCallback: function () {
            	    	var pop 	= $.query('#J_add_shoprcd_pop'),
            	    		name 	= pop.find('.J_name').val(),
            	    		amount 	= pop.find('.J_amount').val();
            	    	if(name){
            	    		var rcd = {'name':name, 'amount':amount, 'stype':$.query('#J_shoprcd_wall').attr('sType'), 'buystat':0};
            	    		$.vv.log(rcd);
            	    		$.vv.db.insert('shop', rcd, 
				            	    		function(){ 
				            	    		    if($.query('#J_shoprcd_wall .shop_rcd').length < 1)
				            	    		         $.query('#J_shoprcd_wall_triggerBar').html($.feed.noMoreDataMsg);
				            	    		    $.query('#J_shoprcd_wall').prepend($.shopBook.renderShop({'rlist': [rcd]}));
				            	    		}, 
				            	    		function(){ $.vv.tip({icon:'error', content:'Sorry， 保存失败，请稍后重试！', time:3000}); }
            	    		);
            	    	}
            	    },
            	    cancelOnly:false,
            	    addCssClass:'popBottom',
            	    blockUI:true
            	});
        	});
        },
        loadShopRcds: function(rtn) {
            var wall = $('#J_shoprcd_wall');
                        
        	if(rtn)return;
        	
            $.query($.query('#J_shoprcd_wall').attr('triggerBar')).trigger('click');
        },
        renderShop: function(data, wall) {
        	var html = '';
        	if(data.rlist.length > 0) {
        		var sm = $.shopBook.smap;
        		$.each(data.rlist, function(idx, s) {
        			if(sm[s.stype]) {
	        			html +='<li name="'+s.name+'" class="shop_rcd f-f f-vc '+((s.buystat == 1) ? 'buyed' : '')+'">\
	        		        		<div class="bstat f-f f-vc f-hc">\
					    	        	<div class="cbox">'+((s.buystat == 1) ? '<i class="fa fa-check"></i>' : '')+'</div>\
					    	        </div>\
					    	        <p class="name f-al f-f f-vc">'+s.name+'</p>\
					    	        <p class="amount f-f f-vc">'+(s.amount ? s.amount : '--')+'</p>\
					    	    </li>';
        			}
            	});
        	} 
        	return html;
        },
        //query data from websql, call back two times
        dbShop:function(obj){
        	var wall 		= $.query('#J_shoprcd_wall'),
        		sType  		= wall.attr('sType'),
        		hideBuyed 	= wall.attr('hideBuyed');
        		cSql = "SELECT COUNT(*) num FROM shop WHERE 1";
        	if(sType != 'all') cSql += ' AND stype='+sType;
        	if(hideBuyed == 'y')  cSql += ' AND buystat <> 1';
        	$.vv.db.select('shop', cSql, 
        					function(rsts, status){$.shopBook.countShopCb(rsts, status, obj);}, 
        					function(rsts, status){$.shopBook.countShopCb(rsts, status, obj);});
        },
        //obj={success:xxx, nPage:xxx, nSpage:xxx}
        countShopCb:function(rsts, status, obj) {
        	if(status != 0) {
        		//query count error
        		rst = {status:9, msg:'太尴尬了，查询失败'};
        		obj.success(rst, $.query('#J_shoprcd_wall'), obj.nPage, obj.nSpage);
        		return;
        	} else {
            	var wall 		= $.query('#J_shoprcd_wall'),
            		count 		= rsts[0].num,
            		sType  		= wall.attr('sType'),
            		hideBuyed 	= wall.attr('hideBuyed'),
	            	spageSize 	= 12,
	            	spageMax 	= 6,
	            	pageSize  	= spageSize * spageMax,
	            	$p 	= obj.nPage,
	            	$sp = obj.nSpage;
            	
	            	$p = $p > 0 ? $p : 1;
	            	$sp = $sp > 0 ? $sp : 1;

	            var	start = spageSize * (spageMax * ($p - 1) + ($sp-1));

        		obj['pageSize'] = pageSize;
        		obj['all_loaded'] = obj['last_subpage'] = 0;
        		if(count <= (start + spageSize)) obj['all_loaded'] = 1;
        		if($sp >= spageMax) obj['last_subpage'] = 1;
        		obj['p']  = $p;
        		obj['sp'] = $sp;
        		obj['pages'] = Math.ceil(count / pageSize);
        		
        		sql = "SELECT * FROM shop WHERE 1";
        		if(sType != 'all') sql += ' AND stype='+sType;
        		if(hideBuyed == 'y')  sql += ' AND buystat <> 1';
        		sql += ' ORDER BY add_time DESC LIMIT ' + start + ', ' + spageSize;
        		$.vv.log('count::'+count, 'sql::'+sql, obj);
            	$.vv.db.select('shop', sql, 
    					function(rsts, status){$.shopBook.selectShopCb(rsts, status, obj);}, 
    					function(rsts, status){$.shopBook.selectShopCb(rsts, status, obj);});
        	}
        },
        selectShopCb:function(rsts, status, obj){
        	if(status != 0) {
        		//query count error
        		var rst = {status:9, msg:'太尴尬了，查询失败'};
        		obj.success(rst, $.query('#J_shoprcd_wall'), obj.nPage, obj.nSpage);
        		return;
        	} else {
        		var rst = {status:0, msg:'', data:{'rlist':rsts, 'pageSize':obj.pageSize, 'p':obj.p, 'sp':obj.sp, 'pages':obj.pages,
        											'all_loaded': obj.all_loaded, 'last_subpage':obj.last_subpage}};
        		obj.success(rst, $.query('#J_shoprcd_wall'), obj.nPage, obj.nSpage);
        	}
        }
    };
    $.shopBook.init();
})(af);