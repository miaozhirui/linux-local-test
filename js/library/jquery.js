window.miao = (function(){
    function Miao(els) {
        for(var i=0; i<els.length; i++) {
            this[i] = els[i];
        }
        this.length = els.length
    }

    Miao.prototype.map = function(callback) {
        var results = [], i=0;

        for (; i<this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }

        return results;
    }

    Miao.prototype.forEach = function(callback) {
        this.map(callback);
        return this;
    }

    Miao.prototype.mapOne = function(callback) {
        var results = this.map(callback);

        return results.length>1 ? results : results[0]        
    }

    Miao.prototype.text = function(text) {
        if(typeof text !== "undefined") {
            return this.forEach(function(ele) {
                ele.innerText= text;
            })
        } else {
           return this.mapOne(function(ele) {
                return ele.innerText;
            })
        }
    }
    var  miao = {
        get : function(selector) {
            var ele ; 
            if(typeof selector === 'string') {
                ele = document.querySelectorAll(selector);
            } else if(selector.length) {
                ele = selector;
            } else {
                ele = [selector];
            }

            return new Miao(ele);
        }   
    }

    return miao;
}())