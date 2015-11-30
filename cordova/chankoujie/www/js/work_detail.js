(function($){
    $.workDtl = {
    	cfg:{
    		id:0,
    		loadingWork:'y',
    		panelInited:false
    	},
    	shareInfo: {
    		stitle:'',
    		sname:'',
    		imgUrl:'',
    		dtlUrl:''
    	},
    	shareMsg: [	 {'pre':'呀呀呀， 这个', 'suf':'叫人口水直流呀！'}, 
	    	         {'pre':'这个', 'suf':'做得很有吃相哦， 我也要做来吃吃看！'}
    	         ],
    	         
        init: function(options){
        	$("#work_detail").bind("loadpanel",function(e){
        		if(e.data.goBack){
        		    $('#work_detail').css('opacity', '1');
        		    return;
        		}
        		var params = $.query("#work_detail").data('params'), //avoid loading the same
        			workId = params[0];
        		if(workId == $.workDtl.cfg.id){
        		    $('#work_detail').css('opacity', '1');
        		    return;
        		}
        		else $.workDtl.cfg.id = workId;
        		
        		$.workDtl.panelInit();
        		
        		$.query("#work_detail").scroller().scrollToTop(0);
        		$.workDtl.loadWork($.workDtl.cfg.id);
    		});
    		
    		//bad report
            $('#work_detail').on('click', '.J_moreOps', function(e) {
                e.stopPropagation();e.preventDefault();
                $('#afui').actionsheet(
                    [{
                        text: '分享...',
                        cssClasses: '',
                        handler: function () {
                            setTimeout( function(){
                                    $.ckj.sShare($.workDtl.shareInfo, $.workDtl.shareMsg);
                                }, 
                                8
                            ); //ios workaround
                        }
                    }, {
                        text: '举报...',
                        cssClasses: '',
                        handler: function () {
                            $.ckj.badReport('举报菜谱作品', 'work', $.workDtl.cfg.id);
                        }
                    }]
                );
            });
        },
        
        panelInit: function(){
        	if( $.workDtl.cfg.panelInited === true ) return;
        	var wallWrap = $.query('#work_detail');
        	wallWrap.addClass('scroll_nobar');
        	wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
        	wallWrap.on('click', '.J_socialShareWork', function(e){
        		e.stopPropagation();e.preventDefault();
        		
        	});
        	
        	wallWrap.on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent($(this).attr('tourl'),false,false,$.ckj.cfg.cmtTrans);
        	});
        	
        	$.user.follow('#work_detail');
        	$.user.unFollow('#work_detail');
        	$.comOp.like('#work_detail');
        	$.comOp.unLike('#work_detail');
        	
        	$.vv.ui.onPressed('.J_wk_dt_top');
        	$.query('#work_detail').attr('scrollTgt', '#work_detail');
        	$.workDtl.cfg.panelInited = true;
        },
        
        loadWork:function(id) {
        	$.vv.tip({icon:'loading'});
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=work&a=detail&id='+id,
                dataType: "json",
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		//$.vv.log(rst);
                		$.vv.tip({close:true});
                		var work = rst.data.work, likers = rst.data.likers, cmts=rst.data.cmts, html ='', imgHtml='';	
                		
                		$.workDtl.shareInfo = {'stitle':work.rname,  'sname':work.rname, 
                								'imgUrl':work.img, 'dtlUrl':$.ckj.cfg.siteUrl+'/work/'+work.id};
                		$.query('#work_detail *[data-id]').attr('data-id', work.id);
                		//work info
                		$.query('#J_work_dt_bimg').attr('src', work.img);
                		$.query('#J_work_dt_rciName').html(work.rname);
                		
                		if(rst.data.hasLiked) { 
                			$.query('#J_work_dt_ops .like').replaceClass('J_like', 'J_unlike');
                			$.query('#J_work_dt_ops .like .fa').replaceClass('fa-heart-add', 'fa-heart-del');
                		} else {
                			$.query('#J_work_dt_ops .like').replaceClass('J_unlike', 'J_like');
                			$.query('#J_work_dt_ops .like .fa').replaceClass('fa-heart-del', 'fa-heart-add');
                		}
                		$.query('#J_work_dt_ops .J_like_n').html(work.likes);
                		$.query('#J_work_dt_toRecipe').attr('href', '#recipe_detail/'+work.rid);

                		var sHtml = '', fHtml=''; 
                		if(work.state)sHtml = '<p class="intro"><strong>“</strong>'+work.state+'<strong>”</strong></p>';
                		fHtml = $.ckj.renderFollowShipBtn(work.uid, $.ckj.user.id, rst.data.authorShip);
                		html= ' <a href="#space_index/'+work.uid+'"><img class="avatar pabs" src="'+work.avatar+'"  onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);" /></a>\
			                	<div>\
			                        <div class="uname cfx">\
			                            <p class="ofh pink fl">'+work.uname+'</p>'+fHtml+'\
			                        </div>\
			                        <p class="allwork cfx">\
			                            <i class="time">'+work.add_time+'分享</i>\
			                            <a href="#work_book/uid/'+work.uid+'" data-pressed="true">Ta的全部作品<i class="fa fa-angle-right"></i></a>\
			                        </p>\
			                    </div>'+sHtml;
                		$.query('#J_work_dt_meta').html(html);

            			//likers
            			html='', imgHtml = '';
                		if(likers.length > 0){
                			html = '<h1 class="title users_tit">喜欢该作品的街友 <a href="#user_book/work_likers/'+work.id+'">全部 <i class="fa fa-chevron-right"></i></a></h1>';
                			$.each(likers, function(idx, u){
                				imgHtml += '<a href="#space_index/'+u.uid+'"><img src="'+u.avatar+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/></a>';
                			});
                			html+='<div class="likers cfx">'+ imgHtml +'</div>';
                			$.query('#J_work_dt_likers').html(html).show();
                		} else $.query('#J_work_dt_likers').hide();

                		//sum_cmts
            			html='';
                		if(cmts.length > 0) {
                			$.each(cmts, function(idx, c){
                				html += '<li><a class="uname" href="#space_index/'+c.uid+'">'+c.uname+':</a>\
                				'+c.info+'<span class="atime">'+c.add_time+'</span></li>';
                			});
                			$.query('#J_work_dt_cmts').html(html).show();
                		} else {
                			$.query('#J_work_dt_cmts').html(html).hide();
                		}
                		
                		$.query('#work_detail .J_tocmt').attr('tourl', '#comment_book/work/'+work.id);
                		$.query('#work_detail .J_tocmt .num').html(work.comments);
                		
                		$('#work_detail').css('opacity', '1');
                		
                		$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':3, 'title':r.rname, 'img':r.img});}, null, [work]);
                	}
                	
                	$.workDtl.cfg.loadingWork = 'n';
                },
                error: function(xhr, why) {
                    $.ckj.ajaxError(xhr, why);
                    $.workDtl.cfg.id = 0;
                }
            });
        }
    };
    $.workDtl.init();
})(af);
