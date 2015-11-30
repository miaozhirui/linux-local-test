(function($){
    $.rstimgDtl = {
    	cfg:{
    		id:0,
    		loadingRstimg:'y',
    		panelInited:false
    	},
    	
        init: function(options){
        	$("#rstimg_detail").bind("loadpanel",function(e){
        		if(e.data.goBack) {
        		    $('#rstimg_detail').css('opacity', '1');
        		    return;
        		}
        		var params = $.query("#rstimg_detail").data('params'), //avoid loading the same
        			rstimgId = params[0];
        		if(rstimgId == $.rstimgDtl.cfg.id) {
        		    $('#rstimg_detail').css('opacity', '1');
        		    return;
        		}
        		else $.rstimgDtl.cfg.id = rstimgId;
        		
        		$.rstimgDtl.panelInit();
        		
        		$.query("#rstimg_detail").scroller().scrollToTop(0);
        		$.rstimgDtl.loadRstimg($.rstimgDtl.cfg.id);
    		});
        },
        
        panelInit: function(){
        	if( $.rstimgDtl.cfg.panelInited === true ) return;
        	var wallWrap = $.query('#rstimg_detail');
        	wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
        	wallWrap.addClass('scroll_nobar');
        	
        	wallWrap.on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent($(this).attr('tourl'),false,false,$.ckj.cfg.cmtTrans);
        	});
        	
        	$('#rstimg_detail').on('click', '#J_rstimgBadReport', function(){
        	    $.ckj.badReport('举报餐馆图片', 'rstimg', $.rstimgDtl.cfg.id);
        	});
        	
        	$.user.follow('#rstimg_detail');
        	$.user.unFollow('#rstimg_detail');
        	$.comOp.like('#rstimg_detail');
        	$.comOp.unLike('#rstimg_detail');
        	
        	$.vv.ui.onPressed('#J_rstimg_dt_ops');
        	
        	$.query('#rstimg_detail').attr('scrollTgt', '#rstimg_detail');
        	$.rstimgDtl.cfg.panelInited = true;
        },
        
        loadRstimg:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=rstimg&a=detail&id='+id,
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		//$.vv.log(rst);
                		$.vv.tip({close:true});
                		var rstimg = rst.data.rstimg, likers = rst.data.likers, cmts=rst.data.cmts, html ='', imgHtml='';	
                		
                		$.query('#rstimg_detail *[data-id]').attr('data-id', rstimg.id);
                		//rstimg info
                		$.query('#J_rstimg_dt_bimg').attr('src', rstimg.img);
                		$.query('#J_rstimg_dt_rciName').html(rstimg.rname);
                		
                		if(rst.data.hasLiked) { 
                			$.query('#J_rstimg_dt_ops .like').replaceClass('J_like', 'J_unlike');
                			$.query('#J_rstimg_dt_ops .like .fa').replaceClass('fa-heart-add', 'fa-heart-del');
                		} else {
                			$.query('#J_rstimg_dt_ops .like').replaceClass('J_unlike', 'J_like');
                			$.query('#J_rstimg_dt_ops .like .fa').replaceClass('fa-heart-del', 'fa-heart-add');
                		}
                		$.query('#J_rstimg_dt_ops .J_like_n').html(rstimg.likes);
                		$.query('#J_rstimg_dt_toRstrnt').attr('href', '#rstrnt_detail/'+rstimg.rid);

                		var sHtml = '', fHtml=''; 
                		if(rstimg.state)sHtml = '<p class="intro"><strong>“</strong>'+rstimg.state+'<strong>”</strong></p>';
                		fHtml = $.ckj.renderFollowShipBtn(rstimg.uid, $.ckj.user.id, rst.data.authorShip);
                		html= ' <a href="#space_index/'+rstimg.uid+'"><img class="avatar pabs" src="'+rstimg.avatar+'"></a>\
			                	<div>\
			                        <p class="uname cfx">\
			                            <i class="ofh pink">'+rstimg.uname+'</i><i class="time">'+rstimg.add_time+'分享</i>\
			                        </p>\
			                        '+fHtml+'\
			                        <p class="allrstimg">\
			                            <a href="#rstimg_book/user/'+rstimg.uid+'" data-pressed="true">Ta的全部餐馆附图<i class="fa fa-chevron-right"></i></a>\
			                        </p>\
			                        '+sHtml+'\
			                    </div>';
                		$.query('#J_rstimg_dt_meta').html(html);
                		
                		//sum_cmts
            			html='';
                		if(cmts.length > 0) {
                			$.each(cmts, function(idx, c){
                				html += '<li><a class="uname" href="#space_index/'+c.uid+'">'+c.uname+':</a>\
                				'+c.info+'<span class="atime">'+c.add_time+'</span></li>';
                			});
                			$.query('#J_rstimg_dt_cmts').html(html).show();
                		} else {
                			$.query('#J_rstimg_dt_cmts').html(html).hide();
                		}
                		
                		$('#rstimg_detail').css('opacity', '1');
                		
                		$.query('#rstimg_detail .J_tocmt').attr('tourl', '#comment_book/rstimg/'+rstimg.id);
                		$.query('#rstimg_detail .J_tocmt .num').html(rstimg.comments);
                		$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':10, 'title':r.rname, 'img':r.img});}, null, [rstimg]);
                	}
                	
                	$.rstimgDtl.cfg.loadingRstimg = 'n';
                },
                dataType: "json"
            });
        }
    };
    $.rstimgDtl.init();
})(af);
