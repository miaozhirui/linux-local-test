(function($){
    $.itemDtl = {
    	cfg: {
    		id:0,
    		loadingItem:'y',
    		panelInited:false,
    		
    		joinAlbumBtn: '.J_joinalbum',
    		selectAlbumBtn: '#J_select_album',
    		itemUnit: '.J_item'
    	},
    	shareInfo: {
    		stitle:'',
    		sname:'',
    		imgUrl:'',
    		dtlUrl:''
    	},
    	shareMsg: [	{'pre':'', 'suf':' 蛮好吃的哦， 值得买点尝尝，(*^__^*) 嘻嘻……'}, 
        	         ],
        init: function(options){
        	$("#item_detail").bind("loadpanel",function(e){
        		if(e.data.goBack) {
        		    $('#item_detail').css('opacity', '1');
        		    return;
        		}
        		var params = $.query("#item_detail").data('params'),
        			itemId  = params[0];
        		if($.itemDtl.cfg.id == itemId) {
        		    $('#item_detail').css('opacity', '1');
        		    return; //avoid loading the same ...
        		}
        		else $.itemDtl.cfg.id = itemId;
        		
        		$.itemDtl.panelInit();
        		
        		$.query("#item_detail").scroller().scrollToTop(0);
        		$.itemDtl.loadItem($.itemDtl.cfg.id);
    		});
        },
        panelInit: function(){
        	if( $.itemDtl.cfg.panelInited === true ) return;
        	var wallWrap = $.query('#item_detail');
        	wallWrap.addClass('scroll_nobar');
        	wallWrap.scroller({scrollBars: $.ckj.cfg.infoBar, vScrollCSS: "afScrollbar"});
        	
        	wallWrap.on('click', '.J_tocmt', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.loadContent('#comment_book/item/'+$.itemDtl.cfg.id,false,false,"slide");
        	});
        	
        	//bad report
            $('#item_detail').on('click', '.J_moreOps', function(e){
                e.stopPropagation();e.preventDefault();
                $('#afui').actionsheet(
                    [{
                        text: '分享...',
                        cssClasses: '',
                        handler: function () {
                            setTimeout(
                                function(){
                                    $.ckj.sShare($.itemDtl.shareInfo, $.itemDtl.shareMsg);
                                }, 
                                8
                            ); //ios workaround
                        }
                    }, {
                        text: '举报...',
                        cssClasses: '',
                        handler: function () {
                            $.ckj.badReport('举报食品', 'item', $.itemDtl.cfg.id);
                        }
                    }]
                );
            });
        	
        	$.user.follow('#item_detail');
        	$.user.unFollow('#item_detail');
        	
        	$.comOp.like('#item_detail');
        	$.comOp.unLike('#item_detail');
        	
            $.itemDtl.joinAlbum('#afui');
            $.itemDtl.selectAlbum('#afui');
        	
            $.query('#item_detail').attr('scrollTgt', '#item_detail');
            $.vv.ui.onPressed('.J_item_metaops');
        	$.itemDtl.cfg.panelInited = true;
        },
        
        loadItem:function(id) { //TODO: use DOT
        	$.vv.tip({icon:'loading'});
        	$.query('#J_item_dt_bimg').attr('src', 'data/default/1_1.jpg');
        	$.ajax({
                url: $.ckj.cfg.mapi+'/?m=item&a=detail&id='+id,
                dataType: "json",
                success: function(rst){
                	if(rst.status != 0){ //error happened
                		$.vv.tip({ content:rst.msg, time:3000}); 
                	} else {
                		$.vv.tip({close:true});
                		var item = rst.data.item, jalbums = rst.data.jalbums, store = rst.data.store, iattrs = rst.data.iattrs, 
                			hasLiked=rst.data.hasLiked, cmts = rst.data.cmts, imgList = rst.data.imgList, html ='', uhtml='';
     		
                		//item info
                		$.query('#J_item_dt_bimg').attr('src', item.img);

                		//item ops
                		html = '<li class="likes pink '+(hasLiked? 'J_unlike' : 'J_like' )+' vv-pressed" outdel="n" itype="item" data-id="'+item.id+'">\
		                	        <i class="fa fa-heart-'+(hasLiked? 'del' : 'add' )+'"><span class="num J_like_n">'+item.likes+'</span></i>\
		                	        <p class="ltip">'+(hasLiked? '取消喜欢' : '喜欢' )+'</p>\
		                	    </li>\
		                	    <li class="green J_tocmt vv-pressed">\
		                	       <i class="fa-comments1"></i><span class="num">'+item.comments+'</span>\
		                	       <p>评论</p></li>\
		                	    <li class="green jalbum J_joinalbum vv-pressed" data-id="'+item.id+'">\
		                	        <i class="fa-box-add"></i>\
		                	        <p class="">加入吃柜</p>\
		                	    </li>\
		                	    <li class="green share J_moreOps vv-pressed">\
		                	        <p class="">• • •</p>\
		                	    </li>';
                		$.query('#J_item_dt_ops').html(html);
                		
                		//item meta
                		uhtml += $.ckj.renderFollowShipBtn(item.uid, $.ckj.user.id, rst.data.authorShip);
                		html = '<a class="avatar fl"><img src="'+item.avatar+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/></a>\
							    <div class="user prel">\
							        <p class="uname">'+item.uname+'</p>\
							        <p class="atime">'+(item.add_time.split(' ')[0])+'分享</p>\
							        '+uhtml+'\
							    </div>\
							    <div class="intro">'+item.intro+'</div>\
							    <div class="buy_info">\
							        <a href="'+item.url+'" class="vv-pressed">\
							            <e id="J_item_dt_price" class="price">￥'+item.price+'</e><e class="gobuy">去搞点尝尝 <i class="fa fa-angle-right prt2"></i></e>\
							        </a>\
							    </div>';
                		$.query('#J_item_dt_meta').html(html);
                		
                		//item attrs
                		if(iattrs.length > 0){
                			html = '<h1 class="title">食品信息</h1><ul class="attr">';
                			$.each(iattrs, function(idx, a) {
                    			html += '<li class="cfx"><i class="nm">'+a.name+'：</i><i class="val">'+a.value+'</i></li>';
                        	});
                			html += '</ul>';
                			$.query('#J_item_dt_attr').html(html).show();
                		} else {
                			$.query('#J_item_dt_attr').hide();
                		}
                		
                		//jalbums
                		if(jalbums.length > 0){
                			html = '<h1 class="title">加入吃柜</h1><div class="albums">';
                			$.each(jalbums, function(idx, a) {
                    			html += '<a href="#album_detail/'+a.id+'"><i class="fa fa-archive"></i> '+a.title+' <i class="fa fa-angle-right"></i></a>';
                        	});
                			html += '</div>';
                			$.query('#J_item_dt_jalbums').html(html).show();
                		} else {
                			$.query('#J_item_dt_jalbums').hide();
                		}
                		
                		//store
                		if(store){
                			var imgHtml = '';
                			if(store.imgs && store.imgs.length > 0){
                				$.each(store.imgs, function(idx, img) {
                					imgHtml += '<img src="'+img+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>';
                            	});
                			}
                			html ='<h1 class="title">来自好吃店</h1> \
		                		 <div class="store">\
		                	        <div>\
		                	            <i class="head gray">名称：</i>\
		                	            <a href="#store_detail/'+store['id']+'" class="value green">'+store['name']+' <i class="fa fa-hand-o-right"></i></a>\
		                	        </div>\
		                	        <div>\
		                	            <i class="head gray">简介：</i>\
		                	            <i class="value">'+store['intro']+'</i>\
		                	        </div>\
		                	        <div>\
		                	            <i class="head gray">食品：</i>\
		                	            <i class="value foods cfx">'+imgHtml+'</i>\
		                	        </div>\
		                	    </div>';

                			$.query('#J_item_dt_store').html(html).show();
                		} else {
                			$.query('#J_item_dt_store').hide();
                		}
                		
                		//sum_cmts
            			html='';
                		if(cmts.length > 0) {
                			$.each(cmts, function(idx, c){
                				html += '<li><a class="uname" href="#space_index/'+c.uid+'">'+c.uname+':</a>\
                				'+c.info+'<span class="atime">'+c.add_time+'</span></li>';
                			});
                			$.query('#J_item_dt_cmts').html(html).show();
                		} else {
                			$.query('#J_item_dt_cmts').empty().hide();
                		}
                		
                		$.query('#item_detail .J_tocmt .num').html(item.comments);
                		
                		//more pics
            			html='<h1 class="title">更多图片</h1> <div class="itempics">';
                		if(imgList.length > 0) {
                			$.each(imgList, function(idx, im){
                				html += '<img src="'+im+'" onload="$.ckj.onImgLoad(this)" onerror="$.ckj.onImgError(this);"/>';
                			});
                			html += '</div>';
                			$.query('#J_item_dt_morepics').html(html).show();
                		} else {
                			$.query('#J_item_dt_morepics').hide();
                		}
                		
                		$('#item_detail').css('opacity', '1');
                		
                		$.itemDtl.shareInfo = {'stitle': item.title, 'sname':item.title, 
								 'imgUrl':item.img, 'dtlUrl':$.ckj.cfg.siteUrl+'/item/'+item.id};
                		
                		$.asap(function(r){$.vv.db.insert('history', {'oid':r.id, 'rtype':5, 'title':r.title, 'img':r.img});}, null, [item]);
                	}
                	
                	$.itemDtl.cfg.loadingItem = 'n';
                },
                error: function(xhr, why) {
                    $.ckj.ajaxError(xhr, why);
                    $.itemDtl.cfg.id = 0;
                }
            });
        },
        
        //join the item to an album
        joinAlbum: function(ctx) {
            var s = $.itemDtl.cfg;
            $(ctx).on('click', s.joinAlbumBtn,  function(e) {
            	e.stopPropagation();e.preventDefault();
                if(!$.user.isLogin({
                	okFunc:function($this){
                        var id = $this.attr('data-id');
                        var jpop = $.query('#afui').popup({ id:"join_album", title:'<i class="fa fa-box-add"></i>加入吃柜',blockUI:true, addCssClass:'popBottom'});
                        $.getJSON($.ckj.cfg.mapi + '/?m=album&a=join', {id:id}, function(result){
                            if(result.status == 0){
                            	jpop.setCnt(result.data);
                                $.itemDtl.joinAlbumForm($.query('#J_join_album'), jpop);
                            }else{
                                $.vv.tip({content:result.msg, icon:'error'});
                            }
                        });
                	},
                	okData:$(this)
                })) return false;
            });
        },
        
        joinAlbumForm: function(form, jpop) {
        	var s = $.itemDtl.cfg;
            form.submit(function(e){
            	e.preventDefault();
            	jpop.setTitle('<i class="fa fa-spinner fa-spin"></i>加入吃柜中...');
    			$.ajax({
                    url: $.ckj.cfg.mapi + form.attr('action'),
                    type:'post',
                    data:form.serialize(),
                    success: function(result){
                    	//$.vv.log(result);
                    	if(result.status != 0){ $.vv.tip({content:result.msg, icon:'error'});
                    	} else { 
                    		$.vv.tip({content:result.msg, icon:'success'});
                    		var nb = $.query(s.joinAlbumBtn + ' .num'); n = parseInt(nb.text()), nb.text(n+1);
                    	}
                    	jpop.hide();
                    },
                    dataType: "json"
               });
            });
        },
        
        //select an album
        selectAlbum: function(ctx) {
            var s = $.itemDtl.cfg;
            var creating = false;
            $(ctx).on('click', '.J_qcreate_btn', function(e) {
            	e.stopPropagation();e.preventDefault();
                $(this).hide();
                $('textarea[name=title], select[name=album_id], #J_join_subbtn').hide();
                $(s.selectAlbumBtn).find('.J_qcreate').show();
            });
            //click to create an album
            $(ctx).on('click', '.J_qc_submit', function(e){
            	e.stopPropagation();e.preventDefault();
            	if(creating) return;
            	creating = true;
                var title = $(s.selectAlbumBtn).find('.J_qc_title').val(),
                    cate_id = $(s.selectAlbumBtn).find('.J_qc_cate').val(),
                	intro 	= $(s.selectAlbumBtn).find('.J_qc_intro').val();
                if(!title) {$.vv.tip({content:"求吃柜标题哦~", icon:'error', ctx:'#join_album'}); return false;}
                $.vv.tip({icon:'loading'});
                $.ajax({
                    url: $.ckj.cfg.mapi + '/?m=album&a=add',
                    type: 'POST',
                    data: {
                        title: title,
                        cate_id: cate_id,
                        intro:intro
                    },
                    dataType: 'json',
                    success: function(result){
                        if(result.status == 0){
                            $.vv.tip({close:true});
                            $(s.selectAlbumBtn).find('.J_qcreate_btn').show();
                            $('textarea[name=title], select[name=album_id], #J_join_subbtn').show();
                            $('<option value="'+result.data+'">'+title+'</option>').appendTo($(s.selectAlbumBtn).find('.J_album_id'));
                            setTimeout(function(){
                                $(s.selectAlbumBtn).find('.J_album_id').find('option[value="'+result.data+'"]').attr("selected", true);
                                $(s.selectAlbumBtn).find('.J_album_id').find('option[value="0"]').remove();
                            }, 1);
                            $(s.selectAlbumBtn).find('.J_df_cate').hide();
                            $(s.selectAlbumBtn).find('.J_qcreate').hide();
                        }else{
                            $.vv.tip({content:result.msg, icon:'error'});
                        }
                        
                        creating = false;
                    },
                    error:function(xhr, err) {
                    	creating = false;
                    	$.ckj.ajaxError(xhr, err);
                    }
                });
            });
        }
    };
    $.itemDtl.init();
})(af);
