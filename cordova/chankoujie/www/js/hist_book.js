(function($){
    $.histBook = {
        cfg: {
            panelInited:false
        },
        hmap:{1:{'sname':'recipe_detail', 'name':'菜谱', 'fa':'fa-file-text', 'color':'#007500'}, 2:{'sname':'rmenu_detail', 'name':'菜单', 'fa':'fa-clipboard', 'color':'#A23400'}, 
        	  3:{'sname':'work_detail', 'name':'作品', 'fa':'fa-copy', 'color':'#548C00'}, 4:{'sname':'stuff_detail', 'name':'食材', 'fa':'fa-banana', 'color':'#02C874'}, 
        	  5:{'sname':'item_detail', 'name':'食品', 'fa':'fa-hdd-o', 'color':'#D9B300'}, 6:{'sname':'album_detail', 'name':'吃柜', 'fa':'fa-archive', 'color':'#FF8F59'},
        	  7:{'sname':'store_detail', 'name':'好吃店', 'fa':'fa-home', 'color':'#921AFF'}, 8:{'sname':'brand_detail', 'name':'品牌', 'fa':'fa-flag', 'color':'#E800E8'}, 
        	  9:{'sname':'rstrnt_detail', 'name':'餐馆', 'fa':'fa-cutlery', 'color':'#9F5000'}, 10:{'sname':'rstimg_detail', 'name':'餐馆附图', 'fa':'fa-picture-o', 'color':'#FFAF60'}, 
        	  11:{'sname':'group_detail', 'name':'吃群', 'fa':'fa-group', 'color':'#EA0000'}, 12:{'sname':'subject_detail', 'name':'主题', 'fa':'fa-tag', 'color':'#F00078'},
        	  13:{'sname':'faq_detail', 'name':'问题', 'fa':'fa-question-circle', 'color':'#8F4586'}, 14:{'sname':'diary_detail', 'name':'日记', 'fa':'fa-book-alt', 'color':'#0000E3'}, 
        	  15:{'sname':'space_index', 'name':'街友', 'fa':'fa-user2', 'color':'#00CACA'},
        	 },
        init: function(options) {
            $.query("#hist_book").bind("loadpanel", function(e) {
                if(e.data.goBack){ return; }
                $.histBook.panelInit();
                $.feed.resetWall('#J_histrcd_wall', true);
                $.histBook.loadHistRcds();
            });
            
            $.query("#hist_book").bind('unloadpanel', function(e) {
                if(e.data.goBack) {
                    $.feed.resetWall('#J_histrcd_wall', true);
                } 
            });
        },
        
        panelInit: function(){
            if( $.histBook.cfg.panelInited === true ) return;
            
            var wallWrap = $.query("#J_histrcd_wall_wrap"), wall = $.query('#J_histrcd_wall'), padding=0;
            padding = parseInt($.vv.cfg.cWidth*0.0);
            padding = padding >= 20 ? 20 : padding;
            wall.attr({'cols':1, 'wOffX': 0, 'wOffY': padding, 'wWallPad': padding, 'initHeight':$.vv.cfg.cHeight-125});
            
            $.feed.init('#J_histrcd_wall');
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
            
            $.vv.ui.moreBlock('#hist_book');
            $.histBook.selectType();
            $.histBook.delHist();
            
            $.query('#hist_book').attr('scrollTgt', '#J_histrcd_wall_wrap');

            if($.os.ios8)$('#hist_book .J_block_wrap').attr('init_height', '35.5px');
            $.histBook.cfg.panelInited = true;
        },
        
        selectType: function(){
            $.query('#J_histrcd_type').on('click', 'a', function(e){
                e.stopPropagation();e.preventDefault();
                //switch on tap
                var $this   = $(this);
                var showTri = $this.closest('.J_block_wrap').find('.J_block_show');
                if(showTri.attr('unfolded') == 'y') {
                    $.query('#J_histrcd_type a').removeClass('active');
                    $this.addClass('active');
                    $this.insertAfter($.query('#J_histrcd_type a:first-child'));
                    //load histrcds
                    var wall    = $.query('#J_histrcd_wall');
                    	rtype     = $this.attr('rtype');
                    wall.attr('rType', rtype);
                    $.feed.resetWall('#J_histrcd_wall', true);
                    $.histBook.loadHistRcds();
                }
                showTri.trigger('click'); 
            });
        },
        delHist: function(){
        	$.query('#hist_book').on('click', '.J_delhist', function(e){
        		e.stopPropagation();e.preventDefault();
        		var rType = $.query('#J_histrcd_wall').attr('rType');
    				sql = 'DELETE FROM history';
    			if(rType != 'all') sql += ' WHERE rtype='+rType;
    			$.vv.db.exec('history', sql, [],
    						 function(){$.query('#J_histrcd_wall').empty();},
    						 function(){ $.vv.tip({icon:'error', content:'抱歉， 操作失败，请稍后重试！', time:3000}); }
    			);
        	});
        },
        loadHistRcds: function() {
            $.query($.query('#J_histrcd_wall').attr('triggerBar')).trigger('click');
        },
        renderHist: function(data, wall) {
        	var html = '';
        	if(data.rlist.length > 0) {
        		var hm = $.histBook.hmap;
        		$.each(data.rlist, function(idx, h) {
        			if(hm[h.rtype]) {
	        			html += '<a href="#'+hm[h.rtype]['sname']+'/'+h.oid+'" class="hist_rcd f-f f-vc" data-dpressed="true">\
		        		        	<i class="fa '+hm[h.rtype]['fa']+'" style="color:'+hm[h.rtype]['color']+'"></i>\
		        		        	<span class="type" style="color:'+hm[h.rtype]['color']+'">'+hm[h.rtype]['name']+'</span>\
		        		        	<span class="title f-al">'+h.title+'</span>\
		        		        	<span class="time">'+h.add_time.split(' ')[0]+'</span>\
		        		        </a>';
        			}
            	});
        	} 
        	return html;
        },
        //query data from websql, call back two times
        dbHist:function(obj){
        	var rType  	= $.query('#J_histrcd_wall').attr('rType');
        		cSql = "SELECT COUNT(*) num FROM history";
        	if(rType != 'all') cSql += ' WHERE rtype='+rType;
        	$.vv.db.select('history', cSql, 
        					function(rsts, status){$.histBook.countHistCb(rsts, status, obj);}, 
        					function(rsts, status){$.histBook.countHistCb(rsts, status, obj);});
        },
        //obj={success:xxx, nPage:xxx, nSpage:xxx}
        countHistCb:function(rsts, status, obj) {
        	if(status != 0) {
        		//query count error
        		rst = {status:9, msg:'太尴尬了，查询失败'};
        		obj.success(rst, $.query('#J_histrcd_wall'), obj.nPage, obj.nSpage);
        		return;
        	} else {
        		var count 		= rsts[0].num;
            	var rType  		= $.query('#J_histrcd_wall').attr('rType'),
	            	spageSize 	= 15,
	            	spageMax 	= 30,
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
        		
        		sql = "SELECT * FROM history";
        		if(rType != 'all') sql += ' WHERE rtype='+rType;
        		sql += ' ORDER BY add_time DESC LIMIT ' + start + ', ' + spageSize;
        		$.vv.log('count::'+count, 'sql::'+sql, obj);
            	$.vv.db.select('history', sql, 
    					function(rsts, status){$.histBook.selectHistCb(rsts, status, obj);}, 
    					function(rsts, status){$.histBook.selectHistCb(rsts, status, obj);});
        	}
        },
        selectHistCb:function(rsts, status, obj){
        	if(status != 0) {
        		//query count error
        		var rst = {status:9, msg:'太尴尬了，查询失败'};
        		obj.success(rst, $.query('#J_histrcd_wall'), obj.nPage, obj.nSpage);
        		return;
        	} else {
        		var rst = {status:0, msg:'', data:{'rlist':rsts, 'pageSize':obj.pageSize, 'p':obj.p, 'sp':obj.sp, 'pages':obj.pages,
        											'all_loaded': obj.all_loaded, 'last_subpage':obj.last_subpage}};
        		obj.success(rst, $.query('#J_histrcd_wall'), obj.nPage, obj.nSpage);
        	}
        }
    };
    
    $.histBook.init();
})(af);
