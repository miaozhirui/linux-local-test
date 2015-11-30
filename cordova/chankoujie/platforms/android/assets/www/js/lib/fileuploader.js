(function ($) {
    $.fn.uploader = function (opts) {
    	return new uploader(this[0], opts);
    };
    
    var uploader = function (upBtnElEl, opts) {
        if (typeof upBtnElEl === "string" || upBtnElEl instanceof String) {
            this.upBtnEl = document.getElementById(upBtnElEl);
        } else { this.upBtnEl = upBtnElEl; }

        for (var j in opts) {
            this[j] = opts[j];
        }
        
        var that = this;
        $(this.upBtnEl).bind('click', function(e){
        	e.stopPropagation();e.preventDefault();
        	$(that.ctx).actionsheet(
        		[{
        			text: '拍照上传',
        			cssClasses: '',
        			handler: function () {
        				that.fromCamera();
        			}
        		}, {
        			text: '从相册中选取',
        			cssClasses: '',
        			handler: function () {
        				that.fromAlbum();
        			}
        		}]
        	);
        });
    };

    uploader.prototype = {
    	btnId: '', 
       	inputId:'J_banner', //for record the img url from server
       	upFileName: 'file', //select file input
       	quality:80, //jpg pic quality
       	allowEdit:true,
       	tWidth:1600,
       	tHeight:1200,
       	savePic:true,
        actionUrl: '',
        onSubmit: null, 
        onProgress:null, 
        onComplete: null, 
        onAbort:null, 
        progressBox:null, 
        maxSize:0,
        params:null,
        ctx:'#afui',
        upErrorMsg:{1:'未找到文件', 2:'无效文件地址', 3: '链接服务器错误', 4: '已被终止', 5:'文件未变化'},
        
        fromCamera: function(){
        	$.vv.log('fromCamera handler entered===>');
        	var that = this, 
        	    opts = {
        	        sourceType : Camera.PictureSourceType.CAMERA,
                    destinationType : Camera.DestinationType.FILE_URI,
                    correctOrientation: true,
                    quality : that.quality,
                    allowEdit : that.allowEdit,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: that.tWidth,
                    targetHeight: that.tHeight
        	    };
        	    
        	if(!($.os.android && $.os.androidVersion < 4.4)) opts.saveToPhotoAlbum = that.savePic;
        	
        	navigator.camera.getPicture(
        	    function(imageURI){that.onCameraUriOK(imageURI);},
        		function(message){that.onCameraUriFail(message);},
        		opts
        	);
        },
        
        fromAlbum: function(){
        	$.vv.log('fromAlbum handler entered===>');
        	var that = this;
            navigator.camera.getPicture(
                function(imageURI){that.onAlbumUriOK(imageURI);},
            	function(message){that.onAlbumUriFail(message);},
            	{
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM ,
 	                destinationType:Camera.DestinationType.FILE_URI,
 	                encodingType:Camera.EncodingType.JPEG,
 	                mediaType:Camera.MediaType.PICTURE,
 		    		targetWidth: that.tWidth,
 		    		targetHeight: that.tHeight
	    		}
	    	);
        },
        
        onCameraUriOK: function (imageURI) {
    	    $.vv.log('camera imageURI====>' + imageURI);
    	    this.upload(imageURI);
    	},

    	onCameraUriFail: function (message) {
    		var cmsg = message;
    		$.vv.log('onCameraUriFail=========' + message.toLowerCase().trim());
    		if(/(cancelled|selected)/g.exec(message.toLowerCase().trim())) return;
    		$.vv.tip({content:cmsg, icon:'error'});
    	},
        
    	onAlbumUriOK: function (imageURI) {
    		$.vv.log('album imageURI====>' + imageURI);
        	this.upload(imageURI);
    	},

    	onAlbumUriFail: function (message) {
    		var cmsg = message;
    		$.vv.log('onAlbumUriFail=========' + message.toLowerCase().trim());
    		if(/(cancelled|selected)/g.exec(message.toLowerCase().trim())) return;
    		$.vv.tip({content:cmsg, icon:'error'});
    	},
    	
    	upload: function(imageURI) {
    		$.vv.log('upload with imageURI====>' + imageURI);
    		var that = this, options = new FileUploadOptions();  
            options.fileKey 	= this.upFileName;  
            options.fileName 	= imageURI.substring(imageURI.lastIndexOf('/')+1, imageURI.lastIndexOf('.')) + '.jpg';
            options.mimeType  	= "image/jpeg";  

            if(this.params) options.params = this.params;  

            var vvCookie = window.localStorage.getItem('vvcookie');
	        if(vvCookie) {
	        	var headers={'vvcookie': escape(vvCookie)};
	        	options.headers = headers;
	        }
	         
	        $.vv.log('upload with opstions====>' + JSON.stringify(options));
	         
            var ft = new FileTransfer();
            if(this.onProgress){
            	ft.onprogress = function(progressEvent) {
            		that.onProgress(progressEvent);
            	};
            }
            
            if(this.onSubmit) this.onSubmit();
            
            ft.upload( imageURI,  encodeURI(this.actionUrl), 
            	function(rst){that.uploadOK(rst);},  function(err){that.uploadFail(err);}, options);  
    	},
    	
    	uploadOK: function(rst){
            if(this.onComplete){
            	this.onComplete(JSON.parse(rst.response));
            }
    	},
    	
    	uploadFail: function(err){
    		if(this.onError){
                this.onError(this.upErrorMsg(err.code));
            } else {
                $.vv.tip({content:this.upErrorMsg(err.code), icon:'error'});
            }
    	}
    };
})(af);