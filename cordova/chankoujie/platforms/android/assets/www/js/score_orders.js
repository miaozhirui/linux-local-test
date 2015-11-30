(function($) {
    $.scoreOrders = {
        cfg: {
        	panelInited:false
        },
        init: function(options) {
        	$("#score_orders").bind("loadpanel",function(e){
        		if(e.data.goBack)return;
        		if(!$.ckj.user.id) { $.ui.loadContent('#user_login',false,0,$.ckj.cfg.formTrans); return;}//must login
        		$.scoreOrders.panelInit();
        		$.feed.resetWall('#J_scoreorder_wall', true);
        		$.scoreOrders.loadScoreOrders();
    		});
        },
        
        panelInit:function() {
        	if( $.scoreOrders.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_scoreorder_wall_wrap"), wall = $.query('#J_scoreorder_wall'), padding=0;
            wall.attr({'masonry':'n','cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-135});
            $.feed.init('#J_scoreorder_wall');
            
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
            
            $.vv.ui.toggleNavOrder('#score_orders');
            $.scoreOrders.selectPeroid();
            $.query('#score_orders').attr('scrollTgt', '#J_scoreorder_wall_wrap');

        	$.scoreOrders.cfg.panelInited = true;
        },
        selectPeroid: function(){
        	$.query('#J_scoreorder_timesec').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_scoreorder_timesec a').removeClass('active');
        		$this.addClass('active');
        		//load scoreorders
        		var wall 	= $.query('#J_scoreorder_wall');
        		var period 	= $this.attr('period');
        		wall.attr('period', period);
        		$.feed.resetWall('#J_scoreorder_wall', true);
        		$.scoreOrders.loadScoreOrders();
        		$.query($(this).closest('div').attr('relTri')).trigger('click').find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        loadScoreOrders: function() {
        	var wall = $.query('#J_scoreorder_wall');
        	var uri  =  '/?m=score&a=index&period='+wall.attr('period');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        renderScoreOrders:function(data){
        	var html = '';
        	if(data.rlist.length > 0) {
				$.each(data.rlist, function(idx, o){
					html += '<li class="score_order">\
					            <p><span class="label">订单号:</span><span class="val">'+o.order_sn+'</span></p>\
					            <p><span class="label">兑换商品:</span><span class="val"><a class="title" href="#eitem_detail/'+o.item_id+'">'+o.item_name+'</a></span></p>\
					            <p class="">\
					                <span class="label">消费馋豆:</span>\
					                <span class="val"><i>'+o.order_score+'</i></span>\
					            </p>\
					            <p><span class="label">下单时间:</span><span class="val">'+o.add_time+'</span></p>\
					            <p>\
					                <span class="label">订单状态:</span>\
					                <span class="val '+ (o.status == 1 ? 'green' : 'pink') +'">'+ (o.status == 1 ? '已完成' : '处理中...') +'</span>\
					            </p>\
					        </li>';
    			});
        	} 
        	return html;
        },
    };
    
    $.scoreOrders.init();
})(af);
