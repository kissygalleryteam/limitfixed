/*!build time : 2014-04-24 11:19:27 AM*/
KISSY.add("gallery/limitfixed/1.1/index",function(a,b,c){function d(b,c){this.$fixed=h(b),this.cfg=a.merge(n,c),this.isSticky=!1}function e(a){if(!a)return!1;var b=a.getDOMNode?a.getDOMNode():a;return 9===b.nodeType}function f(b){return b.parent(function(b){return a.inArray(g(b).css("position"),["relative","absolute"])})}var g=c.all,h=c.one,i=a.UA,j=h(document),k=h(window),l=6===i.ie,m=a.isUndefined,n={direction:"y",type:l?"absolute":"fixed",elLimit:j,clsFixed:"fixed-sticky"};a.augment(d,b.Target,{render:function(){var a=this,b=a.cfg;a.rendered||(a._saveOriginStyle(),b.holder&&(a._placeholder=a._buildPlaceholder()),a.on("fixed",function(c){var d=c.fixed?"addClass":"removeClass";a.$fixed[d](b.clsFixed)}),a.rendered=!0,a.resize())},resize:function(){this._restore(),this.scroll()},scroll:function(){var b=this.cfg,c=this.$fixed,d=this.isSticky,e=this._calPosition();e?(c.css(a.mix({position:b.type},e)),this._showPlaceholder(),d||(this.isSticky=!0,this.fire("fixed",{fixed:!0}))):(this._restore(),this._hidePlaceholder(),d&&(this.isSticky=!1,this.fire("fixed",{fixed:!1})))},_saveOriginStyle:function(){var a=this.$fixed;this._originStyles={position:null,top:null,bottom:null,left:null};for(var b in this._originStyles)this._originStyles.hasOwnProperty(b)&&(this._originStyles[b]=a.css(b))},_restore:function(){this.$fixed.css(this._originStyles),this._originOffset=this.$fixed.offset()},_buildPlaceholder:function(){var a=this.cfg,b=a.placeholder;if(!b){var c=this.$fixed;b=g('<div style="visibility:hidden;margin:0;padding:0;"></div>'),b.width(c.outerWidth()).height(c.outerHeight()).css("float",c.css("float")).insertAfter(c)}return b},_calPosition:function(){var a=this.cfg,b=a.direction.toLowerCase(),c=this.$fixed,d=this._getLimitRange(),e=this._originOffset,f={},g=j.scrollTop(),h=j.scrollLeft();-1!==b.indexOf("y")&&(g>d.top&&g<d.bottom-c.outerHeight()?f.top=g:g>d.bottom-c.outerHeight()&&g<d.bottom&&(f.top=d.bottom-c.outerHeight())),-1!==b.indexOf("x")&&(h>d.left&&h<d.right-c.outerWidth()?f.left=h:h>d.right-c.outerWidth()&&h<d.right&&(f.left=d.right-c.outerWidth())),-1!==b.indexOf("y")&&!m(f.top)&&m(f.left)&&(f.left=e.left),-1!==b.indexOf("x")&&!m(f.left)&&m(f.top)&&(f.top=e.top);var i=this._getRelateOffset();return i&&!m(f.top)&&(f.top-=i.top),i&&!m(f.left)&&(f.left-=i.left),m(f.top)&&m(f.left)?null:f},_getRelateOffset:function(){var a,b=this.cfg;if("fixed"==b.type)a={left:j.scrollLeft(),top:j.scrollTop()};else if("absolute"==b.type){var c=f(this.$fixed);c&&(a=this._getOffset(c))}return a},_getLimitRange:function(){var a=this.cfg,b=a.range,c=h(a.elLimit);return!b&&c&&(b=this._getOffset(c),b.bottom=b.top+c.outerHeight(),b.right=b.left+c.outerWidth()),b},_getOffset:function(a){return e(a)?{left:0,top:0}:a.offset()},_showPlaceholder:function(){this._placeholder&&this._placeholder.show()},_hidePlaceholder:function(){this._placeholder&&this._placeholder.hide()}});var o=[];return a.ready(function(){k.on("scroll resize",function(b){var c=b.type,d="scroll"===c?"scroll":"adjust";a.each(o,function(a){a.rendered&&a[d]()})})}),function(a,b){var c=new d(a,b);return o.push(c),c}},{requires:["event","node"]}),KISSY.add("gallery/limitfixed/1.1/mini",function(a,b){return b},{requires:["./index"]});