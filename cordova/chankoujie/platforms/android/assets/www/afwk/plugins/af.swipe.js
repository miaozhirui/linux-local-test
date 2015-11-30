/**
 * af.web.swipe - a swipe library for App Framework apps
 * based af.web.carousel
 */
(function($) {
    var cache = [];
    var objId=function(obj){
        if(!obj.afmSwipeId) obj.afmSwipeId=$.uuid();
        return obj.afmSwipeId;
    };
    $.fn.swipe = function(opts) {
        var tmp, id;
        for (var i = 0; i < this.length; i++) {
            //cache system
            id = objId(this[i]);
            if(!cache[id]){
                tmp = new swipe(this[i], opts);
                cache[id] = tmp;
            } else {
                tmp = cache[id];
            }
        }
        return this.length == 1 ? tmp : this;
    };

    var swipe = (function() {
        var translateOpen =$.feat.cssTransformStart;
        var translateClose = $.feat.cssTransformEnd;

        var swipe = function(containerEl, opts) {
            if (typeof containerEl === "string" || containerEl instanceof String) {
                this.container = document.getElementById(containerEl);
            } else {
                this.container = containerEl;
            }
            if (!this.container) {
                alert("Error finding container for swipe " + containerEl);
                return;
            }
            if (this instanceof swipe) {
                for (var j in opts) {
                    if (opts.hasOwnProperty(j))this[j] = opts[j];
                }
            } else {
                return new swipe(containerEl, opts);
            }

            var that = this;
            af(this.container).bind('destroy', function(e){
                var id = that.container.afmSwipeId;
                //window event need to be cleaned up manually, remaining binds are automatically killed in the dom cleanup process
               window.removeEventListener("orientationchange", that.orientationHandler, false);
               if(cache[id]) delete cache[id];
               e.stopPropagation();
            });

            // initial setup
            this.container.style.overflow = "hidden";
            this.container.style.visibility = 'hidden';
            if (this.vertical) this.horizontal = false;

            var el = document.createElement("div");
            this.container.appendChild(el);
            var $el=$(el);
            
            var $container=$(this.container);
            var data = Array.prototype.slice.call(this.container.childNodes);
            while(data.length>0)
            {
                var myEl=data.splice(0,1);
                myEl=$container.find(myEl);
                if(myEl.get(0)===el) continue;
                $el.append(myEl.get(0));
            }
            if (this.horizontal) {
                el.style.display = "block";
                el.style['float']="left";
            }
            else {
                el.style.display = "block";
            }

            this.el = el;
            this.myDivWidth = numOnly(this.container.clientWidth);
            this.myDivHeight = numOnly(this.container.clientHeight);
            
            this.refreshItems();
            var afEl = af(el);
            afEl.bind('touchmove', function(e) {that.touchMove(e);});
            afEl.bind('touchend', function(e) {that.touchEnd(e);});
            afEl.bind('touchstart', function(e) {that.touchStart(e);});
            afEl.bind('transitionend webkitTransitionEnd', function(e) {that.transitionEnd(e);});
          //  this.orientationHandler = function() {that.onMoveIndex(that.swipeIndex,0);};
            window.addEventListener("orientationchange", this.orientationHandler, false);
            if(this.idxSelector){
            	$(this.idxSelector).bind('click', function(){
            		that.onMoveIndex($(that.idxSelector).index(this), that.sTime);
            	});
            }
        };

        swipe.prototype = {
            wrap:true,
            startX: 0,
            startY: 0,
            dx: 0,
            dy: 0,
            myDivWidth: 0,
            myDivHeight: 0,
            cssMoveStart: 0,
            childrenCount: 0,
            swipeIndex: 0,
            vertical: false,
            horizontal: true,
            el: null,
            movingElement: false,
            container: null,
            idxSelector: null,
            idxActiveCls: "active",
            idxCallback: null,
            lockMove:false,
            okToMove: false,
            delay:0,
            sTime:200,
            interval:null,

            // handle the moving function
            touchStart: function(e) {
                this.lockMove=false;
                if (e.touches[0].target && e.touches[0].target.type !== undefined) {
                    var tagname = e.touches[0].target.tagName.toLowerCase();
                    if (tagname === "select" || tagname === "input" || tagname === "button") return;
                }
                if (e.touches.length === 1) {
                    this.movingElement = true;
                    this.startY = e.touches[0].pageY;
                    this.startX = e.touches[0].pageX;
                    var cssMatrix=$.getCssMatrix(this.el);

                    if (this.vertical)this.cssMoveStart = numOnly(cssMatrix.f);
                    else this.cssMoveStart = numOnly(cssMatrix.e);
                }
            },
            touchMove: function(e) {
                if(!this.movingElement) return;
                if (e.touches.length > 1) return this.touchEnd(e);
                this.stopLoop();
                
                var rawDelta = {
                    x: e.touches[0].pageX - this.startX,
                    y: e.touches[0].pageY - this.startY
                };

                if (this.vertical) {
                    var movePos = { x: 0, y: 0 };
                    this.dy = e.touches[0].pageY - this.startY;
                    this.dy += this.cssMoveStart;
                    movePos.y = this.dy;

                    e.preventDefault();
                    //e.stopPropagation();
                } else {
                    if ((!this.lockMove && isHorizontalSwipe(rawDelta.x, rawDelta.y)) || Math.abs(this.dx)>5) {
                		e.stopPropagation(); e.preventDefault(); //banned vertical scroll
                        var movePos = {x: 0,y: 0};
                        this.dx = e.touches[0].pageX - this.startX;
                        this.dx += this.cssMoveStart;
                        e.preventDefault();
                      //  e.stopPropagation();
                        movePos.x = this.dx;
                    }
                    else return this.lockMove=true;
                }
                
                if(movePos) this.moveCSS3(this.el, movePos);
            },
            
            touchEnd: function(e) {
                if (!this.movingElement) return;
            
                var cssMatrix=$.getCssMatrix(this.el);
                var endPos = this.vertical ? numOnly(cssMatrix.f) : numOnly(cssMatrix.e);
             
                var percent = this.vertical ? ((this.dy % this.myDivHeight) / this.myDivHeight * 100) * -1 : 
                				 ((this.dx % this.myDivWidth) / this.myDivWidth * 100) * -1; // get a percentage of movement.
                // Only need
                // to drag 3% to trigger an event
                var currInd = this.swipeIndex;
                if (endPos < this.cssMoveStart && percent > 10) {
                    currInd++; // move right/down
                } else if ((endPos > this.cssMoveStart && percent < 90)) {
                    currInd--; // move left/up
                }
                
                this.onMoveIndex(currInd, this.sTime);

                this.dx = 0;
                this.movingElement = false;
                this.startX = 0;
                this.dy = 0;
                this.startY = 0;
            },
            onMoveIndex: function(newInd, transitionTime) {
            	this.stopLoop();

	        	var toMove=newInd;
	            //Checks for infinite - moves to placeholders
	            if(this.wrap){
	                if (newInd > (this.childrenCount - 1)) {
	                	newInd = 0;
	                    toMove=this.childrenCount;
	                }
	                if (newInd < 0) {
	                	newInd = this.childrenCount-1;
	                    toMove=-1;
	                }
	            }
	            else {
	                if(newInd<0) newInd=0;
	                if(newInd>this.childrenCount-1) newInd=this.childrenCount-1;
	                toMove=newInd;
	            }
	
	            var movePos = {
	                x: 0,
	                y: 0
	            };
	            
	            if (this.vertical) {
	                movePos.y = (toMove * this.myDivHeight * -1);
	            }
	            else {
	                movePos.x = (toMove * this.myDivWidth * -1);
	            }
	
	            this.moveCSS3(this.el, movePos, transitionTime);
	
	            //This is for the infinite ends - will move to the correct position after animation
	            if(this.wrap){
	                if(toMove!=newInd){
	                    var that=this;
	                    window.setTimeout(function(){
	                        that.onMoveIndex(newInd, '1ms'); //>>> must > 0
	                    }, parseInt(this.sTime)+5);
	               }
	            }

                this.swipeIndex = newInd;
                if (this.idxCallback && typeof this.idxCallback == "function") this.idxCallback(this.swipeIndex);
            },

            idxCallback: function (idx){
            	if(!this.idxSelector)return;
            	$(this.idxSelector).removeClass(this.idxActiveCls).eq(idx).addClass(this.idxActiveCls);
            },
            
            moveCSS3: function(el, distanceToMove, time, timingFunction) {
                if (!time)
                    time = 0;
                else
                    time = parseInt(time);
                if (!timingFunction)
                    timingFunction = "linear";
                el.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
                el.style[$.feat.cssPrefix+"TransitionDuration"] = time + "ms";
                el.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
                el.style[$.feat.cssPrefix+"TransformStyle"] = "preserve-3d";
                el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
            },

            addItem: function(el) {
                if (el && el.nodeType) {

                    this.container.childNodes[0].appendChild(el);
                    this.refreshItems();
                }
            },
            refreshItems: function() {
            	this.stopLoop();
                var childrenCounter = 0;
                var that = this;
                var el = this.el;
                $(el).children().find(".prevBuffer").remove();
                $(el).children().find(".nextBuffer").remove();
                n = el.childNodes[0];
                var percent, elems = [];

                for (; n; n = n.nextSibling) {
                    if (n.nodeType === 1) {
                        elems.push(n);
                        childrenCounter++;
                    }
                }
                //Let's put the buffers at the start/end
                if(this.wrap){
                    var prep=$(elems[elems.length-1]).clone().get(0);
                    $(el).prepend(prep);
                    var tmp=$(elems[0]).clone().get(0);
                    $(el).append(tmp);
                    elems.push(tmp);
                    elems.unshift(prep);
                    tmp.style.position="absolute";
                    prep.style.position="absolute";
                }

                this.childrenCount = childrenCounter;
                percent = parseFloat(100 / childrenCounter) + "%";

                for (var i = 0; i < elems.length; i++) {
                    if (this.horizontal) {
                        elems[i].style.width = percent;
                        elems[i].style['float']="left";
                    }
                    else {
                        elems[i].style.height = percent;
                        elems[i].style.display = "block";
                    }
                }                
                this.moveCSS3(el, {
                    x: 0,
                    y: 0
                });
                if (this.horizontal) {
                    el.style.width = Math.ceil((this.childrenCount) * 100) + "%";
                    if(this.wrap){
                        prep.style.left="-"+percent;
                        tmp.style.left="100%";
                    }
                }
                else {
                    el.style.height = Math.ceil((this.childrenCount) * 100) + "%";
                    el.style['min-height'] = Math.ceil((this.childrenCount) * 100) + "%";
                    if(this.wrap){
                        prep.style.top="-"+percent;
                        tmp.style.top="100%";
                    }
                }
                
                this.container.style.visibility = 'visible';
                this.beginLoop();
            },
            
            beginLoop: function(force) {
            	if(force) this.delay =  this.orgDelay;
            	var that = this;
                this.interval = (this.delay && !this.interval) ? 
                		setTimeout(function() {
		                	var newInd = that.swipeIndex + 1;
		                	if(!that.wrap && newInd >= that.childrenCount) newInd = 0;
		                	that.onMoveIndex(newInd, that.sTime);
		                }, this.delay) : 
		                null
            },
            
            stopLoop: function(force) {
            	if(force) {
            		this.orgDelay =  this.delay;
            		this.delay = 0; //transitionEnd may restart auto loop: for loadpanel and unloadpanel
            	}
            	if(this.delay > 0 && this.interval){ clearTimeout(this.interval); this.interval = null; }
            },
            
            transitionEnd: function() { this.beginLoop();},
        };
        
        return swipe;
    })();

    function isHorizontalSwipe(xAxis, yAxis) {
                var X = xAxis;
                var Y = yAxis;
                var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
                var r = Math.atan2(Y,X); //angle in radians
                var swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
                if ( swipeAngle < 0 ) { swipeAngle =  360 - Math.abs(swipeAngle); } // for negative degree values
                if (((swipeAngle <= 215) && (swipeAngle >= 155)) || ((swipeAngle <= 45) && (swipeAngle >= 0)) || ((swipeAngle <= 360) && (swipeAngle >= 315))) // horizontal angles with threshold
                {return true; }
                else {return false}
    }
})(af);