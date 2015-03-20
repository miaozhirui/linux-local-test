!function(n,t){"use strict"
n(function(){function n(n,t,e,u){return r(n).then(t,e,u)}function e(n,t){this.then=n,this.inspect=t}function r(n){return o(function(t){t(n)})}function u(t){return n(t,s)}function i(){function n(n,i,o){t.resolve=t.resolver.resolve=function(t){return u?r(t):(u=!0,n(t),e)},t.reject=t.resolver.reject=function(n){return u?r(s(n)):(u=!0,i(n),e)},t.notify=t.resolver.notify=function(n){return o(n),n}}var t,e,u
return t={promise:D,resolve:D,reject:D,notify:D,resolver:{resolve:D,reject:D,notify:D}},t.promise=e=o(n),t}function o(n){function t(n,t,e){return o(function(r,u,i){l?l.push(function(o){o.then(n,t,e).then(r,u,i)}):k(function(){p.then(n,t,e).then(r,u,i)})})}function r(){return p?p.inspect():T()}function u(n){l&&(p=c(n),h(l,p),l=D)}function i(n){u(s(n))}function f(n){l&&h(l,a(n))}var p,l=[]
try{n(u,i,f)}catch(y){i(y)}return new e(t,r)}function c(n){return n instanceof e?n:n===Object(n)&&"then"in n?o(function(t,e,r){k(function(){try{var u=n.then
"function"==typeof u?L(u,n,t,e,r):t(f(n))}catch(i){e(i)}})}):f(n)}function f(n){var t=new e(function(e){try{return"function"==typeof e?c(e(n)):t}catch(r){return s(r)}},function(){return b(n)})
return t}function s(n){var t=new e(function(e,r){try{return"function"==typeof r?c(r(n)):t}catch(u){return s(u)}},function(){return x(n)})
return t}function a(n){var t=new e(function(e,r,u){try{return"function"==typeof u?a(u(n)):t}catch(i){return a(i)}})
return t}function h(n,t){k(function(){for(var e,r=0;e=n[r++];)e(t)})}function p(n){return n&&"function"==typeof n.then}function l(t,e,r,u,i){return n(t,function(t){function c(r,u,i){function o(n){l(n)}function c(n){p(n)}var f,s,a,h,p,l,y,v
if(y=t.length>>>0,f=Math.max(0,Math.min(e,y)),a=[],s=y-f+1,h=[],f)for(l=function(n){h.push(n),--s||(p=l=M,u(h))},p=function(n){a.push(n),--f||(p=l=M,r(a))},v=0;y>v;++v)v in t&&n(t[v],c,o,i)
else r(a)}return o(c).then(r,u,i)})}function y(n,t,e,r){function u(n){return t?t(n[0]):n[0]}return l(n,1,u,e,r)}function v(n,t,e,r){return w(n,M).then(t,e,r)}function d(){return w(arguments,M)}function m(n){return w(n,b,x)}function j(n,t){return w(n,t)}function w(t,e,r){return n(t,function(t){function u(u,i,o){var c,f,s,a,h
if(s=f=t.length>>>0,c=[],!s)return u(c),void 0
for(a=function(t,f){n(t,e,r).then(function(n){c[f]=n,--s||u(c)},i,o)},h=0;f>h;h++)h in t?a(t[h],h):--s}return o(u)})}function g(t,e){var r=L(F,arguments,1)
return n(t,function(t){var u
return u=t.length,r[0]=function(t,r,i){return n(t,function(t){return n(r,function(n){return e(t,n,i,u)})})},E.apply(t,r)})}function b(n){return{state:"fulfilled",value:n}}function x(n){return{state:"rejected",reason:n}}function T(){return{state:"pending"}}function k(n){1===q.push(n)&&O()}function O(){P(I)}function I(){for(var n,t=0;n=q[t++];)n()
q=[]}function M(n){return n}n.defer=i,n.resolve=r,n.reject=u,n.join=d,n.all=v,n.map=j,n.reduce=g,n.settle=m,n.any=y,n.some=l,n.isPromise=p,n.promise=o,e.prototype={otherwise:function(n){return this.then(D,n)},ensure:function(n){function t(){return r(n())}return this.then(t,t).yield2(this)},yield2:function(n){return this.then(function(){return n})},spread:function(n){return this.then(function(t){return v(t,function(t){return n.apply(D,t)})})},always:function(n,t){return this.then(n,n,t)}}
var E,F,L,P,q,z,A,B,C,D
return q=[],z=t.setTimeout,P="function"==typeof setImmediate?setImmediate.bind(t):"object"==typeof process&&process.nextTick?process.nextTick:"object"==typeof vertx?vertx.runOnLoop:function(n){z(n,0)},A=Function.prototype,B=A.call,L=A.bind?B.bind(B):function(n,t){return n.apply(t,F.call(arguments,2))},C=[],F=C.slice,E=C.reduce||function(n){var t,e,r,u,i
if(i=0,t=Object(this),u=t.length>>>0,e=arguments,e.length<=1)for(;;){if(i in t){r=t[i++]
break}if(++i>=u)throw new TypeError}else r=e[1]
for(;u>i;++i)i in t&&(r=n(r,t[i],i,t))
return r},n})}("function"==typeof define&&define.amd?define:function(n){window.when=n()},this)
