/*!build time : 2014-04-23 7:29:34 PM*/
KISSY.add("gallery/limitfixed/1.1/index",function(a,b,c){function d(b,c){this.$fixed=g(b),this.cfg=a.merge(m,c)}function e(a){if(!a)return!1;var b=a.getDOMNode?a.getDOMNode():a;return 9===b.nodeType}var f=c.all,g=c.one,h=a.UA,i=g(document),j=g(window),k=6===h.ie,l=a.isUndefined,m={direction:"y",type:k?"absolute":"fixed",elLimit:i};a.augment(d,b.Target,{render:function(){if(!this.rendered){var a=this.cfg,b=this.$fixed;this._originStyles={position:null,top:null,bottom:null,left:null};for(var c in this._originStyles)this._originStyles.hasOwnProperty(c)&&(this._originStyles[c]=b.css(c));a.holder&&(this._placeholder=this._buildPlaceholder()),this.rendered=!0,this.adjust()}},adjust:function(){this.restore(),this.scroll()},restore:function(){this.$fixed.css(this._originStyles)},scroll:function(){var a=this.cfg;"fixed"==a.type&&this._calFixedPosition()},_calFixedPosition:function(){var b=this.cfg,c=(b.points||{},b.direction.toLowerCase()),d=this.$fixed,e=this._getLimitRange(),f=d.offset(),g={},h=f.left,j=f.top,k=i.scrollTop(),m=i.scrollLeft();-1!==c.indexOf("y")&&(k>e.top&&k<e.bottom-d.outerHeight()?g.top=0:k>e.bottom-d.outerHeight()&&k<e.bottom&&(g.top=-(k-e.bottom+d.outerHeight()))),-1!==c.indexOf("x")&&(m>e.left&&m<e.right-d.outerWidth()?g.left=0:m>e.right-d.outerWidth()&&m<e.right&&(g.left=-(m-e.right+d.outerWidth()))),-1!==c.indexOf("y")&&!l(g.top)&&l(g.left)&&(g.left=h-m),-1!==c.indexOf("x")&&!l(g.left)&&l(g.top)&&(g.top=j-k),l(g.top)&&l(g.left)?(d.css(this._originStyles),this._hidePlaceholder()):(d.css(a.mix({position:"fixed"},g)),this._showPlaceholder())},_getLimitRange:function(){var a=this.cfg,b=a.range,c=g(a.elLimit);return!b&&c&&(b=e(c)?{left:0,top:0}:c.offset(),b.bottom=b.top+c.outerHeight(),b.right=b.left+c.outerWidth()),b},_buildPlaceholder:function(){var a=this.cfg,b=a.placeholder;if(!b){var c=this.$fixed;b=f('<div style="visibility:hidden;margin:0;padding:0;"></div>'),b.width(c.outerWidth()).height(c.outerHeight()).css("float",c.css("float")).insertAfter(c)}return b},_showPlaceholder:function(){this._placeholder&&this._placeholder.show()},_hidePlaceholder:function(){this._placeholder&&this._placeholder.hide()}});var n=[];return a.ready(function(){j.on("scroll resize",function(){a.each(n,function(a){a.rendered&&a.adjust()})})}),function(a,b){var c=new d(a,b);return n.push(c),c}},{requires:["event","node"]}),KISSY.add("gallery/limitfixed/1.1/mini",function(a,b){return b},{requires:["./index"]});