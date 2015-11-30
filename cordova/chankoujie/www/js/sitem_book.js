(function($){
    $.sitemBook = {
        cfg: {
        	panelInited:false
        },
        wallData:{
        	wallRcds:[]
        },
         
        init: function(options) {
        	$.query("#sitem_book").bind("loadpanel", function(e) {
        		if(e.data.goBack)return;
        		$.sitemBook.panelInit();
        		
        		var params = $.query("#sitem_book").data('params');
        		var cid = params[0], wall = $.query('#J_sitem_wall');

        		wall.attr({'curCid': cid, 'sort':''});        		
        		
        		$.feed.resetWall('#J_sitem_wall', true);
        		$.sitemBook.loadSitems();

        		//other reset
        		$.query('#J_sitem_orderrank_tri').find('span').html('排序');
        		$.query('#J_sitem_orderrank a').removeClass('active');
        		
        		$.ui.setTitle('积分礼品');
    		});
    		
    		$.query("#sitem_book").bind('unloadpanel', function(e) {
                if(e.data.goBack) {
                    $.feed.resetWall('#J_sitem_wall', true);
                } 
            });
        },
        panelInit: function(){
        	if( $.sitemBook.cfg.panelInited === true ) return;
        	
        	var usrCfg = $.vv.ls.get('usrCfg'), bMode='masonry', cols=2, padding = 0,
        		wallWrap = $.query("#J_sitem_wall_wrap"), wall = $.query('#J_sitem_wall');
        	padding = parseInt($.vv.cfg.cWidth * 0.05);
        	padding = padding >= 20 ? 20 : padding;
        	wall.attr({'cols':cols, 'wOffX': padding, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135}).css('padding', padding+'px');;
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
            
        	$.feed.init('#J_sitem_wall');

        	$.vv.ui.toggleNavOrder('#sitem_book');
        	$.sitemBook.selectCate();
        	$.sitemBook.selectOrder();
        	$.sitemBook.loadCates();
        	$.query('#sitem_book').attr('scrollTgt', '#J_sitem_wall_wrap');
        	$.sitemBook.cfg.panelInited = true;
        },
        loadCates: function(cid){
        	var ckey = 'sitem_cates', cates = $.vv.ls.get(ckey);
        	if(cates) {showCates(cates); return true;}
        	
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=exchange&a=sitem_cates',
                success: function(rst) {
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time: 3000}); 
                	} else {
                		showCates(rst.data.cates);
                		$.vv.ls.set(ckey, rst.data.cates, $.ckj.cacheTime.sitemCate);
                	}
                },
                dataType: "json",
            });
        	
        	function showCates(cates){
        		var chtml = $.ckj.renderPopupCates(cates);
        		$.query('#J_sitem_b_c').html(chtml);
        	}
        },
        loadSitems: function() {
        	var wall = $.query('#J_sitem_wall'),
        	    uri = '/?m=exchange&a=sitem_book&cid='+wall.attr('curCid')+'&sort='+wall.attr('sort');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        selectCate: function(){
        	$.query('#J_sitem_b_c').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_sitem_b_c a').removeClass('active');
        		$this.addClass('active');
        		//load sitems
        		var wall 	= $.query('#J_sitem_wall');
        		var cid 	= $this.attr('cid');
        		wall.attr('curCid', cid);
        		$.feed.resetWall('#J_sitem_wall', true);
        		$.sitemBook.loadSitems();
        		$.query($(this).closest('div').attr('relTri')).trigger('click').find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        selectOrder: function(){
        	$.query('#J_sitem_orderrank').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_sitem_orderrank a').removeClass('active');
        		$this.addClass('active');
        		//load sitems
        		var wall 	= $.query('#J_sitem_wall');
        		var sort 	= $this.attr('sort');
        		wall.attr('sort', sort);
        		$.feed.resetWall('#J_sitem_wall', true);
        		$.sitemBook.loadSitems();
        		$.query($this.closest('div').attr('relTri')).trigger('click').find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        renderSitems: function(data, wall){
        	var html = '', mb=parseInt(wall.attr('wWallPad')), mr=mb, sw=($.vv.cfg.cWidth - 3*mb)/2, imW=sw-20, imH=imW-16;
        	if(data.rlist.length > 0) {
				$.each(data.rlist, function(idx, it){
					html += '<div class="wall_sitem" style="width:'+sw+'px;margin-bottom:'+mb+'px; margin-right:'+mr+'px">\
							 	<a href="#sitem_detail/'+it.id+'">\
					                <img class="pic" src="'+it.img+'" style="height:'+imH+'px" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);" >\
					            </a>\
					            <div class="intro">'+it.title+'</div>\
					            <div class="einfo cfx">\
					                <span class="beans fl">'+it.score+'<img src="./img/score.png"></span> <a href="#sitem_detail/'+it.id+'" class="exch fr" data-pressed="true">去兑换<i class="fa fa-angle-right"></i></a>\
					            </div>\
					        </div>';
    			});
        	} 
        	return html;
        }
    };
    $.sitemBook.init();
})(af);