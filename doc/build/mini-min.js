/*!build time : 2014-05-15 11:09:39 AM*/
KISSY.add("kg/limitfixed/2.0.0/index",function(a,b,c){function d(){var a=h('<div style="position:relative;"></div>').appendTo(document.body);return"auto"!==a.css("bottom")}function e(b,c){this.$fixed=i(b),this.cfg=a.merge(p,c),this.$limit=i(this.cfg.limit)}function f(a){if(!a)return!1;var b=a.getDOMNode?a.getDOMNode():a;return 9===b.nodeType}function g(b){return b.parent(function(b){return a.inArray(h(b).css("position"),["relative","absolute"])})}var h=c.all,i=c.one,j=a.UA,k=i(document),l=i(window),m=j.ie,n=a.isUndefined,o=j.firefox&&d(),p={direction:"y",type:6===m?"absolute":"fixed",limit:k,holder:!1,clsFixed:"fixed-sticky"};a.augment(e,b.Target,{render:function(){var a=this,b=a.cfg;a.rendered||(a._saveOriginStyle(),b.holder&&(a._placeholder=a._buildPlaceholder()),a.on("fixed",function(c){var d=c.fixed?"addClass":"removeClass";a.$fixed[d](b.clsFixed)}),a.rendered=!0,a.resize())},resize:function(){this._restore(),this.scroll()},scroll:function(){var b=this.cfg,c=this.$fixed,d=this.isSticky,e=this._oldPosition,f=this._calPosition();f?d&&f.top==e.top&&f.left==e.left||(c.css(a.mix({position:b.type},f)),this._oldPosition=f,this._showPlaceholder(),this.isSticky=!0,this.fire("fixed",{fixed:!0})):d&&(this._restore(),this._hidePlaceholder(),this.isSticky=!1,this.fire("fixed",{fixed:!1}))},_saveOriginStyle:function(){var a=this.$fixed;this._originStyles={position:null,top:null,bottom:null,left:null};var b=!1,c=a.css("position");o&&"static"!==c&&(b=!0),b&&a.css("position","static");for(var d in this._originStyles)this._originStyles.hasOwnProperty(d)&&(this._originStyles[d]=a.css(d));b&&a.css("position",c)},_restore:function(){this.isSticky=!1,this.$fixed.css(this._originStyles),this._originFixedOffset=this._getFixedRange()},_buildPlaceholder:function(){var a=this.cfg,b=a.placeholder;if(!b){var c=this.$fixed;b=h('<div style="visibility:hidden;margin:0;padding:0;display:none;"></div>'),b.width(c.outerWidth(!0)).height(c.outerHeight(!0)).css("float",c.css("float")).insertAfter(c)}return b},_calPosition:function(){var a=this.cfg,b=a.direction.toLowerCase(),c=this._getLimitRange(),d=this._originFixedOffset,e={},f=k.scrollTop(),g=k.scrollLeft();-1!==b.indexOf("y")&&(f>c.top&&f<c.bottom-d.outerHeight?e.top=f:f>c.bottom-d.outerHeight&&f<c.bottom&&(e.top=c.bottom-d.outerHeight)),-1!==b.indexOf("x")&&(g>c.left&&g<c.right-d.outerWidth?e.left=g:g>c.right-d.outerWidth&&g<c.right&&(e.left=c.right-d.outerWidth)),-1!==b.indexOf("y")&&!n(e.top)&&n(e.left)&&(e.left=d.left),-1!==b.indexOf("x")&&!n(e.left)&&n(e.top)&&(e.top=d.top);var h=this._getRelateOffset();return h&&!n(e.top)&&(e.top-=h.top),h&&!n(e.left)&&(e.left-=h.left),n(e.top)&&n(e.left)?null:e},_getRelateOffset:function(){var a,b=this.cfg;if("fixed"==b.type)a={left:k.scrollLeft(),top:k.scrollTop()};else if("absolute"==b.type){var c=g(this.$fixed);c&&(a=this._getOffset(c))}return a},_getFixedRange:function(){var a=this.$fixed,b=a.offset();return b.outerHeight=a.outerHeight(),b.outerWidth=a.outerWidth(),b},_getLimitRange:function(){var a=this.cfg,b=a.range,c=this.$limit;return!b&&c&&(b=this._getOffset(c),b.bottom=b.top+c.outerHeight(),b.right=b.left+c.outerWidth()),b},_getOffset:function(a){return f(a)?{left:0,top:0}:a.offset()},_showPlaceholder:function(){this._placeholder&&this._placeholder.show()},_hidePlaceholder:function(){this._placeholder&&this._placeholder.hide()}});var q=[];return a.ready(function(){function b(b){return function(){a.each(q,function(a){a.rendered&&a[b]()})}}l.on("scroll",b("scroll")),l.on("resize",a.throttle(b("resize"),120))}),function(a,b){var c=new e(a,b);return q.push(c),c}},{requires:["event","node"]}),KISSY.add("kg/limitfixed/2.0.0/mini",function(a,b){return b},{requires:["./index"]});