(function($){
    $.vv = $.vv || {version: "1.0.0", cfg:{debug:false}};
    $.vv.needEvenHeight = true;
	$.fn.setMiddle = function(ctx) {
        var cW = $(ctx).width(), cH = $(ctx).height()
            oW = this.width(), oH = this.height(),
            left = (cW - oW) / 2 , top = (cH - oH) / 2;
            //console.log('>>> clientWidth:: '+cW+' >>> tipWidth:: '+oW+' >>>> left:: '+left);
        this.css({top: top+'px', left: left+ 'px'});          
        return this; 
    };
	
	$.extend($.vv, {
		init:function(){
        	$.vv.cfg.cWidth = $(window).width();
        	$.vv.cfg.cHeight = $(window).height();
        	$.vv.cfg.cHeight = $.os.ios ? $.vv.cfg.cHeight - 20 : $.vv.cfg.cHeight; //ios > 6; status bar overlay webview
        	$.vv.cfg.clickEvt = $.os.android && $.os.androidVersion == '4.0' ? 'tap' : 'click'; //>>>workaround for android 4.0 double click
        },
		log: function(){
			if(!$.vv.cfg.debug) return; //>>> online false
			for (var i = 0; i < arguments.length; i++){
				console.log(arguments[i]);
			}
		},
        util: {
            parseQuery: function (qstr) {
                qstr = qstr.replace(/^\?\s*/i, '');
                var query = {},
                    a = qstr.split('&');
                for (var i = 0; i < a.length; i++)
                {
                    var b = a[i].split('=');
                    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
                }
                return query;
            },
        	//chinese char width
        	equalSubStr:function(str,len, suf){
        		suf = suf||'...';
        		len=parseInt(len); 
        		var i=0,
        		    count=0,
        		    slen=str.length; 
        		if(len >= slen) return str;
        		while(i<slen){ 
        			if (str.charCodeAt(i)>0 && str.charCodeAt(i)<255){ count+=0.5; }
        			else count+=1; 
        			if(count<=len) i++; else break; 
        		}
        		return str.substr(0,i)+suf;
        	},
            getStrLength: function(str) { //unit 2bytes
                str = $.trim(str);
                var length = str.replace(/[^\x00-\xff]/g, "**").length;
                return parseInt(length / 2) == length / 2 ? length / 2: parseInt(length / 2) + 0.5;
            },
            strEncode: function (str) { //>>> have problem ...
            	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var out, i, len;
                var c1, c2, c3;

                len = str.length;
                i = 0;
                out = "";
                while(i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if(i == len)
                    {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        out += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if(i == len)
                    {
                        out += base64EncodeChars.charAt(c1 >> 2);
                        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        out += "=";
                        break;
                    }
                    c3 = str.charCodeAt(i++);
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
                    out += base64EncodeChars.charAt(c3 & 0x3F);
                }
                return out;
            },
            strDecode: function(input) {
                var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;
                //if(typeof input.length=='undefined')return '';
                if(input.length%4!=0) {
                    return "";
                }
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                
                if(base64test.exec(input)) {
                    return "";
                }
                
                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));
                    
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    
                    output = output + String.fromCharCode(chr1);
                    
                    if (enc3 != 64) { output+=String.fromCharCode(chr2);}
                    if (enc4 != 64) { output+=String.fromCharCode(chr3);}
                    
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                
                } while (i < input.length);
                return output;
            }
        },
        //localStorage: only can save string, so we JSON it
        ls: {
        	set: function (key , value, cTime) {
        		var cValue={}; 
        		cValue.data = value;
        		if(cTime && parseInt(cTime) > 0) cValue.expire = (new Date().getTime() / 1000) + cTime;
        		else cValue.expire = 0;
        		window.localStorage.setItem(key , JSON.stringify(cValue));
        	},
        	get:function (key) {
        		try {
        			var rst = JSON.parse(window.localStorage.getItem(key));
        			if(!rst) rst = null;
        			else if(rst.expire > 0 && rst.expire <= (new Date().getTime() / 1000)) rst = null;
        			else rst = rst.data;
        		}
        		catch(err) { 
        			var rst = null;
        		}
        		return rst;
        	},
        	del: function (key) {window.localStorage.removeItem(key);}, //remove one
        	clear: function (key) {window.localStorage.clear();} //remove all localStorage data
        },
        ajaxErrMsg: function(why) {
            var error = '';
            switch (why){
                case 'timeout': error = '请求超时，稍后重试！'; break;
                case 'offline': error = '没有网络，请联网后重试！'; break;
                default: error = '请求出错，稍后重试'; break;
            }
            return error;
        },
        
        tipHandler:null,
        tip: function(options) {
            var s = {
                top:'70%',
                left:'50%',
                ctx:'#afui',
                content: '',
                icon: 'success',
                time: 2000,
                close: false
            };
            
            if(options)$.extend(s, options);
            
            clearTimeout($.vv.tipHandler);
            $.vv.tipHandler = null;
            
            if(s.close){
                $.query('#tipbox').remove();
                return false; 
            }
            
            $.query('#tipbox').removeClass('showed').remove(); 

            var fa_icons = { 'loading':'<img class="fa" src="./img/loading1.gif" />',
	            			 'success':'', 'error':'', 'info':'', 'warning':'', 'ban':''
            			   };
            				
            s.icon = s.icon || 'success'; //success error warning info
            
            if(s.icon == 'loading') {
                s.time = 60000;
                s.top   = '50%';
            }
            
            $.query(s.ctx).append('<div id="tipbox" class="'+s.icon+'" style="top:'+s.top+';">'+fa_icons[s.icon]+s.content+'</div>');
            
            setTimeout(function(){
                $("#tipbox").setMiddle(s.ctx);
                setTimeout(function(){
                    $("#tipbox").addClass('showed');
                }, 12);
            }, 12); //
            
            if( s.time > 0 ) {
                $.vv.tipHandler = setTimeout(function() {
                    clearTimeout($.vv.tipHandler);
                    $.vv.tipHandler = null;
                    $.query('#tipbox').remove();
                }, s.time);
            }
        }
    });
})(af);

(function($){
	$.vv.ui = {
        //fixed type nav init
        fixed_nav: function(scrId, fixId) { //not used but keeped
        	////$.vv.log('bind scorll................'+scrId);
            var ot = 0, $scrEle= $.query(scrId), scroller = $scrEle.scroller(), scrDiv = $(scrId + " > div").get(0);
            	$fixEle = $(fixId), fixEle=$fixEle.get(0), fixHeight=$fixEle.height(), fixClass = $fixEle.attr('fixcls');
            $.bind(scroller, "scrollend", function () {
            	var mat = $.getCssMatrix(scrDiv);
            	//$.vv.log('scrollend................');
            	 var st = Math.abs(numOnly(mat.f)); //the height of the document hiddened from view
                 ot = ot ? ot : fixEle.offsetTop; //offset(): relative to the document
                 //$.vv.log('scrollTop::'+st, 'offsetTop::'+ot);
                 if ((ot+fixHeight) < st) {
                	 $fixEle.addClass(fixClass);
                	 //$fixEle.css('top', st+'px');
                 } else {
                	 $fixEle.removeClass(fixClass);
                	 //if($fixEle.css('top') != ot) $fixEle.css('top', ot+'px');
                 } 
            });
        },
        onPressed: function(ctx){
        	$.query(ctx).on('touchstart', '.vv-pressed', function(e){ $(this).addClass('pressed');});
        	$.query(ctx).on('touchend', '.vv-pressed', function(e){ $(this).removeClass('pressed');});
        },
        offPressed: function(ctx){
        	$.query(ctx).off('touchstart', '.vv-pressed');
        	$.query(ctx).off('touchend', '.vv-pressed');
        },
        toggleNavOrder:function(ctx){
        	$(ctx + ' .J_navorder_head > li').on($.vv.cfg.clickEvt, function(e){
        	    //console.log('==============data:: ', $.vv.cfg.clickEvt, e.data);
        		var $this = $(this), reltgt = $this.attr('reltgt');
        		if(!reltgt) return true;
        		e.preventDefault();e.stopPropagation();
        		var popBox = $(reltgt), wrap=popBox.closest('.J_navorder_wrap'), trans3d = !!popBox.attr('trans3d'),
        		    showed = trans3d ? popBox.hasClass('showed') : (popBox.css('display') == 'none' ? false : true);
        		if(e.data && e.data.close && !showed) return;
        		wrap.find('.J_navorder_head > li').each(function(){
        			reltgt = $(this).removeClass('cur').attr('reltgt');
        			if(reltgt){
        			    trans3d ? $(reltgt).removeClass('showed') : $(reltgt).hide();
        			}
        		});
        		if(!showed){
        			$this.addClass('cur');
        			trans3d ? popBox.addClass('showed') : popBox.show();
        		}
        	});
        },
        toggleRelTgt: function(ctx){
        	$(ctx).on('click', '.J_toggleRelTgt', function(e){
        		e.stopPropagation();e.preventDefault();
        		var reltgt = $($(this).attr('tgt')), $this = $(this);
        		if($this.hasClass('close') || (reltgt.css('display') != 'none')) {
        			//support one button or two button to control the display. workaroud for not clicking the ele below
        			setTimeout(function(){reltgt.hide();if($this.attr('oncls')) $this.removeClass($this.attr('oncls'));}, 350);
        		} else {
        			reltgt.show();
        			if($this.attr('oncls')) $this.addClass($this.attr('oncls'));
        		}
        	});
        },
		moreBlock:function(ctx){
			//show more block cnt
			$(ctx).on('click', '.J_block_show',  function(e){
				e.stopPropagation();e.preventDefault();
				var $this = $(this);
				var wrap = $this.closest('.J_block_wrap');
				if($this.attr('unfolded') == 'n'){
					$(this).find('.fa').removeClass('fa-rotate-90').addClass('fa-rotate-270');
					wrap.css('height', 'auto');
					$this.attr('unfolded', 'y');
				} else {
					$(this).find('.fa').removeClass('fa-rotate-270').addClass('fa-rotate-90');
					wrap.css('height', wrap.attr('init_height'));
					$this.attr('unfolded', 'n');
				}
			});
			$('.J_block_show').on('touchmove', $.vv.ui.stopTouchMove);
		},
        initBoxTabs:function(ctx){
        	$(ctx+' .J_switch_boxtabs').on('click', '.J_boxtab', function(e){
        		e.stopPropagation();e.preventDefault();
        		var $this = $(this);
        		if($this.hasClass('active'))return;
        		var wrap = $this.closest('.J_switch_boxtabs'), tabs = wrap.find('.J_boxtab'), panels = wrap.find('.J_boxpanel');
        		tabs.removeClass('active');
        		var tabidx = tabs.index($this);
        		$this.addClass('active');
        		panels.hide();
        		$(panels.get(tabidx)).show();
        	});
        },
        toggleTrans3dBlk: function (close){
            if(close || $('#Jtrans3dBlock').hasClass('showed')){
                $('#Jtrans3dBlock').removeClass('showed');
                $('#mask').unbind('click.toggle3dblk');
                setTimeout(function(){$.unblockUI();}, 200);
            } else {
                $('#Jtrans3dBlock').addClass('showed');
                $.blockUI(0.3);
                $('#mask').bind('click.toggle3dblk', function () {
                    $.vv.ui.toggleTrans3dBlk();
                });
            }
        },
        //lazyload load img
        lazyloadImg: function(context){
        	//$("img[data-orig]", context).attr('src', "/static/images/loading_s.gif");
        	$("img[data-orig]", context).lazyload({ failure_limit:10, threshold : 50, skip_invisible:false, data_attribute:'orig', 
        											load:function(){$(this).removeAttr('data-orig');},
        											error: function(){$(this).removeAttr('data-orig'); $(this).attr('src', $.vv.imgPlaceHolder);}
        	});
        },
        asapLoadImg: function(ctx){
        	$(ctx + " img[data-orig]").each(function(){
        		var src = $(this).attr('data-orig');
        		if(src.indexOf('http://') == -1) src = $.ckj.cfg.siteUrl + '/' + src;
        		$(this).attr('src', src).removeAttr('data-orig');
        	});
        },
        decodeImg: function(context) {
            $('.J_decodeImg', context).each(function(){
                var uri = $(this).attr('data-uri')||"";
                var imgtgt = $(this).attr('imgtgt');
                imgtgt = imgtgt || 'src';
                $(this).attr(imgtgt, $.vv.util.strDecode(uri));
                $(this).removeAttr('data-uri');
                $(this).removeAttr('imgtgt');
                $(this).removeClass('J_decodeImg');
            });
        },
        stopTouchMove: function (e){
        	if(e.type == 'touchmove'){
        		//$.vv.log('touchmove');
        		e.stopPropagation();
        		e.preventDefault();
        	} 
        }
    }
})(af);

(function($){
	$.vv.tool = {
        msgtip: function() {
            if(VVER.uid){
                var is_update = false;
                var update = function() {
                    is_update = true;
                    $.getJSON(VVER.root + '/user/msgtip/', function(result){
                        if(result.status == 1){
                            var fans  	= result.data.fans ? parseInt(result.data.fans) : 0,
                                atme  	= result.data.atme ? parseInt(result.data.atme) : 0,
                                cmtme 	= result.data.cmtme ? parseInt(result.data.cmtme) : 0,
                                msg 	= result.data.msg ? parseInt(result.data.msg) : 0,
                                system =  result.data.system ? parseInt(result.data.system) : 0,
                                msgtotal = fans + atme + cmtme + msg + system;
                            fans > 0 && $.query('#J_fans').html('(' + fans + ')');
                            atme > 0 && $.query('#J_atme').html('(' + atme + ')');
                            cmtme > 0 && $.query('#J_cmtme').html('(' + cmtme + ')');
                            msg > 0 && $.query('#J_msg').html('(' + msg + ')');
                            system > 0 && $.query('#J_system').html('(' + system + ')');
                            msgtotal > 0 && $.query('#J_msgtip').html('(' + msgtotal + ')');
                            is_update = false;
                            setTimeout(function(){update();}, 5000);
                        }
                    });
                };
                !is_update && update();
            }
        },
        
        highReg:null,
        highReplacer: function (kw) {return '<i class="highlight">'+kw+'</i>';},
        highKeysStatic: function(options) {
        	var kws =  $.query('#J_high_keywords').val();
        	if(!kws) return true;
        	var kw_arr = kws.split(/\s+/);
            var regstr = '';
            for(var i = 0, c = kw_arr.length; i < c; i++)regstr += kw_arr[i]+'|';
            regstr = regstr.substring(0, regstr.length-1);
            var reg = new RegExp(regstr, "gi");
            $.vv.tool.highReg = reg;
            $('.J_highKeys').each(function() { //this refer to current af object
            	  var ohtml 	= $(this).html();
            	  var nhtml  	= ohtml.replace($.vv.tool.highReg, $.vv.tool.highReplacer);
            	  $(this).html(nhtml);
            });
        }
    }
	
	//hightlight keywords; for ajax loading item;
    $.fn.highKeys = function(){
    	this.each(function() {
    		var ohtml 	= $(this).html();
    		var nhtml  	= ohtml.replace($.vv.tool.highReg, $.vv.tool.highReplacer);
    		$(this).html(nhtml);
    	});
    	return this;
    }
})(af);
// vv cookie
(function($){
	$.vv.ck = {
		ckCache:null, //cache
        allCookie:function(ckObj){ //fromLS: force flush from Localstorage
        	if(!ckObj) {
	        	if(!$.vv.ck.ckCache){
	        		var ckStr = window.localStorage.getItem('vvcookie'); ckStr = ckStr ? ckStr.trim() : false;
	        		$.vv.ck.ckCache = ckStr ? JSON.parse(ckStr) : {}; 
	        	}
	        	return $.vv.ck.ckCache;
        	} else {
        		$.vv.ck.ckCache = ckObj;
        		window.localStorage.setItem('vvcookie', JSON.stringify(ckObj));
        	}
        },
        flush:function(fromTo){
        	fromTo = fromTo || 'from';
        	if(fromTo=='from') $.vv.ck.ckCache = JSON.parse(window.localStorage.getItem('vvcookie'));
        	else window.localStorage.setItem('vvcookie', JSON.stringify($.vv.ck.ckCache));
        },
        get:function(key){
        	var ck = $.vv.ck.allCookie();
        	return ck[key];
        },
        set:function(key, val){
        	var ck = $.vv.ck.allCookie();
        	ck[key] = val;
        	$.vv.ck.allCookie(ck);
        },
        mset:function(arr){
        	var ck = $.vv.ck.allCookie();
        	$.extend(ck, arr);
        	$.vv.ck.allCookie(ck);
        },
        del:function(key){
        	var ck = $.vv.ck.allCookie();
        	delete ck[key];
        	$.vv.ck.allCookie(ck);
        },
        mdel:function(keys){
        	var ck = $.vv.ck.allCookie();
        	$.each(keys,function(idx,key){delete ck[key];});
        	$.vv.ck.allCookie(ck);
        },
    }
})(af);

(function($){
	//Web SQL
	$.extend($.vv, {
        db: {
        	db: null,
        	tblSql:{
        		'history':  "CREATE TABLE IF NOT EXISTS history(" +
				  			"oid SMALLINT, rtype SMALLINT, title TEXT, img TEXT, " +
				  			"add_time TIMESTAMP DEFAULT (datetime('now','localtime')), " +
				  			"PRIMARY KEY(rtype, oid));",
				'shop':     "CREATE TABLE IF NOT EXISTS shop(" +
				  			"name TEXT, amount TEXT," +
				  			"stype SMALLINT DEFAULT 1, buystat SMALLINT DEFAULT 0," +
				  			"add_time TIMESTAMP DEFAULT (datetime('now','localtime')), " +
				  			"PRIMARY KEY(stype, name));",
        	},
        	//sync func
        	openDB: function () {
        		if(!$.vv.db.db) $.vv.db.db = openDatabase("chankoujie", "1.0", "User browsing history!", 20242880);//5M
        		return $.vv.db.db;
        	},
        	prepareTbl:function(tbl) {
        		tbl = tbl || 'history';
        		var db = $.vv.db.openDB(), sql = $.vv.db.tblSql[tbl];
    			db.transaction( function(tx) {
    			    tx.executeSql( sql, [], 
    			        function(tx, result){ 
    			            //$.vv.log('create '+tbl+' tbl success'); 
    			        }, 
    			        function(tx, error){ 
    			            //$.vv.log('create '+tbl+' tbl error::' + error.message); 
    			        }
    			    );
    			});
        		return db;
        	},
        	exec:function(tbl, sql, args, okcb, errcb){
          		tbl = tbl || 'history';
          		args = args || [];
        		var db  = $.vv.db.prepareTbl(tbl);
        		//$.vv.log('exec sql::'+sql, args);
        		db.transaction(function (tx) {
                    tx.executeSql( sql, args,
		                okcb ? okcb : function () { 
		                    //$.vv.log(sql+' OK'); 
		                },
		                errcb ? errcb : function (tx, error) { 
		                    //$.vv.log(sql+' error: ' + error.message); 
	                    }
	                );
	            });
          	},
        	//async func
        	insert:function(tbl, rcd, okcb, errcb){
        		tbl = tbl || 'history';
        		var db = $.vv.db.prepareTbl(tbl),
        			keys = '', hlds = '', args = [];
    			for(k in rcd){
    			   keys += keys == ''? k : ', '+k;
    			   hlds += hlds == ''? '?' : ', ?';
    			   args.push(rcd[k]);
    			}
        		db.transaction(function (tx) {
                    tx.executeSql( "REPLACE INTO "+tbl+" ("+keys+") VALUES ("+hlds+")", args,
		                okcb ? okcb : function () { 
		                    //$.vv.log('insert '+tbl+' OK'); 
		                },
		                errcb ? errcb : function (tx, error) { 
		                    //$.vv.log('insert '+tbl+' error: ' + error.message); 
	                    }
	                );
	            });
        	},
        	select:function(tbl, sql, okcb, errcb, key){
        		tbl = tbl || 'history';
        		var db  = $.vv.db.prepareTbl(tbl);
        		db.transaction(function (tx) {
        	       tx.executeSql( sql, [],
        	       function (tx, results) {
        	    	   var t, rsts=[];
        	    	   for (var i = 0, len=results.rows.length; i < len; i++) {
	        	    	   t = results.rows.item(i);
	        	    	   if(key) rsts[t[k]] = t;
	        	    	   else rsts[i] = t;
        	    	   }
        	    	   //$.vv.log(sql+' => selected results::', rsts);
        	    	   if(okcb)okcb(rsts, 0);
        	       },
        	       function (tx, error) {
        	    	   //$.vv.log(sql+' => selected failed::' + error.message);
        	    	   if(errcb)errcb(error, 1);
        	       });
        	    });
        	},
        	del:function(tbl, cond, okcb, errcb){
        		tbl = tbl || 'history';
        		var db = $.vv.db.prepareTbl(tbl),
        			wheres = '', args = [];
    			for(k in cond){
    				wheres += wheres == ''? k+'=?' : ' AND k=?';
    			    args.push(cond[k]);
    			}
        		db.transaction(function (tx) {
                    tx.executeSql( "DELETE FROM "+tbl+" WHERE "+wheres, args,
		                okcb ? okcb : function () { 
		                    //$.vv.log('del OK'); 
		                },
		                errcb ? errcb : function (tx, error) { 
		                    //$.vv.log('del error: ' + error.message); 
	                    }
	                );
	            });
        	},
        }
    });
})(af);
