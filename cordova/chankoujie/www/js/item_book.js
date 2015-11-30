(function($){
    $.itemBook = {
        cfg: {
        	panelInited:false
        },
        wallData:{
        	wallRcds:[]
        },
        
        init: function(options) {
        	$("#item_book").bind("loadpanel", function(e) {
        		$.itemBook.panelInit();
        		//page params
        		var params = $.query("#item_book").data('params'),
        		    type = params[0], 
        		    cid = params[1], 
        		    cname = params[2],
        		    wall = $.query('#J_item_wall');
        		    
        		if(type == 'new' || type == 'hot') {
        		    $('#item_book .J_navorder_wrap').hide();
        		    $('#J_item_wall_wrap').css('bottom', '0');
        		} else {
        		    $('#item_book .J_navorder_wrap').show();
                    $('#J_item_wall_wrap').css('bottom', '45px');
        		}
        		
        		if(type == 'hot') $.ui.setTitle('最热/'+cname);
        		else if (type == 'new') $.ui.setTitle('最新/'+cname);
        		else $.ui.setTitle(cname);
        		
                if(e.data.goBack) {
                    $.ckj.showHideWallRcds($.itemBook.wallData.wallRcds, '#J_item_wall');
                    return;
                };
        		
        		if( !$.ckj.cfg.backResetPanel && type ==  wall.attr('curType') && cid == wall.attr('curCid')) {
        		    if(wall.find('.wall_item').length > 0 || wall.attr('allLoaded') == 'y' || wall.attr('isLoading') == 'y') {
                        $.ckj.showHideWallRcds($.itemBook.wallData.wallRcds, '#J_item_wall');
                        return; 
                    }
        		}
        		
        		wall.attr({'curType':type, 'curCid': cid});
        		$.feed.resetWall('#J_item_wall', true);
        		$.itemBook.loadItems();
        		
        		//clear the prev cates
        		$.query('#J_item_b_c').html('');
        		$.query('#J_item_b_c_tri span').html('筛选');
        		$('#J_item_b_c_tri').trigger($.vv.cfg.clickEvt, {'close': true});
        		
        		$.itemBook.loadCates(type, cid);
    		});
        	$.query("#item_book").bind('unloadpanel', function(e) {
        	    if($.ckj.cfg.backResetPanel && e.data.goBack) {
        	        $.feed.resetWall('#J_item_wall', true);
        	    } else {
                    $.ckj.hideWallRcds($.itemBook.wallData.wallRcds, Math.abs($.query('#J_item_wall_wrap').scroller().scrollTop));
                }
    		});
        },
        panelInit: function(){
        	if( $.itemBook.cfg.panelInited === true ) return;
        	//wall scroller: scroll to load items
        	var wallWrap = $.query("#J_item_wall_wrap"), wall = $.query('#J_item_wall'), padding = parseInt($.vv.cfg.cWidth*0.04);
        	padding = padding >= 20 ? 20 : padding;
        	wall.attr({cols:2, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
        	$.feed.init('#J_item_wall');
        	
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
        	
        	$.vv.ui.toggleNavOrder('#item_book');
        	$.itemBook.selectCate();
        	$.itemBook.selectOrder();
        	$.itemBook.selectPrice();
        	
        	$.query('#item_book').attr('scrollTgt', '#J_item_wall_wrap');
        	$.itemBook.cfg.panelInited = true;
        },
        loadItems: function() {
        	var wall = $.query('#J_item_wall'), type = wall.attr('curType');
        	if(type == 'hot' || type == 'new') act= "day"+type;
        	else act = type;
        	var uri = '/?m=item_book&a='+act+'&cid='+wall.attr('curCid')+'&sort='+wall.attr('sort')+'&min_price='+wall.attr('minPrice')+'&max_price='+wall.attr('maxPrice');
        		
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        loadCates: function(type, cid) {
        	cid = cid || 0;
        	//1:from cache
        	var ckey = (type == 'hot' || type == 'new') ? 'item_'+type+'_reccates' : 'item_'+type+'_cates_'+cid, cates = $.vv.ls.get(ckey);
        	if(cates) {showCates(cates, cid); return true;}
        	
        	if(type == 'hot' || type == 'new') type= "day"+type;
        	
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=item_book&a=get_subcates&type='+type+'&cid='+cid,
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time: 3000}); 
                	} else {
                		showCates(rst.data.sub_cates, cid);
                    	$.vv.ls.set(ckey, rst.data.sub_cates, (type == 'dayhot' || type == 'daynew') ? $.ckj.cacheTime.itemHotNewCate : $.ckj.cacheTime.itemCate); //cache chtml
                	}
                },
                dataType: "json"
            });
        	
        	function showCates(cates, cid){
            	var chtml = $.ckj.renderPopupCates(cates, cid);
            	$.query('#J_item_b_c').html(chtml);
            	$.query('#J_item_b_c_tri').find('span').html(cates[cid]['name']);
        	}
        },
        selectCate: function(){
        	$.query('#J_item_b_c').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_item_b_c a').removeClass('active');
        		$this.addClass('active');
        		//load items
        		var wall 	= $.query('#J_item_wall');
        		var cid 	= $this.attr('cid');
        		wall.attr('curCid', cid);
        		$.feed.resetWall('#J_item_wall', true);
        		$.itemBook.loadItems();
        		$.query($(this).closest('div').attr('relTri')).trigger($.vv.cfg.clickEvt).find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        selectOrder: function(){
        	$.query('#J_item_orderrank').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_item_orderrank a').removeClass('active');
        		$this.addClass('active');
        		//load items
        		var wall 	= $.query('#J_item_wall');
        		var sort 	= $this.attr('sort');
        		wall.attr('sort', sort);
        		$.feed.resetWall('#J_item_wall', true);
        		$.itemBook.loadItems();
        		$.query($(this).closest('div').attr('relTri')).trigger($.vv.cfg.clickEvt).find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        selectPrice: function(){
        	$.query('#J_item_order_price').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_item_order_price a').removeClass('active');
        		$this.addClass('active');
        		//load items
        		var wall 	= $.query('#J_item_wall');
        		var price 	= $this.attr('price');
        		if(price == 'all'){wall.attr('minPrice', 0); wall.attr('maxPrice', 0);}
        		else if(price == 'cheap'){wall.attr('minPrice', 0); wall.attr('maxPrice', 20);}
        		else if(price == 'normal'){wall.attr('minPrice',20); wall.attr('maxPrice',50);}
        		else if(price == 'expensive'){wall.attr('minPrice',50); wall.attr('maxPrice',100);}
        		else if(price == 'luxry'){wall.attr('minPrice',100); wall.attr('maxPrice',0);}

        		$.feed.resetWall('#J_item_wall', true);
        		$.itemBook.loadItems();
        		$.query($(this).closest('div').attr('relTri')).trigger($.vv.cfg.clickEvt).find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        }
    };
    $.itemBook.init();
})(af);
