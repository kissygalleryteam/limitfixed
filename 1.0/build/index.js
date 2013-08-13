/*
combined files : 

gallery/limitfixed/1.0/index

*/
/**
 * @fileoverview 
 * @author wuake<wgk1987@gmail.com>
 * @module limitfixed
 **/
KISSY.add('gallery/limitfixed/1.0/index',function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Limitfixed
     * @constructor
     * @extends Base
     */
    function Limitfixed(comConfig) {
        var self = this;
        //调用父类构造函数
        Limitfixed.superclass.constructor.call(self, comConfig);
    }
    S.extend(Limitfixed, Base, /** @lends Limitfixed.prototype*/{

    }, {ATTRS : /** @lends Limitfixed*/{

    }});
    return Limitfixed;
}, {requires:['node', 'base']});




