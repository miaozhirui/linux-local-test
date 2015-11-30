//common operations
(function($) {
    $.comOp = {
        cfg: {
            likeBtn: '.J_like',
            unLikeBtn: '.J_unlike',
            toCmtBtn:'.J_toCmt',
            followBtn:'.J_follow',
            unFollowBtn:'.J_unfollow',
            praiseBtn:'.J_praise',
            unPraiseBtn:'.J_unpraise',
            delBtn:'.J_del'
        },
        msg: {
        	item:'食品',
        	album:'吃柜',
        	store:'',
        	brand:'品牌',
        	recipe:'菜谱',
        	rmenu:'菜单',
        	work:'作品',
        	stuff:'食材',
        	rstrnt:'餐馆',
        	rstimg:'餐馆附图',
        	group:'吃群',
        	subject:'主题',
        	faq:'问题',
        	diary:'美食日记',
        	faqans:'问题答案',
        	feed:'动态'
        },
        //update detail info
        follwedCbs:{
            'album': function(delta){
                if($('#J_album_dt_follows').length < 1) return;
                $('#J_album_dt_follows').text(numOnly($('#J_album_dt_follows').text())+delta);
            },
            'store': function(delta){
                if($('#J_store_dt_follows').length < 1) return;
                $('#J_store_dt_follows').text(numOnly($('#J_store_dt_follows').text())+delta);
            },
            'brand': function(delta){
                if($('#J_brand_dt_follows').length < 1) return;
                $('#J_brand_dt_follows').text(numOnly($('#J_brand_dt_follows').text())+delta);
            },
            'rmenu': function(delta){
                if($('#J_rmenu_dt_follows').length < 1) return;
                $('#J_rmenu_dt_follows').text(numOnly($('#J_rmenu_dt_follows').text())+delta);
            }
        },

        //like an item/recipe ...
        like: function(ctx) {
        	//work arount for click through
            var s = $.comOp.cfg;
            $(ctx).on('click', s.likeBtn, function(e){
            	e.preventDefault();e.stopPropagation();
                if(!$.user.isLogin({
                	okFunc:function($this){
	                    var nb = $this.find('.J_like_n');
	                    var n = parseInt(nb.text()),
	                        id = $this.attr('data-id'), aid = $this.attr('data-aid'), itype = $this.attr('itype');
	                    $.vv.tip({icon: 'loading'});
	                    $.getJSON($.ckj.cfg.mapi + '/?m='+itype+'&a=like', {id:id, aid:aid}, function(result){
	                        if(result.status == 0 || result.status == 8){
	                        	if(result.status == 0)nb.text(n+1); //result.status > 1 have liked
	                        	$this.replaceClass('J_like', 'J_unlike');
	                        	$this.find('.fa').replaceClass('fa-heart-add', 'fa-heart-del');
	                        	$this.find('.ltip').html('取消喜欢');
	                        	$.vv.tip({content:result.msg, icon: 'success'});
	                        }else{
	                            $.vv.tip({content:result.msg, icon:'error'});
	                        }
	                    });
                	},
                	okData:$(this)
                })) return false;
            });
            //if($.os.android && $.os.androidVersion < 4.4)$(ctx).on('touchend', s.likeBtn, function(e){e.stopPropagation();e.preventDefault();});
        },
        //unlike an item/recipe ...
        unLike: function(ctx){
            var s = $.comOp.cfg;
            $(ctx).on('click', s.unLikeBtn, function(e){
            	e.preventDefault();e.stopPropagation();
            	if(!$.user.isLogin({
            		okFunc:function($this){
            			var nb = $this.find('.J_like_n'), n = parseInt(nb.text()),
                         	id = $this.attr('data-id'), itype = $this.attr('itype'), iunit = $this.attr('iunit');

                        $.ui.popup({
                            title:"取消喜欢",
                            message:'确定不再喜欢该'+$.comOp.msg[itype]+'了吗？',
                            cancelText:"取消",
                            cancelCallback: null,
                            doneText:"确定",
                            supressFooter:false,
                            cancelClass:'button',
                            doneClass:'button',
                            doneCallback: function () {
                                $.vv.tip({icon: 'loading'});
                                $.getJSON($.ckj.cfg.mapi + '/?m='+itype+'&a=unlike', {id:id}, function(result) {
                                    if(result.status == 0){
                                        $.vv.tip({content:result.msg, icon: 'success'});
                                        if(iunit){
                                            $this.closest($this.attr('iunit')).remove();
                                            if($.query('#J_waterfall')[0]) $.vv.wall.reMasonry();
                                        } else {
                                            nb.text(n-1); //result.status > 1 have liked
                                            $this.replaceClass('J_unlike', 'J_like');
                                            $this.find('.fa').replaceClass('fa-heart-del', 'fa-heart-add');
                                            $this.find('.ltip').html('喜欢');
                                        }
                                    }else{
                                        $.vv.tip({content:result.msg, icon:'error'});
                                    }
                                });
                            },
                            cancelOnly:false,
                            blockUI:true
                        });
            		},
            		okData:$(this)
            	})) return false;
            });
        },
        toCmt:function(ctx){
        	var s = $.comOp.cfg;
        	$(ctx).on('click', s.toCmtBtn, function(e){
        		e.preventDefault();e.stopPropagation();
        		window.scrollTo(0, $.query('#J_cmt_content')[0].offsetTop - 100); $.query('#J_cmt_content').focus();
        		return false;
        	});
        },
        follow: function(ctx){
        	var s = $.comOp.cfg;
        	$(ctx).on('click', s.followBtn , function(e){
        		e.preventDefault();e.stopPropagation();
                $.user.isLogin({
                	okFunc: function($this){
                        var itype=$this.attr('itype'), id = $this.attr('data-id');
                        $.vv.tip({icon: 'loading'});
    	                $.getJSON($.ckj.cfg.mapi + '/?m='+itype+'&a=follow', {id:id}, function(result){
    	                	if(result.status == 0 || result.status == 8){
	                        	//if(result.status == 1)nb.text(n+1); //result.status > 1 have followed
    	                		var  faType = $this.attr('faType'), collFa='fa-star', uncollFa='fa-star-o', uncollTip='已收藏';
    	                		     faType = faType ? faType : 'star';
    	                		if(faType == 'plus'){
    	                			collFa = 'fa-plus', uncollFa='fa-minus', uncollTip='已关注';
    	                		}
	                        	$this.replaceClass('J_follow', 'J_unfollow');
	                        	$this.find('.fa').replaceClass(collFa, uncollFa);
	                        	$this.find('.ltip').html(uncollTip);
	                        	$.vv.tip({content:result.msg, icon: 'success'});
	                        	if(result.status == 0){
	                        		var nb = $this.find('.J_n');
	                        		if(nb.length < 1) nb = $this.find('.num');
	                        		if(nb.length > 0)nb.text(parseInt(nb.text())+1);
	                        		if($.comOp.follwedCbs[itype]) $.comOp.follwedCbs[itype](1);
	                        	}
	                        }else{
	                            $.vv.tip({content:result.msg, icon:'error'});
	                        }
    	                });
                	},
                	okData:$(this)
                });
                return false;
            });
        },
        unFollow: function(ctx) {
        	var s = $.comOp.cfg;
        	$(ctx).on('click', s.unFollowBtn, function(e) {
        		e.preventDefault();e.stopPropagation();
                $.user.isLogin({
                	okFunc: function ($this) {
                		var faType = $this.attr('faType'), collFa='fa-star', uncollFa='fa-star-o';
                		    faType = faType ? faType : 'star';
                		if(faType == 'plus'){
                			collFa = 'fa-plus', uncollFa='fa-minus';
                		}
                		var itype=$this.attr('itype'), id = $this.attr('data-id'), iunit = $this.attr('iunit');

                		$.ui.popup( {
                            title:'取消'+(faType == 'star' ? '收藏' : '关注'),
                            message:'您确定要取消'+(faType == 'star' ? '收藏' : '关注')+'该'+$.comOp.msg[itype]+'吗?',
                            cancelText:"取消",
                            cancelCallback: null,
                            doneText:"确定",
                            supressFooter:false,
                            cancelClass:'button',
                            doneClass:'button',
                            doneCallback: function () {
                                $.vv.tip({icon: 'loading'});
                                $.getJSON($.ckj.cfg.mapi + '/?m='+itype+'&a=unfollow', {id:id}, function(result){       
                                    if(result.status == 0){
                                        $.vv.tip({content:result.msg, icon: 'success'});
                                        if(iunit){
                                            $this.closest($this.attr('iunit')).remove();
                                        } else {
                                            //nb.text(n-1);
                                            $this.replaceClass('J_unfollow', 'J_follow');
                                            $this.find('.fa').replaceClass(uncollFa, collFa);
                                            $this.find('.ltip').html((faType == 'star' ? '收藏' : '关注')+$.comOp.msg[itype]);
                                            if($.comOp.follwedCbs[itype]) $.comOp.follwedCbs[itype](-1);
                                        }
                                    } else {
                                        $.vv.tip({content:result.msg, icon:'error'});
                                    }
                                });
                            },
                            cancelOnly:false,
                            blockUI:true
                        });
                	},
                	okData:$(this)
                });
                return false;
            });
        },
        praise: function(ctx){
        	var s = $.comOp.cfg;
        	$(ctx).on('click', s.praiseBtn , function(e){
        		e.preventDefault();e.stopPropagation();
                $.user.isLogin({
                	okFunc: function($this){
                        var itype=$this.attr('itype'), id = $this.attr('data-id');
                        $.vv.tip({icon: 'loading'});
    	                $.getJSON($.ckj.cfg.mapi + '/?m='+itype+'&a=praise', {id:id}, function(result){
    	                	if(result.status == 0 || result.status == 8){
	                        	if(result.status == 0){
	                        		var nb = $this.find('.J_n');
	                        		if(nb.length > 0)nb.text(parseInt(nb.text())+1);
	                        	}
	                        	$this.replaceClass('J_praise', 'J_unpraise');
	                        	$.vv.tip({content:result.msg, icon: 'success'});
	                        }else{
	                            $.vv.tip({content:result.msg, icon:'error'});
	                        }
    	                });
                	},
                	okData:$(this)
                });
                return false;
            });
        },
        unPraise: function(ctx) {
        	var s = $.comOp.cfg;
        	$(ctx).on('click', s.unPraiseBtn, function(e){
        		e.preventDefault();e.stopPropagation();
                $.user.isLogin({
                	okFunc: function ($this) {
                		var itype=$this.attr('itype'), id = $this.attr('data-id');
                		$.vv.tip({icon: 'loading'});
                		$.getJSON($.ckj.cfg.mapi + '/?m='+itype+'&a=unpraise', {id:id}, function(result){     	
                        	if(result.status == 0){
                            	$.vv.tip({content:result.msg, icon: 'success'});
    	                        $this.replaceClass('J_unpraise', 'J_praise');
                            }else{
                                $.vv.tip({content:result.msg, icon:'error'});
                            }
                        });
                	},
                	okData:$(this)
                });
                return false;
            });
        }
    };
})(af);