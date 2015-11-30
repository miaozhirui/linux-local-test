(function($){
    $.workBook = {
        cfg: {
            idType:'',
            id:0,
        	panelInited:false
        },
        init: function(options) {
        	$("#work_book").bind("loadpanel", function(e) {
        	    $.workBook.panelInit();
        		var params = $.query("#work_book").data('params');
        		if(params.length > 1) { 
        		    var idType = params[0], 
        		        id  = params[1]; 
        		} else { 
        		    var idType = '', 
        		        id = 0; 
        		}
        		
        		if(e.data.goBack && $.workBook.cfg.id == id && $.workBook.cfg.idType == idType) {
                    return;
        		}
        		
        		$.workBook.cfg.id = id;
        		$.workBook.cfg.idType = idType;
        		
        		$.query('#J_work_wall').attr({'idType': idType, 'curId': id, 'sort':'id'});
        		$.feed.resetWall('#J_work_wall', true);
        		$.workBook.loadWorks();
        		
        		//other reset
        		$.query('#J_work_orderrank_tri').find('span').html('最新')
        		$.query('#J_work_orderrank a').removeClass('active');
        		$.query('#J_work_orderrank a[sort=id]').addClass('active');
        		
        		//set title
        		if(!idType) $.ui.setTitle('全部菜谱作品');
        		else if(idType == 'rid') $.ui.setTitle('菜谱作品');
        		else if(idType == 'uid') {
        			if(id == $.ckj.usr.id) $.ui.setTitle('我的菜谱作品');
        			else  $.ui.setTitle('街友上传的菜谱作品');
        		}
    		});
    		
            $.query("#work_book").bind('unloadpanel', function(e) {
                if(e.data.goBack) {
                    $.feed.resetWall('#J_work_wall', true);
                }
            });
        },
        
        panelInit: function(){
        	if( $.workBook.cfg.panelInited === true ) return;
        	var wallWrap = $.query("#J_work_wall_wrap"), wall = $.query('#J_work_wall');
        	wall.attr({'initHeight':$.vv.cfg.cHeight-135});
        	var wWidth = $.vv.cfg.cWidth * 0.86;
        	    paddingLR = ($.vv.cfg.cWidth - wWidth) / 2;
        	paddingLR = paddingLR >= 30 ? 30 : paddingLR;
        	wall.css('padding', paddingLR + 'px ' + paddingLR + 'px 10px ' + paddingLR + 'px');
        	$.feed.init('#J_work_wall');
        	
        	var scroller = wallWrap.scroller({scrollBars: $.ckj.cfg.scrollBar, vScrollCSS: "afScrollbar" });
        	
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
            
        	$.vv.ui.toggleNavOrder('#work_book');
        	$.comOp.like('#work_book');
        	$.comOp.unLike('#work_book');
        	$.workBook.selectOrder();
        	
        	$.query('#work_book .J_returnToTop').bind('click', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.query($(this).attr('relScroller')).scroller().scrollToTop(300);
        	});
        	
        	$.query('#work_book').attr('scrollTgt', '#J_work_wall_wrap');
        	$.workBook.cfg.panelInited = true;
        },
        
        selectOrder: function(){
        	$.query('#J_work_orderrank').on('click', 'a', function(e){
        		e.stopPropagation();e.preventDefault();
        		//switch on tap
        		var $this 	= $(this);
        		$.query('#J_work_orderrank a').removeClass('active');
        		$this.addClass('active');
        		//load works
        		var wall 	= $.query('#J_work_wall');
        		var sort 	= $this.attr('sort');
        		wall.attr('sort', sort);
        		$.feed.resetWall('#J_work_wall', true);
        		$.workBook.loadWorks();
        		$.query($this.closest('div').attr('relTri')).trigger($.vv.cfg.clickEvt).find('span').html($.vv.util.equalSubStr($this.text(), 5));
        	});
        },
        loadWorks: function() {
        	var wall = $.query('#J_work_wall');
        	var uri = '/?m=work&a=book&'+wall.attr('idType')+'='+wall.attr('curId')+'&sort='+wall.attr('sort');
        	wall.attr('dataUri', uri);	
        	$.query(wall.attr('triggerBar')).trigger('click');
        },
    };
    $.workBook.init();
})(af);
