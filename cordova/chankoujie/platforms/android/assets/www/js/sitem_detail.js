(function($){
    $.sitemDtl = {
        cfg: {
        	oid: 0,
            id: 0,
            panelInited: false,
            loadingSitem: 'n',
            swipeInited: false
        },

        init: function(options) {
            $("#sitem_detail").bind("loadpanel",function(e) {
                var params = $.query("#sitem_detail").data('params'),
                    sId  = params[0];
                $.sitemDtl.cfg.oid 	= $.sitemDtl.cfg.id;
                $.sitemDtl.cfg.id 	= sId;
                
                $.sitemDtl.panelInit();
                
                if($.sitemDtl.cfg.oid != $.sitemDtl.cfg.id)$.query("#sitem_detail").scroller().scrollToTop(0);
                $.sitemDtl.loadSitem($.sitemDtl.cfg.id);
            });
        },
        
        panelInit:function() {
            if( $.sitemDtl.cfg.panelInited === true ) return;
            
            var wallWrap = $.query('#sitem_detail');
            wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
            
            $("#J_sitemdt_swipes").swipe({
                delay: 0, //don't auto loop
                sTime: 300,
                idxSelector: '#J_sitemdt_swipetabs > li',
                wrap : false,
            });
            
            $.query('#sitem_detail').on('click', '#J_sitemdtl_ecbtn', function(e){
            	e.stopPropagation();e.preventDefault();
            	var num = parseInt($.query('#J_sitemdtl_exchnum').val());
            	if(num < 1) {
            		$.vv.tip({content:'请填写您要兑换的数量哦~'});
            		$.query('#J_sitemdtl_exchnum').focus();
            		return;
            	} else {
                    $.ui.loadContent('#gift_exchange/'+$.sitemDtl.cfg.id+'/'+num+'/'+$.query('#J_sitemdtl_title').text(), false, 0, $.ckj.cfg.cmtTrans);
            	}
            });
            
            $.query('#sitem_detail').attr('scrollTgt', '#sitem_detail');
            $.sitemDtl.cfg.panelInited = true;
        },
        
        loadSitem:function(id) {
            $.vv.tip({icon:'loading'});
            $.ajax( {
                url: $.ckj.cfg.mapi+'/?m=exchange&a=detail&id='+id,
                success: function(rst) {
                    if(rst.status != 0) { //error happened
                        $.vv.tip({ content:rst.msg, time:3000}); 
                    } else {
                        $.vv.tip({close:true});
                        var it = rst.data.item, html = '';
                        if($.sitemDtl.cfg.oid != $.sitemDtl.cfg.id) {
	                        $.query('#J_sitemdtl_img').attr('src', it.img);
	                        $.query('#J_sitemdtl_title').text(it.title);
	                        $.query('#J_sitemdtl_stock').text(it.stock);
	                        $.query('#J_sitemdtl_buy_num').text(it.buy_num);
	                        $.query('#J_sitemdtl_user_num').text(it.user_num);
	                        $.query('#J_sitemdtl_score').text(it.score);
	                        $.query('#J_sitemdtl_intro').html(it.desc ? it.desc : '暂无说明');
	                        $.query('#J_sitemdtl_exchnum').val(1);
                        } else {
                        	$.query('#J_sitemdtl_stock').text(it.stock);
	                        $.query('#J_sitemdtl_buy_num').text(it.buy_num);
                        	$.query('#J_sitemdtl_exchnum').val(1);
                        }
                    }
                    
                    $.sitemDtl.cfg.loadingSitem = 'n';
                },
                dataType: "json",
                timeout:$.ckj.cfg.timeOut,
                error:function(xhr, err){
                    if(err == 'timeout')$.vv.tip({ content:'请求超时，请稍后再试!'});
                    else $.vv.tip({ content:'请求出错，请稍后再试!'});
                }
            });
        }
    };
    $.sitemDtl.init();
})(af);
