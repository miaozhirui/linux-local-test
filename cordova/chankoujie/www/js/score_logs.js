(function($) {
    $.scoreLogs = {
        cfg: {
        	panelInited:false
        },
        
        init: function(options) {
        	$("#score_logs").bind("loadpanel",function(e) {
        		if(e.data.goBack)return;
        		if(!$.ckj.user.id) { $.ui.loadContent('#user_login',false,0,$.ckj.cfg.formTrans); return;}//must login
        		$.scoreLogs.panelInit();
        		$.feed.resetWall('#J_scorelog_wall', true);
        		$.scoreLogs.loadScoreLogs();
        		$.scoreLogs.getLeftScore();
    		});
        },
        
        panelInit:function() {
        	if( $.scoreLogs.cfg.panelInited === true ) return;
        	
        	var wallWrap = $.query("#J_scorelog_wall_wrap"), wall = $.query('#J_scorelog_wall'), padding=0;
            wall.attr({'masonry':'n','cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-170});
            $.feed.init('#J_scorelog_wall');
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
            
            $.vv.ui.toggleNavOrder('#score_logs');
            $.scoreLogs.selectPeroid();
            $.query('#score_logs').attr('scrollTgt', '#J_scorelog_wall_wrap');

        	$.scoreLogs.cfg.panelInited = true;
        },
        
        selectPeroid: function(){
        	$.query('#J_scorelog_timesec').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_scorelog_timesec a').removeClass('active');
        		$this.addClass('active');
        		//load scorelogs
        		var wall 	= $.query('#J_scorelog_wall');
        		var period 	= $this.attr('period');
        		wall.attr('period', period);
        		$.feed.resetWall('#J_scorelog_wall', true);
        		$.scoreLogs.loadScoreLogs();
        		$.query($(this).closest('div').attr('relTri')).trigger('click').find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        
        loadScoreLogs: function() {
        	var wall = $.query('#J_scorelog_wall');
        	var uri  =  '/?m=score&a=logs&period='+wall.attr('period');
        	wall.attr('dataUri', uri);
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
        
        getLeftScore: function(){
            $.ajax({
                url: $.ckj.cfg.mapi + '/?m=score&a=left_score',
                type:'GET',
                dataType: "json",
                success: function(r){
                    if(r.status == 0){
                        $('#JleftScore e').html(r.data.score);
                    }
                }
            })
        },
        
        renderScoreLogs:function(data){
        	var html = '';
        	if(data.rlist.length > 0) {
				$.each(data.rlist, function(idx, o){
					html += '<li class="scorelog f-f f-vc">\
					            <p class="action">'+o.action+'</p>\
					            <p class="score '+(o.score > 0 ? 'income' : 'outpay')+'">'+(o.score > 0 ? '+' : '') + o.score+'</p>\
					            <p class="time">'+o.add_time+'</p>\
					        </li>';
    			});
        	} 
        	return html;
        },
    };
    
    $.scoreLogs.init();
})(af);
