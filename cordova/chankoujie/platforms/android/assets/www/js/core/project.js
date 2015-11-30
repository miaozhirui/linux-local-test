(function($) {
    $.ckj = {
        cfg: {
            appVersion: '1.0.0',
        	siteUrl:($.vv.cfg.debug ? 'http://m.chankoujie.lh.com' : 'http://m.chankoujie.com'),
        	mapi: ($.vv.cfg.debug ? 'http://mapi.chankoujie.lh.com' : 'http://mapi.chankoujie.com'),
        	timeOut:15000,
        	
        	onDevice:false,
        	hasNET:false,
        	netType:'unknown',
        	
        	useInfinite: false || !$.os.android,    	
        	scrollBar: $.vv.cfg.debu || !$.os.android,
        	infoBar:false,
        	   
        	slowDev: false,
        	
        	cmtTrans: 'slide',
        	formTrans: 'slide',
        	splTrans: 'slide',

            backResetPanel: true, //relasing memroy or Android may freezing sometimes  
            tabResetPanel: false,
        	freeShare:true,
        	gpsPos:{}
        },
        refresh:{}, //refresh avatar/cover
        
        //global hool functions
        hooks:{
            online:[], //when net became avaliable
            offline:[], //when net became unavaliable
            logout:[], //
            login:[]
        },
        dotRenders:{}, //>>> must be declared here
        cacheTime: {
        	//86400(1day);604800(7days);2592000(30days)
        	recipeCate:2592000, //1 month
        	rmenuCate:604800, //1 week
        	stuffCate:2592000,
        	itemCate:604800,
        	eitemCate:2592000, //1 month
        	itemHotNewCate:86400,
        	albumCate:604800,
        	storeCate:604800,
        	brandCate:604800,
        	faqHotKeys:86400
        },
        user: {
        	isLogin:false,
        	id:0,
        	name:'',
        },
        rcdMap: {
        	'item':'食品', 'album':'吃柜', 'recipe':'菜谱', 'rmenu':'菜单', 'stuff':'食材',
			'work':'作品', 'item':'食品', 'brand':'品牌', 'store':'好吃店', 'rstrnt':'餐馆',
			'rstimg':'餐馆附图', 'space':'留言', 'diary':'美食日记', 'subject':'吃群主题',
			'faq':'问题', 'faq_ans':'答案','topic':'动态评论'
        },
        /***error handlers***/
        ajaxError: function(xhr, why){
            if(why != 'panelhided') $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
        },
        beforeAjax: function(xhr, opts){
            if ($.ckj.cfg.hasNET) return true;
            else {
                if(!/https?:\/\//.test(opts.url)) return true;
                else {
                    if($.isFunction(opts.error)){
                        opts.error.call(this, xhr, 'offline');
                    } else {
                        //TODO...
                    }
                    
                    return false;
                }
            }
        },
        init: function(options) {
        	//ui configuration
        	$.ui.defaultPanel = 'ckj_index';
        	$.ui.panels = {
        	    "ckj_index": {'title':"馋口街", 'js':"ckj_index", 'view':"ckj_index", 'footer':"none", 'tab':"none", 'scroll': false},
              	"recipe_cate": {'title':"菜谱分类", 'js':"recipe_cate", 'view':"recipe_cate", 'footer':"ft_recipe", 'tab':"tab_recipebook", 'scroll': false},
                "recipe_book": {'title':"发现菜谱", 'js':"recipe_book", 'view':"recipe_book", 'footer':"none", 'tab':"", 'scroll': false},
                "recipe_detail": {'title':"菜谱详情", 'js':"recipe_detail", 'view':"recipe_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "recipe_share": {'title':"发布菜谱", 'js':"recipe_share", 'view':"recipe_share", 'footer':"none", 'tab':"", 'scroll': true},
                "work_book": {'title':"赏作品", 'js':"work_book", 'view':"work_book", 'footer':"none", 'tab':"", 'scroll': false},
                "work_detail": {'title':"作品详情", 'js':"work_detail", 'view':"work_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "work_share": {'title':"上传作品", 'js':"work_share", 'view':"work_share", 'footer':"none", 'tab':"", 'scroll': true},
                "rmenu_book": {'title':"翻菜单", 'js':"rmenu_book", 'view':"rmenu_book", 'footer':"none", 'tab':"", 'scroll': false},
                "rmenu_detail": {'title':"菜单详情", 'js':"rmenu_detail", 'view':"rmenu_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "rmenu_add": {'title':"新建菜单", 'js':"rmenu_edit", 'view':"rmenu_edit", 'footer':"none", 'tab':"", 'scroll': false},
                "stuff_cate": {'title':"食材分类", 'js':"stuff_cate", 'view':"stuff_cate", 'footer':"ft_recipe", 'tab':"tab_stuffcate", 'scroll': false},
                "stuff_book": {'title':"食材发现", 'js':"stuff_book", 'view':"stuff_book", 'footer':"none", 'tab':"", 'scroll': false},
                "stuff_detail": {'title':"食材详情", 'js':"stuff_detail", 'view':"stuff_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "item_cate": {'title':"找吃的/食品分类", 'js':"item_cate", 'view':"item_cate", 'footer':"ft_item", 'tab':"tab_itemcate", 'scroll': false},
                "item_book": {'title':"找吃的", 'js':"item_book", 'view':"item_book", 'footer':"none", 'tab':"", 'scroll': false},
                "item_detail": {'title':"食品详情", 'js':"item_detail", 'view':"item_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "album_book": {'title':"翻吃柜", 'js':"album_book", 'view':"album_book", 'footer':"none", 'tab':"", 'scroll': false},
                "album_detail": {'title':"吃柜详情", 'js':"album_detail", 'view':"album_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "album_add": {'title':"新建吃柜", 'js':"album_add", 'view':"album_add", 'footer':"none", 'tab':"", 'scroll': false},
                "store_book": {'title':"好吃店", 'js':"store_book", 'view':"store_book", 'footer':"none", 'tab':"", 'scroll': false},
                "store_detail": {'title':"好吃店详情", 'js':"store_detail", 'view':"store_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "brand_book": {'title':"品牌", 'js':"brand_book", 'view':"brand_book", 'footer':"none", 'tab':"", 'scroll': false},
                "brand_detail": {'title':"品牌详情", 'js':"brand_detail", 'view':"brand_detail", 'footer':"none", 'tab':"",'scroll': false},
                "rstrnt_addr": {'title':"切换城市", 'js':"rstrnt_addr", 'view':"rstrnt_addr", 'footer':"none", 'tab':"", 'scroll': false},
                "rstrnt_book": {'title':"发现餐馆", 'js':"rstrnt_book", 'view':"rstrnt_book", 'footer':"none", 'tab':"", 'scroll': false},
                "rstrnt_detail": {'title':"餐馆详情", 'js':"rstrnt_detail", 'view':"rstrnt_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "rstrnt_share": {'title':"发布餐馆", 'js':"rstrnt_share", 'view':"rstrnt_share", 'footer':"none", 'tab':"", 'scroll': true},
                "rstrnt_map": {'title':"餐馆地图", 'js':"rstrnt_map", 'view':"rstrnt_map", 'footer':"none", 'tab':"", 'scroll': false},
                "search": {'title':"搜索", 'js':"search", 'view':"search", 'footer':"none", 'tab':"", 'scroll': false},
                "rstimg_book": {'title':"餐馆附图", 'js':"rstimg_book", 'view':"rstimg_book", 'footer':"none", 'tab':"", 'scroll': false},
                "rstimg_detail": {'title':"餐馆附图详情", 'js':"rstimg_detail", 'view':"rstimg_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "rstimg_share": {'title':"分享餐馆图片", 'js':"rstimg_share", 'view':"rstimg_share", 'footer':"none", 'tab':"", 'scroll': true},
                "group_book": {'title':"发现吃群", 'js':"group_book", 'view':"group_book", 'footer':"none", 'tab':"", 'scroll': false},
                "group_detail": {'title':"吃群详情", 'js':"group_detail", 'view':"group_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "group_add": {'title':"新建吃群", 'js':"group_add", 'view':"group_add", 'footer':"none", 'tab':"", 'scroll': false},
                "subject_book": {'title':"吃群主题", 'js':"subject_book", 'view':"subject_book", 'footer':"none", 'tab':"", 'scroll': false},
                "subject_detail": {'title':"主题详情", 'js':"subject_detail", 'view':"subject_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "subject_share": {'title':"发布主题", 'js':"subject_share", 'view':"subject_share", 'footer':"none", 'tab':"", 'scroll': true},
                "faq_book": {'title':"问题列表", 'js':"faq_book", 'view':"faq_book", 'footer':"none", 'tab':"", 'scroll': false},
                "faq_detail": {'title':"问题详情", 'js':"faq_detail", 'view':"faq_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "faq_publish": {'title':"发布问题", 'js':"faq_publish", 'view':"faq_publish", 'footer':"none", 'tab':"", 'scroll': true},
                "faq_answer": {'title':"问题答案", 'js':"faq_answer", 'view':"faq_answer", 'footer':"none", 'tab':"", 'scroll': false},
                "faqans_publish": {'title':"回答问题", 'js':"faqans_publish", 'view':"faqans_publish", 'footer':"none", 'tab':"", 'scroll': true},
                "daren_book": {'title':"达人秀", 'js':"daren_book", 'view':"daren_book", 'footer':"none", 'tab':"", 'scroll': false},
                "user_book": {'title':"用户列表", 'js':"user_book", 'view':"user_book", 'footer':"none", 'tab':"", 'scroll': false},
                "comment_book": {'title':"评论列表", 'js':"comment_book", 'view':"comment_book", 'footer':"none", 'tab':"" , 'scroll': false},
                "diary_detail": {'title':"日记详情", 'js':"diary_detail", 'view':"diary_detail", 'footer':"none", 'tab':"" , 'scroll': false},
                "diary_publish": {'title':"发布日记", 'js':"diary_publish", 'view':"diary_publish", 'footer':"none", 'tab':"", 'scroll': true},
                "space_index": {'title':"我的家园", 'js':"space_index", 'view':"space_index", 'footer':"none", 'tab':"" , 'scroll': false},
                "space_fans": {'title':"我的粉丝", 'js':"space_fans", 'view':"space_fans", 'footer':"none", 'tab':"", 'scroll': false},
                "space_follows": {'title':"我的关注", 'js':"space_follows", 'view':"space_follows", 'footer':"none", 'tab':"", 'scroll': false},
                "space_uinfo": {'title':"用户信息", 'js':"space_uinfo", 'view':"space_uinfo", 'footer':"none", 'tab':"", 'scroll': false},
                "hist_book": {'title':"浏览历史", 'js':"hist_book", 'view':"hist_book", 'footer':"none", 'tab':"", 'scroll': false},
                "space_feed": {'title':"我的动态", 'js':"space_feed", 'view':"space_feed", 'footer':"none", 'tab':"" },
                "topic_detail": {'title':"动态详情", 'js':"topic_detail", 'view':"topic_detail", 'footer':"none", 'tab':"" },
                "space_rmenu": {'title':"我的菜单", 'js':"space_rmenu", 'view':"space_rmenu", 'footer':"none", 'tab':"", 'scroll': false},
                "space_album": {'title':"我的吃柜", 'js':"space_album", 'view':"space_album", 'footer':"none", 'tab':"", 'scroll': false},
                "space_like": {'title':"我的喜欢", 'js':"space_like", 'view':"space_like", 'footer':"none", 'tab':"", 'scroll': false},
                "space_share": {'title':"我的分享", 'js':"space_share", 'view':"space_share", 'footer':"none", 'tab':"" },
                "space_grpsub": {'title':"我的吃群", 'js':"space_grpsub", 'view':"space_grpsub", 'footer':"none", 'tab':"", 'scroll': false},
                "space_faq": {'title':"我的问答", 'js':"space_faq", 'view':"space_faq", 'footer':"none", 'tab':"", 'scroll': false},
                "shop_book": {'title':"购物清单", 'js':"shop_book", 'view':"shop_book", 'footer':"none", 'tab':"", 'scroll': false},
                "score_orders": {'title':"兑换订单", 'js':"score_orders", 'view':"score_orders", 'footer':"none", 'tab':"", 'scroll': false},
                "score_logs": {'title':"馋豆记录", 'js':"score_logs", 'view':"score_logs", 'footer':"none", 'tab':"", 'scroll': false},
                "space_diary": {'title':"我的日记", 'js':"space_diary", 'view':"space_diary", 'footer':"none", 'tab':"", 'scroll': false},
                "atme_book": {'title':"@我的", 'js':"atme_book", 'view':"atme_book", 'footer':"none", 'tab':"", 'scroll': false},
                "cmtme_book": {'title':"回应我的", 'js':"cmtme_book", 'view':"cmtme_book", 'footer':"none", 'tab':"", 'scroll': false},
                "privmsgsum_book": {'title':"我的私信", 'js':"privmsgsum_book", 'view':"privmsgsum_book", 'footer':"none", 'tab':"", 'scroll': false},
                "privmsg_talk": {'title':"私信对话", 'js':"privmsg_talk", 'view':"privmsg_talk", 'footer':"none", 'tab':"", 'scroll': false},
                "privmsg_send": {'title':"发送私信 ", 'js':"privmsg_send", 'view':"privmsg_send", 'footer':"none", 'tab':"", 'scroll': false},
                "sysmsg_book": {'title':"系统消息", 'js':"sysmsg_book", 'view':"sysmsg_book", 'footer':"none", 'tab':"", 'scroll': false},
                "sitem_book": {'title':"兑换礼品", 'js':"sitem_book", 'view':"sitem_book", 'footer':"none", 'tab':"", 'scroll': false},
                "sitem_detail": {'title':"兑换礼品详情", 'js':"sitem_detail", 'view':"sitem_detail", 'footer':"none", 'tab':"", 'scroll': false},
                "gift_exchange": {'title':"填写兑换订单", 'js':"gift_exchange", 'view':"gift_exchange", 'footer':"none", 'tab':"", 'scroll': true},
                "user_login": {'title':"登陆馋口街", 'js':"user_login", 'view':"user_login", 'footer':"none", 'tab':"", 'scroll': false},
                "user_register": {'title':"注册馋口街", 'js':"user_register", 'view':"user_register", 'footer':"none", 'tab':"", 'scroll': true},
                "search": {'title':"搜索", 'js':"search", 'view':"search", 'footer':"none", 'tab':"", 'scroll': false},
                "setting_index": {'title':"个人设置", 'js':"setting_index", 'view':"setting_index", 'footer':"none", 'tab':"", 'scroll': true},
                "setting_basic": {'title':"个人资料", 'js':"setting_basic", 'view':"setting_basic", 'footer':"none", 'tab':"", 'scroll': true},
                "setting_password": {'title':"重设密码", 'js':"setting_password", 'view':"setting_password", 'footer':"none", 'tab':"", 'scroll': false},
                "setting_cover": {'title':"个人封面", 'js':"setting_cover", 'view':"setting_cover", 'footer':"none", 'tab':"", 'scroll': false},
                "load_page": {'title':"", 'js':"load_page", 'view':"load_page", 'footer':"none", 'tab':"", 'scroll': true}
        	};

            $.ui.autoLaunch = false;
            $.ui.transition = 'none';
            $.ui.pullRefreshEffect = !$.os.android;
            $.ui.backButtonText=" ";
            $.ui.loadingText="加载中...";
            $.ui.resetScrollers=false;
            //$.ui.loadDefaultHash = false;
            //$.ui.androidPerfHack = 0.5;
            
            //transition finished callback
            $.ui.transFinishCb = function(){
            	//$.vv.tip({close:true});
            	
            	var popup = $.ui.popup();
            	if(popup)popup.hide();
            	
            	if($.query('#Jtrans3dBlock').hasClass('showed')) $.vv.ui.toggleTrans3dBlk();
            	
                var sheet = $.ui.actionsheet();
                if(sheet) sheet.hide();
            };
            
            $.ui.launchExternal = function(href, sTitle) {
                //href = encodeURI(href);
                $.ckj.themeBrowser = cordova.ThemeableBrowser.open(encodeURI(href), '_blank', {
                    statusbar: {
                        color: '#00b000ff'
                    },
                    toolbar: {
                        height: $.os.ios ? 43 : 45,
                        color: '#00b000ff'
                    },
                    title: {
                        showPageTitle: true,
                        color: '#ffffffff'
                    },
                    backButton: {
                        image: 'angle_left',
                        imagePressed: 'angle_left_pressed',
                        align: 'left',
                        event: 'backPressed'
                    },
                    closeButton: {
                        image: 'cross',
                        imagePressed: 'cross_pressed',
                        align: 'right',
                        event: 'closePressed'
                    },
                    backButtonCanClose: true //ios action is OK, but not for android.(has been fixed)
                }).addEventListener('loadstart', function(e) {
                    //TODO:
                }).addEventListener('loadstop', function(e) {
                    //TODO:
                }).addEventListener('exit', function(e) {
                    $.ckj.themeBrowser.removeEventListener('loadstart');
                    $.ckj.themeBrowser.removeEventListener('loadstop');
                    if($.ckj.themeBrowser)$.ckj.themeBrowser = null;
                })
                return false;
            }
            
            var privPanels1 = ['space_index', 'setting_index', 'setting_basic', 'setting_password', 'setting_cover', 
                               'privmsgsum_book', 'atme_book', 'cmtme_book']; //no params need login
            var privPanels2 = ['faqans_publish', 'subject_share', 'recipe_share', 'rstrnt_share', 'diary_publish', 
                               'work_share', 'faq_publish', 'privmsg_talk'];//need login at anytime
            
            var initHiddenPanels = ['item_detail', 'album_detail', 'store_detail', 'brand_detail',
                                    'recipe_detail', 'rmenu_detail', 'work_detail', 'stuff_detail',
                                    'rstrnt_detail', 'rstimg_detail', 'group_detail', 'subject_detail', 'topic_detail',
                                    'faq_detail', 'faq_answer', 'diary_detail', 'space_index', 'load_page'];
            $.ui.onLoadDivHook = function(hashId, params, back) {
                $.vv.tip({'close':true});
                if(((privPanels1.indexOf(hashId) >= 0 && params.length < 1) || privPanels2.indexOf(hashId) >= 0) && !$.ckj.user.isLogin) {
                    $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                    return false;
                }
                if(!back && initHiddenPanels.indexOf(hashId) >= 0 ) {
                    document.getElementById(hashId).style.opacity = 0;
                }
                return true;
            }
            
        	BMap = null; //avoid uncaught exception
            
            $(document).ready(function() {
                $.ckj.hooks.online.push(function(){
                    $.loadJS($.ckj.cfg.mapi + '/static/js/hotfix.js?'+(new Date()).getTime());
                });

    	        var script = document.createElement("script");
    	        if (navigator.userAgent.match(/chrome_eu/, 'i')) { //>>> chrome emulator debug(no window.device)
    	        	//$.vv.log('============not on device===================');
					$.ckj.cfg.hasNET = true;
					$.ui.launch();

					$.ui.ready(function() {
						$.ajaxSettings.beforeSend   = $.ckj.beforeAjax;
						$.ajaxSettings.error        = $.ckj.ajaxError;
						$.ajaxSettings.timeout      = $.ckj.cfg.timeOut;
						$.vv.init();
						$.ckj.brsrDevInit(false);

						//on line copy here
						if($.ckj.hooks.online.length > 0) {    
							$.ckj.hooks.online.forEach(function(fn) {
								if($.isFunction(fn))fn();
							});
						}

						if(!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window))
						{   //chome normal debug
							script.src = "./afwk/plugins/af.desktopBrowsers.js";
							document.getElementsByTagName('head')[0].appendChild(script);
							
							var ioTest = true;
							if(ioTest) {
								$('#afui').addClass('ios'); //>>> for test
								$.os.ios = true;
							}
						}
						
					});
    	        } else {
    	        	/** we let the ui ready first, then prepare DeviceReady, 
    	        	 * so you shouldn't call any cordova function when the deviceready is all right
    	        	 */
    	        	$.ckj.cfg.onDevice = true;
    	        	
    	            script.src = "cordova.js";
    	            document.getElementsByTagName('head')[0].appendChild(script);
    	            document.addEventListener("deviceready", onDeviceReady, false);
    	            script = null;
    	                	            
    	            function onDeviceReady() {
    	            	$.ui.launch();
    	            	$.ui.ready(function() {
    	            	    $.vv.init();
    	            	    
        	            	setTimeout(function(){navigator.splashscreen.hide();}, 30);
        	            	
        	            	$.ajaxSettings.beforeSend   = $.ckj.beforeAjax;
                            $.ajaxSettings.error        = $.ckj.ajaxError;
                            $.ajaxSettings.timeout      = $.ckj.cfg.timeOut;
        	            	
        	            	onOnline(); //>>> start to check NETWORK

        	                document.addEventListener("offline", onOffline, false);
        	                document.addEventListener("online", onOnline, false);
        	                
        	                if($.os.android) {
        	                	document.addEventListener("backbutton", onBackKeyDown, false);
        	                	document.addEventListener("menubutton", onMenuKeyDown, false);
        	                }
        	                
        	                if(0) {
                                document.addEventListener("pause", function(){alert('paused');}, false);
                                document.addEventListener("resume", function(){alert('resumeed');}, false);  
                                document.addEventListener("volumeupbutton", function(){alert('volumeupbutton');}, false);
                                document.addEventListener("volumedownbutton", function(){alert('volumedownbutton');}, false);
        	                }

        	                $.ckj.brsrDevInit(true);
    	            	});
    	            }
    	            
    	            function onOffline() {
    	                $.ckj.cfg.hasNET = false;
    	                if($.ckj.hooks.offline.length > 0) {    
                            $.ckj.hooks.offline.forEach(function(fn) {
                                if($.isFunction(fn))fn();
                            });
                        }
    	            }
    	            
    	            function onOnline() {
    	            	var states = {};
    	                states[Connection.UNKNOWN]  = 'Unknown';
    	                states[Connection.ETHERNET] = 'Ethernet';
    	                states[Connection.WIFI]     = 'WiFi';
    	                states[Connection.CELL_2G]  = 'Cell2G';
    	                states[Connection.CELL_3G]  = 'Cell3G';
    	                states[Connection.CELL_4G]  = 'Cell4G';
    	                states[Connection.CELL]     = 'Cell';
    	                states[Connection.NONE]     = 'NoNET';
    	                $.ckj.cfg.netType = states[navigator.connection.type];
    	                if($.ckj.cfg.netType != 'NoNET') $.ckj.cfg.hasNET = true;

    	                if($.ckj.hooks.online.length > 0) {    
    	                    $.ckj.hooks.online.forEach(function(fn) {
						        if($.isFunction(fn))fn();
							});
    	                }
    	            }
    	            
    	            function onMenuKeyDown() {
    	            	$.ui.toggleSideMenu(); //>>> fuck, after cordova4.0, this does not work anymore
    	            }
    	            
    	            function onBackKeyDown() {
    	                
    	                //android < 4.3, softkey board ...
    	                if($.touchLayer && $.touchLayer.keyboardShowed) return;
    	                
    	            	if($.query('#tipbox').length > 0 && $.query('#tipbox').css('display') != 'hidden'){
    	            		$.vv.tip({'close':true});
    	            		return true;
    	            	}
    	            	
    	            	if($('#Jtrans3dBlock').hasClass('showed')) {
    	            	    $.vv.ui.toggleTrans3dBlk();
    	            	    return true;
    	            	}
    	            	
    	            	var popup = $.ui.popup();
    	            	if(popup){
    	            		popup.hide();
    	            		return true;
    	            	}
    	            	
    	            	var sheet = $.ui.actionsheet();
                        if(sheet){
                            sheet.hide();
                            return true;
                        }
                        
    	            	if($.ui.isSideMenuOn()){
    	            		$.ui.toggleSideMenu(false);
    	            		return true;
    	            	}
    	            	
    	            	if($.ui.history.length > 0){
    	            		$.ui.goBack();
    	            		return true;
    	            	}
    	            	
    	            	$.ui.popup({
    	            	    title:"退出馋口街",
    	            	    message:"您确定要退出吗？",
    	            	    cancelText:"取消",
    	            	    cancelCallback: null,
    	            	    doneText:"退出",
    	            	    supressFooter:false,
    	            	    cancelClass:'button',
    	            	    doneClass:'button',
    	            	    doneCallback: function () {
        	                    document.removeEventListener("backbutton", onBackKeyDown, false);
        	                    navigator.app.exitApp();
    	            	    },
    	            	    cancelOnly:false,
    	            	    blockUI:true
    	            	});
    	            }
    	        }
            });
        },
        brsrDevInit: function (onDevice) {
            window.setTimeout(function(){$('#Jtrans3dBlock').removeClass('hide')}, 300); //>>> 300 delay to allow browser to get layout ready
            
            $(document).on($.vv.cfg.clickEvt, "#header .backButton", function(e) {
                $.ui.goBack();
            });
            
            $("#menubadge").bind($.vv.cfg.clickEvt, function(e){
            	e.stopPropagation();e.preventDefault();
            	$.ui.toggleSideMenu();
            });
            
            if(onDevice){
            	$.query('#J_exit_app').on('click', function(e){
	        		e.stopPropagation();e.preventDefault();
	        		navigator.app.exitApp();
	        	});
                
                var ck = $.vv.ck.allCookie();
                $.vv.ck.set('cinfo', window.devicePixelRatio+'##'+$.vv.cfg.cWidth+'##'+$.vv.cfg.cHeight+'##'+
                                     device.platform+'##'+device.version+'##'+device.uuid+'##'+$.ckj.cfg.appVersion+'##'+$.os.xwalk);
                if($.os.android && parseInt(device.version) < 4) {
                	$.ckj.cfg.slowDev 	= true;
                	$.query('#afui').addClass('slowdev');
                	$.ckj.cfg.scrollBar = false;
                	$.ckj.cfg.formTrans = 'none';
                	$.ckj.cfg.cmtTrans = 'none';
                	$.ckj.cfg.splTrans = 'none';
                	$.ui.transitionTime = '300ms';
                }
                if($.os.ios) $.ui.transition = 'slide';
            } else {
	        	var ck = $.vv.ck.allCookie();
                $.vv.ck.set('cinfo', window.devicePixelRatio+'##'+$.vv.cfg.cWidth+'##'+$.vv.cfg.cHeight+
                                     '##PCBrowser##4.4##91a84devuuid1343sfg134'+'##'+$.ckj.cfg.appVersion+'##no');
            }
            
            $.ckj.initCkj();
        },
        /*** {{{ common misc functions ****/
        logOut: function (slient, back) {
            slient = slient || false;
            back = back || 0;
            
            $.vv.tip({icon:'loading'});
            $.ajax({
                url: $.ckj.cfg.mapi+'/?m=user&a=logout',
                type:'get',
                dataType: "json",
                success: function(rst){
                    $.vv.tip({close:true});
                    //$.vv.log('logout_user_info::', JSON.stringify(rst.data));
                    if(rst.status != 0){ //error happened
                        if(!slient) $.vv.tip({ content:rst.msg, icon:'error', time:3000}); 
                    } else {
                        $.vv.tip({ content:rst.msg, time:2000});
                        $.ckj.user.id       = 0;
                        $.ckj.user.name     = '';
                        $.ckj.user.isLogin  = false;
                        
                        if($.ckj.hooks.logout.length > 0) {    
                            $.ckj.hooks.logout.forEach(function(fn) {
                                if($.isFunction(fn))fn();
                            });
                        }
                        $.ui.removeBadge("#toMyHome")
                        
                        //$.query('#J_side_user_login').show();
                        //$.query('#J_side_user_logout').hide();
                        //$.ui.toggleSideMenu(false);

                        if(back>0) $.ui.loadContent('#user_login/'+back, false, false, $.ckj.cfg.formTrans);
                        if($.ui.activeDiv.id == 'setting_index') {
                            $.ui.loadContent('#ckj_index', false, false, $.ckj.cfg.formTrans);
                            $.ui.clearHistory();
                            $('#menubadge').css('float', 'left');
                        }
                    }
                },
                error: function(xhr, why) {
                    if(why != 'panelhided' && !slient) $.vv.tip({icon:'error', content:$.vv.ajaxErrMsg(why ? why : xhr.status), time:3000});
                }
            });
        },
        initCkj: function() {
        	/***** init user *****/
        	var ck = $.vv.ck.allCookie();
        	if(ck && ck['user_info'] && ck.user_info.id && ck.user_info.username){
        		$.ckj.user.id 	= ck.user_info.id;
        		$.ckj.user.name = ck.user_info.username;
        		$.ckj.user.isLogin = true;
        		$.query('#J_side_user_logout').html('<a><i class="fa fa-logout"></i>退出('+$.vv.util.equalSubStr($.ckj.user.name, 5)+')</a>').show();
        		$.query('#J_side_user_login').hide();
        	} else {
    			$.query('#J_side_user_logout').hide();
    			$.query('#J_side_user_login').show();
        	}
        	//$.vv.log('vvcookie::', ck);
        	/***** init captcha *****/
        	$('body').on('click', '.J_captcha_img, .J_captcha_change', function(e){
        		e.stopPropagation();e.preventDefault();
        		var $that = $(this);
        		$.ajax({
                    url: $.ckj.cfg.mapi+'/vc.php?rand='+Math.random(),
                    type:'get',
                    success: function(data){
                    	var srcData = "data:image/png;base64,"+data;
                    	if($that.hasClass('J_captcha_change')){ 
                    		$.query($that.attr('relImg')).attr('src', srcData);
                    	} else {
                    		$that.attr('src', srcData); 
                    	}
                    },
                    dataType: "text"
               });
        	});
        	/**** logout *****/
        	$('#afui').on('click', '.J_user_logout', function(e){
        		e.stopPropagation();e.preventDefault();
        		$.ui.popup( {
            	    title:"退出登录",
            	    message:"保持登陆状态可随时收集好吃的哦~， 确定要退出登录吗？",
            	    cancelText:"取消",
            	    cancelCallback: null,
            	    doneText:"退出",
            	    supressFooter:false,
            	    cancelClass:'button',
            	    doneClass:'button',
            	    doneCallback: function () {
                        $.ckj.logOut();
            	    },
            	    cancelOnly:false,
            	    blockUI:true
            	});
        	});
        	
        	/** pop up list btn: for op my collections */
        	$.query('#afui').on('click', '#J_listOpts > p', function(e){
        		e.stopPropagation(); e.preventDefault();
                var $this = $(this);
        		if($this.hasClass('J_lopCel')){ $.ui.popup().hide(); return; }
        		
        		if($this.hasClass('J_lopGoHash')){ $.ui.loadContent($this.attr('aUrl'),false,false); return; }
        		
        		if($this.hasClass('J_lopDoAjax')){
        			var tipTit=$this.attr('tipTit'), tipmsg=$this.attr('tipMsg'), acturl = $this.attr('aUrl'), 
        				listOp = $.query('#J_listOpts');//>>> listOp must captured here
        				
            		$.ui.popup({
                	    title:tipTit,  message:tipmsg, cancelText:"取消", cancelCallback: null,
                	    doneText:'确定', supressFooter:false, cancelClass:'button',  doneClass:'button',
                	    doneCallback: function () {
                	    	$.vv.tip({icon:'loading'});
                	    	$.ajax({
                                url: $.ckj.cfg.mapi + acturl,
                                success: function(rst){
                                	$.vv.tip({close:true});
                                	if(rst.status != 0 && rst.status != 8){ //error happened
                                		$.vv.tip({ content:rst.msg, icon:'error', time:3000}); 
                                	} else {
                                		//del rel domEle
                                		var wallId = listOp.attr('wallId'), wall = $.query('#'+wallId), iType = listOp.attr('iType'), 
                                		    delEle = $('#'+wallId+' '+iType+'[did="'+listOp.attr('rId')+'"]');
                                		//$.vv.log('====iType::'+iType);
                                    	$(delEle).css3Animate({
                                    		opacity: 0,
                                    	    time: "350ms",
                                    	    complete: function () {
                                    	    	$(delEle).remove();
                                    	    	 //remasonry
                                            	if(wall.attr('masonry') == 'y') $.feed.reMasonry('#'+wallId);
                                            	else wall.css('height', 'auto');
                                            	$.query(wall.attr('relWrap')).scroller().correctScroll();
                                    	    }
                                    	});
                                	}
                                	listOp = null; //>>> listOp must freed here
                                },
                                dataType: "json"
                           });
                	    },
                	    cancelOnly:false,
                	    blockUI:true
                	});
        			return;
        		}
        	});
        	
            if($.ckj.cfg.hasNET) {
                $.ckj.msgTip(true);
                
                if(!$.ckj.msgTipHandler){
                    $.ckj.msgTipHandler = setInterval($.ckj.msgTip, $.vv.cfg.debug ? 30000 : 20000);
                }
            }
            
            $.ckj.hooks.logout.push(function(){
                $.ckj.clearMsgBadge();
                if($.privmsgTalk) $.privmsgTalk.ftId = 0;
                if(window.cache)window.cache.clear(null, null);
            });
            
            $.ckj.hooks.online.push(function(){
                if($.ckj.msgTipHandler) {
                    clearInterval($.ckj.msgTipHandler);
                    $.ckj.msgTipHandler = null;
                }
                $.ckj.msgTip(true);
                $.ckj.msgTipUpdating = false;
                $.ckj.msgTipHandler = setInterval($.ckj.msgTip, $.vv.cfg.debug ? 30000 : 20000);
            });
            
            $.ckj.hooks.offline.push(function(){
                if($.ckj.msgTipHandler) {
                    clearInterval($.ckj.msgTipHandler);
                    $.ckj.msgTipHandler = null;
                    $.ckj.msgTipUpdating = false;
                }
            });
        	              
        	//>>> for simple form panel(.JvvComSubmitBtn is in the header)
            $('#afui').on('click', '.JvvComSubmitBtn', function(){
               $($(this).attr('vv-form')).submit(); 
            });
        },
        clearMsgBadge: function() {
            $.ckj.toHomeRmBadge("#toMyHome");
            $.ui.removeBadge("#J_spidx_fans");
            $.ui.removeBadge("#J_spidx_atme");
            $.ui.removeBadge("#J_spidx_cmtme");
            $.ui.removeBadge("#J_spidx_privmsg");
            $.ui.removeBadge("#J_spidx_system");
        },
        toHomeRmBadge: function(){
            $('header a[id="toMyHome"]').each(function(){
                $.ui.removeBadge(this);
            });
        },
        toHomeAddBadge: function(){
            $('header a[id="toMyHome"]').each(function(){
                $.ui.updateBadge(this,'',"tr");
            });
        },
        msgTipHandler:null,
        msgTipUpdating:false,
        msgTip: function(force) {
        	if(!$.ckj.user.id || !$.ckj.cfg.hasNET || ($.ckj.msgTipUpdating && !force)) return;
        	$.ckj.msgTipUpdating = true;
            $.ajax({
                url: $.ckj.cfg.mapi + '/?m=user&a=msgtip',
                type: 'POST',
                dataType: 'json',
                noQueue: true,
                success:function(r){
                    if(r.status == 0){
                        if(r.data.uid != $.ckj.user.id) {
                            $.ckj.clearMsgBadge();
                        } else  {
                            var tips = r.data.msgTips,
                                fans    = tips.fans ? parseInt(tips.fans) : 0,
                                atme    = tips.atme ? parseInt(tips.atme) : 0,
                                cmtme   = tips.cmtme ? parseInt(tips.cmtme) : 0,
                                msg     = tips.msg ? parseInt(tips.msg) : 0,
                                system =  tips.system ? parseInt(tips.system) : 0,
                                msgtotal = fans + atme + cmtme + msg + system;
                            msgtotal > 0 ? $.ckj.toHomeAddBadge() : $.ckj.toHomeRmBadge();
                            //$.vv.log('msgtotal::'+msgtotal+' fans::'+fans+' atme::'+atme+' cmtme::'+cmtme+' msg::'+msg+' system::'+system);
                            //$.vv.log('$.ui.activeDiv.id::'+$.ui.activeDiv.id+' $.spaceIndex.cfg.uid::'+$.spaceIndex.cfg.uid+' $.ckj.user.id::'+$.ckj.user.id);
                            if($.ui.activeDiv.id == 'space_index' && $.spaceIndex.cfg.uid == $.ckj.user.id){
                                fans > 0 ? $.ui.updateBadge("#J_spidx_fans",'',"tr") : $.ui.removeBadge("#J_spidx_fans");
                                atme > 0 ? $.ui.updateBadge("#J_spidx_atme",'',"tr") : $.ui.removeBadge("#J_spidx_atme");
                                cmtme > 0 ? $.ui.updateBadge("#J_spidx_cmtme",'',"tr") : $.ui.removeBadge("#J_spidx_cmtme");
                                msg > 0 ? $.ui.updateBadge("#J_spidx_privmsg",'',"tr") : $.ui.removeBadge("#J_spidx_privmsg");
                                system > 0 ? $.ui.updateBadge("#J_spidx_system",'',"tr") : $.ui.removeBadge("#J_spidx_system");
                            }
                        }
                    }
                    $.ckj.msgTipUpdating = false;
                },
                error: function(xhr, why) {
                    $.ckj.msgTipUpdating = false;
                }
            });
        },
        loadBMapApi: function(){ //load bd api: copied from http://api.map.baidu.com/api?type=quick&ak=xx&v=1.0 // must set the domain whitelist to "*"
        	if(!BMap) { //http://api.map.baidu.com/getscript?v=2.0&ak=w46ZXao6ucpNYdGn12UWcP59&services=
        		var ak = 'AHhRGXBBdH3leGoMPeTbTtAv';
        		window.BMap_loadScriptTime = (new Date).getTime();
		        $.query('#J_baidu_api').remove();
	        	var script1 = document.createElement("script");
	        	script1.src = "http://api.map.baidu.com/getscript?v=2.0&ak="+ak+"&services=";
	        	script1.id="J_baidu_api";
	        	document.getElementsByTagName('head')[0].appendChild(script1);
        	}
        	return;
        },
        centerImg:function(img, outH, outW){
        	if(!outH && !outW) return;
    		var height = parseInt(img.height), width = parseInt(img.width), dTop, dLeft, cssObj={};
    		if(img.naturalWidth < 10) {
    		    var errImg = img.getAttribute('errimg');
                if(errImg) img.src = errImg;
                else {
                    if(width > 150) img.src = 'data/default/no_pic_600.jpg';
                    else img.src = 'data/default/no_pic_300.jpg';
                }
    		}
    		
    		if(height < 1 || width < 1) return;
    		if(outH && outH > 1) {
    			dTop = (height - outH)/2;
    			cssObj['margin-top'] = '-'+dTop+'px';
    		}
    		if(outW && outW > 1) {
    			dLeft = (width - outW)/2;
    			cssObj['margin-left'] = '-'+dLeft+'px';
    		}
    		if($.vv.cfg.debug || $.os.ios)cssObj['opacity'] = 1; //for iOS dynamic showing
    		//$.vv.log('imgHeight::'+height+'  imgWidth::'.width+' outHeight::'+outH+'  outWidth::'+outW);
    		$(img).css(cssObj).removeAttr('onload onerror');
    		
        },
        onImgLoad: function(img, deltri){
            //sometimes img onerror does not work
            if(img.naturalWidth < 10) {
                var errImg = img.getAttribute('errimg');
                if(errImg) img.src = errImg;
                else {
                    if(img.width > 150) img.src = 'data/default/no_pic_600.jpg';
                    else img.src = 'data/default/no_pic_300.jpg';
                }
            }
            if($.vv.cfg.debug || $.os.ios)$(img).css('opacity', 1)
            if(deltri !== false) $(img).removeAttr('onload onerror');
        },
        onImgError: function(img, mod, deltri) {
            var $img = $(img),
                errImg = img.getAttribute('errimg');
            if(errImg) img.src = errImg;
            else {
                if(img.width > 150) img.src = 'data/default/no_pic_600.jpg';
                else img.src = 'data/default/no_pic_300.jpg';
            }

            if($.vv.cfg.debug || $.os.ios) $img.css('opacity', 1);
            if(deltri !== false) $img.removeAttr('onload onerror');
        },
        /*for back performance*/
        hideWallRcds: function(wallRcds, scrollH){
        	if(wallRcds.length > 1) {
				setTimeout(function(){
    				var clientH = $.query('#afui').height(), topM = scrollH - clientH, bottomM = scrollH + 2*clientH, offTop = 0;
    				//$.vv.log('recipes::' +wallRcds.length+ ' clientH::' +clientH+ ' scrollH::' +scrollH);
    				$.each(wallRcds, function(idx, r){
    					offTop = r.top;
    					//$.vv.log('offTop:: '+offTop+' scrollH::'+scrollH+' clientH::'+clientH+' topM::'+topM+' bottomM::'+bottomM+' test hide::'+(offTop < topM || offTop > bottomM));
    					if(offTop < topM || offTop > bottomM) {
    						if(!r.hide) { 
    							$(r.node).remove();
    							r.hide = true;
    						}
    					} 
    				});
				}, 100);
			}
        },
        showHideWallRcds: function(wallRcds, wallSel){
        	//$.vv.log('wallRcds.length::'+wallRcds.length);
			if(wallRcds.length > 1) {
				var wall = $.query(wallSel);
				setTimeout(function(){
    				$.each(wallRcds, function(idx, r){
    					//$.vv.log('r.hide::'+r.hide);
						if(r.hide) {
							wall.append(r.node);
							r.hide = false;
						}
    				});
				}, 50);
			}
        },
        //social share
        sShare: function(si, msgArr){
        	if($.ckj.cfg.freeShare){ //social share plugin
    			var tmpMsg = msgArr[parseInt(msgArr.length * Math.random())],
    				msg = tmpMsg.pre + si.sname + tmpMsg.suf,
    				subject = si.stitle;
        		window.plugins.socialsharing.share(msg, subject, si.imgUrl, si.dtlUrl);
    		} else { //baidu share plugin
    			var tmpMsg = msgArr[parseInt(msgArr.length * Math.random())],
    				content = tmpMsg.pre + si.sname + tmpMsg.suf,
    				title 	= si.stitle;
        		
    			window.plugins.Baidushare.bdshare( title, content, si.dtlUrl, si.imgUrl,
        			function(success) {
        			    $.vv.log("encode success: " + success);
        			},
        			function(fail) { 
        			    $.vv.log("encoding failed: " + fail); 
        			}
        		);
    		}
        },
        
        badReport: function(title, rtype, rid) {
            if(!$.ckj.user.id) {
                $.ui.loadContent('#user_login', false, false, $.ckj.cfg.formTrans);
                return;
            }
            
            var jPopup = $.ui.popup( {
                id:'J_badReportPopup',
                title: title,
                message:'<textarea name="remark" placeholder="请填写举报原因"></textarea>',
                cancelText:"取消",
                cancelCallback: null,
                doneText:"举报",
                supressFooter:false,
                cancelClass:'button',
                doneClass:'button',
                autoCloseDone: false,
                cancelOnly:false,
                blockUI:true,
                
                doneCallback: function () {
                    var remark = $('#J_badReportPopup textarea').val().trim();
                    if(remark.length < 6) {
                        $.vv.tip({content:'举报原因不少于6个字!', icon:'error'});
                        return true;
                    }
                    
                    $.ajax({
                        url: $.ckj.cfg.mapi + '/?m=report&a=index',
                        type:'post',
                        data:{'rtype': rtype, 'rid': rid, 'remark': remark},
                        dataType: "json",
                        success: function(r){
                            if(r.status == 0)
                                $.vv.tip({content:r.msg, icon:'success'});
                            else 
                                $.vv.tip({content:r.msg, icon:'error'});
                                
                            jPopup.hide();
                        },
                        error:function(xhr, err) {
                            if(err == 'timeout')$.vv.tip({ content:'请求超时，请稍后再试!', icon:'error'});
                            else $.vv.tip({ content:'请求出错，请稍后再试!', icon:'error'});
                            jPopup.hide();
                        }
                    });
                }
            });
        },
        /*** common misc functions}}} ****/
        
        /**** {{{ render functions ****/
        //render followship: oid: 
        renderFollowShipBtn: function(tuid, vuid, fship, rsId) {
        	rsId = rsId || '';
        	if(tuid == vuid) return '';
        	else if(fship === 0){
        		return '<div id="'+rsId+'" class="follow_u J_fo_u" data-uid="'+tuid+'"><i class="fa fa-user-add-o"></i><e class="tip">关注</e></div>';
        	} else if(fship == 1){
        		return '<div id="'+rsId+'" class="follow_u J_unfo_u" data-uid="'+tuid+'"><i class="fa fa-check"></i><e class="tip">已关注</e></div>';
        	} else if(fship == 2){
        		return '<div id="'+rsId+'" class="follow_u J_unfo_u" data-uid="'+tuid+'"><i class="fa fa-transfer"></i><e class="tip">已关注</e></div>';
        	}
			return '';
        },
        //render pop up keys
        renderPopupKeys: function(keys, ck) {
        	if(!keys) return '';
        	var html   = '';
        	ck = ck ? ck : 0;
    		$.each(keys, function(idx, key) {
    			if(key == ck) html += '<a class="active">'+key+'</a>';
    			else html += '<a>'+key+'</a>';
        	});
        	return html;
        },
        //render pop up showed cates
        renderPopupCates: function(cates, cid) {
        	if(!cates) return '';
        	var html   = '';
        	cid = cid ? cid : 0;
    		$.each(cates, function(idx, cate){
    			if(cid == cate['id']) html += '<a class="active" cid='+cate['id']+'>'+cate['name']+'</a>';
    			else html += '<a cid='+cate['id']+'>'+cate['name']+'</a>';
        	});
        	return html;
        },
        //render comments
        renderComments: function(data) {
            if(!$.isFunction($.ckj.dotRenders.comments)) {
                $.ckj.dotRenders.comments = doT.template(document.getElementById('JdotTplComments').text);
            } 
            return $.ckj.dotRenders.comments(data);
        },
        renderItems: function(data, wall){
            data.wall = wall;
        	if(!$.isFunction($.ckj.dotRenders.items)) {
                $.ckj.dotRenders.items = doT.template(document.getElementById('JdotTplItems').text);
            } 
            return $.ckj.dotRenders.items(data);
        },
        renderAlbums: function(data, wall){
            data.wall = wall;
        	if(!$.isFunction($.ckj.dotRenders.albums)) {
                $.ckj.dotRenders.albums = doT.template(document.getElementById('JdotTplAlbums').text);
            } 
            return $.ckj.dotRenders.albums(data);
        },
        renderRecipes: function(data, wall) {
            data.wall = wall;
            if(!$.isFunction($.ckj.dotRenders.recipes)) {
                $.ckj.dotRenders.recipes = doT.template(document.getElementById('JdotTplRecipes').text);
            } 
            return $.ckj.dotRenders.recipes(data);
        },
        renderRmenus: function(data) {
            if(!$.isFunction($.ckj.dotRenders.rmenus)) {
                $.ckj.dotRenders.rmenus = doT.template(document.getElementById('JdotTplRmenus').text);
            } 
            return $.ckj.dotRenders.rmenus(data);
        },
        renderWorks: function(data, wall) {
            data.wall = wall;
            if(!$.isFunction($.ckj.dotRenders.works)) {
                $.ckj.dotRenders.works = doT.template(document.getElementById('JdotTplWorks').text);
            } 
            return $.ckj.dotRenders.works(data);
        },
        renderStuffs: function(data){
            if(!$.isFunction($.ckj.dotRenders.stuffs)) {
                $.ckj.dotRenders.stuffs = doT.template(document.getElementById('JdotTplStuffs').text);
            } 
            return $.ckj.dotRenders.stuffs(data);
        },
        renderRstrnts: function(data, wall) {
            data.wall = wall;
            if(!$.isFunction($.ckj.dotRenders.rstrnts)) {
                $.ckj.dotRenders.rstrnts = doT.template(document.getElementById('JdotTplRstrnts').text);
            } 
            return $.ckj.dotRenders.rstrnts(data);
        },
        renderRstimgs: function(data, wall) {
            data.wall = wall;
            if(!$.isFunction($.ckj.dotRenders.rstimgs)) {
                $.ckj.dotRenders.rstimgs = doT.template(document.getElementById('JdotTplRstimgs').text);
            } 
            return $.ckj.dotRenders.rstimgs(data);
        },
        renderStores: function(data) {
            if(!$.isFunction($.ckj.dotRenders.stores)) {
                $.ckj.dotRenders.stores = doT.template(document.getElementById('JdotTplStores').text);
            } 
            return $.ckj.dotRenders.stores(data);
        },
        renderBrands: function(data, wall) {
            data.wall = wall;
            if(!$.isFunction($.ckj.dotRenders.brands)) {
                $.ckj.dotRenders.brands = doT.template(document.getElementById('JdotTplBrands').text);
            }
            return $.ckj.dotRenders.brands(data);
        },
        renderGroups: function(data, wall) {
            data.wall = wall;
            if(!$.isFunction($.ckj.dotRenders.groups)) {
                $.ckj.dotRenders.groups = doT.template(document.getElementById('JdotTplGroups').text);
            }
            return $.ckj.dotRenders.groups(data);
        },
        renderSgroups: function(data) {
            if(!$.isFunction($.ckj.dotRenders.sgroups)) {
                $.ckj.dotRenders.sgroups = doT.template(document.getElementById('JdotTplSGroups').text);
            } 
            return $.ckj.dotRenders.sgroups(data);
        },
        renderSubjects: function(data, wall) {
            data.wall = wall;
            if(!$.isFunction($.ckj.dotRenders.subjects)) {
                $.ckj.dotRenders.subjects = doT.template(document.getElementById('JdotTplSubjects').text);
            }
            return $.ckj.dotRenders.subjects(data);
        },
        renderGrpSubs: function(data) {
            if(!$.isFunction($.ckj.dotRenders.grpsubs)) {
                $.ckj.dotRenders.grpsubs = doT.template(document.getElementById('JdotTplGrpsubs').text);
            } 
            return $.ckj.dotRenders.grpsubs(data);
        },
        renderGrpMems: function(data) {
            if(!$.isFunction($.ckj.dotRenders.grpmems)) {
                $.ckj.dotRenders.grpmems = doT.template(document.getElementById('JdotTplGrpmems').text);
            } 
            return $.ckj.dotRenders.grpmems(data);
        },
        renderBookUsers: function(data, wall) {
            data.wall = wall;
            if(!$.isFunction($.ckj.dotRenders.users)) {
                $.ckj.dotRenders.users = doT.template(document.getElementById('JdotTplUsers').text);
            } 
            return $.ckj.dotRenders.users(data);
        },
        renderFaqs: function(data) {
            if(!$.isFunction($.ckj.dotRenders.faqs)) {
                $.ckj.dotRenders.faqs = doT.template(document.getElementById('JdotTplFaqs').text);
            } 
            return $.ckj.dotRenders.faqs(data);
        }
        /**** render functions}}} ****/
    };

    if($.os.android && $.os.androidVerson < 4.1 ){
        window.setTimeout(function(){$.ckj.init();}, 100); //>>> old android is annoying
    } else {
        $.ckj.init();
    }
    
    //web url => app uri; data-orig => src; 
    $.fn.cntTrans = function(opts){
        this.each(function() {
            var $this   = $(this);
            
            if(opts.origTrans) {
                $this.find('img').each(function(){
                    var $img = $(this),
                        orgSrc = $img.attr('data-orig');
                    if(orgSrc) {
                        if(orgSrc.indexOf('http') === -1)$img.attr('src', $.ckj.cfg.siteUrl + orgSrc);
                        else $img.attr('src', $.ckj.cfg.siteUrl + orgSrc);
                    } else {
                        var src = $img.attr('src');
                        if(src.indexOf('http') === -1)$img.attr('src', $.ckj.cfg.siteUrl + src);
                    }
                });
            }
            
            if(opts.urlTrans) {
                var nhtml   = $this.html();
                nhtml = nhtml.replace(/<a.+?href=".+?".*?>/g, function(link){
                    var href = link.replace(/.*?href="(.+?)".*/g, '$1'),
                        arr = [];
                    if( href[0] != '/' && !/^http.*?chankoujie.*/gi.test(href)) return link;
                    href = href.replace(/^(https?.+?.com)?\/+/gi, '');
                    if(href[0] == '_')return link;
                    if(href.indexOf('/') < 0) {
                        var p = $.vv.util.parseQuery(href);
                        if(!p.m) return link;
                        arr[0] = p.m;
                        if(p.id) arr[1] = 'detail';
                        else if(p.a == 'home') arr[1] = 'home';
                        else arr[1] = p.a ? p.a : 'index';
                    } else {
                        arr = href.split('/');
                        if(/^\d+/g.test(arr[1])) {
                            arr[1] = 'id='+numOnly(arr[1]);
                            arr.splice(1, 0, "detail");
                        } else if (arr[1] == 'home') {
                            arr[1] = 'detail';
                        } else if (arr[1][0] == '?') {
                            arr.splice(1, 0, "index");
                        }
                    }

                    var p2 = $.vv.util.parseQuery(arr[2]);
                    
                    if(p2.id && arr[1] == 'detail'){
                        return link.replace(/href=".+?"/g, 'href="#'+arr[0]+'_detail/'+p2.id +'"');
                    } else if(p2.uid && arr[0] == 'space') {
                        return link.replace(/href=".+?"/g, 'href="#'+arr[0]+'_index/'+p2.uid+'"');
                    }
                    
                    return link;
                });
            }
            $this.html(nhtml);
        });
        return this;
    }
})(af);
