/*!build time : 2014-04-25 9:51:15 PM*/
KISSY.add("gallery/limitfixed/1.1/index",function(a,b,c){function d(b,c){this.$fixed=h(b),this.cfg=a.merge(m,c),this.$limit=h(this.cfg.limit),this.isSticky=!1}function e(a){if(!a)return!1;var b=a.getDOMNode?a.getDOMNode():a;return 9===b.nodeType}function f(b){return b.parent(function(b){return a.inArray(g(b).css("position"),["relative","absolute"])})}var g=c.all,h=c.one,i=h(document),j=h(window),k=a.UA.ie,l=a.isUndefined,m={direction:"y",accuracy:10>k,type:6===k?"absolute":"fixed",limit:i,holder:!1,clsFixed:"fixed-sticky"};a.augment(d,b.Target,{render:function(){var a=this,b=a.cfg;a.rendered||(a._saveOriginStyle(),b.holder&&(a._placeholder=a._buildPlaceholder()),a.on("fixed",function(c){var d=c.fixed?"addClass":"removeClass";a.$fixed[d](b.clsFixed)}),a.rendered=!0,a.resize())},resize:function(){this._restore(),this.scroll()},scroll:function(){var b=this.cfg,c=this.$fixed,d=this.isSticky,e=this._calPosition();e?(c.css(a.mix({position:b.type},e)),this._showPlaceholder(),d||(this.isSticky=!0,this.fire("fixed",{fixed:!0}))):(this._restore(),this._hidePlaceholder(),d&&(this.isSticky=!1,this.fire("fixed",{fixed:!1})))},_saveOriginStyle:function(){var a=this.$fixed;this._originStyles={position:null,top:null,bottom:null,left:null};for(var b in this._originStyles)this._originStyles.hasOwnProperty(b)&&(this._originStyles[b]=a.css(b))},_restore:function(){this.$fixed.css(this._originStyles),this._originFixedOffset=this._getFixedRange()},_buildPlaceholder:function(){var a=this.cfg,b=a.placeholder;if(!b){var c=this.$fixed;b=g('<div style="visibility:hidden;margin:0;padding:0;"></div>'),b.width(c.outerWidth(!0)).height(c.outerHeight(!0)).css("float",c.css("float")).insertAfter(c)}return b},_calPosition:function(){var a=this.cfg,b=a.direction.toLowerCase(),c=this._getLimitRange(),d=this._originFixedOffset,e={},f=i.scrollTop(),g=i.scrollLeft();-1!==b.indexOf("y")&&(f>c.top&&f<c.bottom-d.outerHeight?e.top=f:f>c.bottom-d.outerHeight&&f<c.bottom&&(e.top=c.bottom-d.outerHeight)),-1!==b.indexOf("x")&&(g>c.left&&g<c.right-d.outerWidth?e.left=g:g>c.right-d.outerWidth&&g<c.right&&(e.left=c.right-d.outerWidth)),-1!==b.indexOf("y")&&!l(e.top)&&l(e.left)&&(e.left=d.left),-1!==b.indexOf("x")&&!l(e.left)&&l(e.top)&&(e.top=d.top);var h=this._getRelateOffset();return h&&!l(e.top)&&(e.top-=h.top),h&&!l(e.left)&&(e.left-=h.left),l(e.top)&&l(e.left)?null:e},_getRelateOffset:function(){var a,b=this.cfg;if("fixed"==b.type)a={left:i.scrollLeft(),top:i.scrollTop()};else if("absolute"==b.type){var c=f(this.$fixed);c&&(a=this._getOffset(c))}return a},_getFixedRange:function(){var a=this.$fixed,b=a.offset();return b.outerHeight=a.outerHeight(),b.outerWidth=a.outerWidth(),b},_getLimitRange:function(){var a=this.cfg,b=a.range,c=this.$limit;return!b&&c&&(b=this._getOffset(c),b.bottom=b.top+c.outerHeight(),b.right=b.left+c.outerWidth()),b},_getOffset:function(a){return e(a)?{left:0,top:0}:a.offset()},_showPlaceholder:function(){this._placeholder&&this._placeholder.show()},_hidePlaceholder:function(){this._placeholder&&this._placeholder.hide()}});var n=[],o=[];return a.ready(function(){function b(b){return function(c){var d=c.type;a.each(b,function(a){a.rendered&&a[d]()})}}j.on("scroll resize",a.throttle(b(o),150)),j.on("scroll resize",b(n))}),function(a,b){var c=new d(a,b);return c.cfg.accuracy?n.push(c):o.push(c),c}},{requires:["event","node"]}),KISSY.add("gallery/limitfixed/1.1/mini",function(a,b){return b},{requires:["./index"]});