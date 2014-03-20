## LimitFixed组件介绍

在大部分的网站上，都可以看到一些元素浮动展示的效果。
LimitFixed让你快速设置元素的浮动效果，很简单。
但它比你想象的更有用！

下面Demo中的第三个示例，向你展示了移动端分组列表的展示效果。

## 快速使用

### 使用示例

    KISSY.use('gallery/limitfixed/1.0/index',function (S,Limitfixed) {
        // elFixed是要浮动的元素。
        // elLimit是浮动的容器，确定了elFixed元素的浮动范围。若不传则默认为document对象
        var limitfixed = new Limitfixed(elFixed, elLimit);
    });

### 参数详解

    S.use('gallery/limitfixed/1.0/index', function (S, Limitfixed) {
         // elFixed是要浮动的元素。
         // elLimit是浮动的容器，确定了elFixed元素的浮动范围。若不传则默认为document对象
         var limitfixed = Limitfixed(elFixed, elLimit, {
            // elFixed相对elLimit容器的浮动位置。具体值参考API
            align: ['top', 'left'],
            // elFixed相对elLimit容器的偏移量。
            offset: [0, 0],
            // 是否在elFixed的位置上构建占位元素。
            // 为了避免浮动以后的布局变动
            holder: false,
            // 自定义占位元素的className。
            // 默认占位元素只设置了宽高，可以通过class定义额外的样式。
            holderCls: "limitfixed-holder",
            // 是否强制使用绝对定位。默认只在ie6下使用绝对定位。
            forceAbs: false,
            // 是否缓存elLimit的位置信息。如果容器是在浮动的方向上的尺寸是固定的。
            // 那么设置为true，可以避免每次都去读元素的位置信息。
            cache: false
         });

         limitfixed.on('fixed', function(ev) {
            var isFixed = ev.isFixed;
            if(isFixed) {
                // do something when fixed ing
            }else {
                // static state
            }
         });
    });

## API说明

### 构造参数

* elFixed
	* 固定浮动的节点元素
* elLimit
 	* `elFixed`浮动的容器。
* cfg
	* align {Array< String >}
		* `elFixed`元素相对`elLimit`在浮动时的对齐方式。
		参数类型为数组，第一项表示浮动的位置，第二项表示不浮动的位置。
		如默认值['top', 'left']表示元素浮动在左上角，且纵向滚动的时候，元素随页面滚动而浮动显示，而横向滚动的时候不浮动；['top right']配置表示，横向和纵向滚动的时候元素都浮动，浮动的位置在右上角。
		
	* offset {Array< Number >}
		* `elFixed`元素浮动相对于`elLimit`的偏移位置。
		参数类型为数组，第一项为横坐标，第二项为纵坐标。
	* holder
		* 在`elFixed`的位置上创建一个占位元素。通过配置holder=true，可以避免页面布局的抖动（`elFixed`浮动的时候position由static变为fixed|absolute都会影响页面的布局展示）。
	* holderCls
		* 设置占位元素的className。
	* forceAbs
		* 是否强制使用绝对定位。默认ie6使用绝对定位计算。其他浏览器使用fixed定位。
	* cache
		* 是否缓存`elLimit`的位置信息（offset.top/offset.left/width/height）。如果容器的高度可能会动态变化，建议不要设置为true。

### 属性

* elFixed
	* 固定浮动的节点元素
* elLimit
	* `elFixed`浮动的容器。
* isFixed
	* 当前的浮动状态。true表示视窗范围内（浮动状态），false表示在视窗范围外。
* elHolder
	* 占位元素。若`cfg.holder`配置为false，则不存在该属性。

### 方法

* scroll()
	* 计算一次`elFixed`位置并设置对应的样式。
* getViewRange()
	* 获取当前视窗的信息。（视窗宽高和滚动条的top/left）
* getLimitRange(refresh)
	* 获取`elLimit`的位置信息。`refresh`为true时动态获取值，否则根据`cfg.cache`获取位置信息。

### 事件
* fixed
	* 当`elFixed`脱离当前视窗范围或重新显示在当前视窗范围时触发该事件。其事件对象中包含`isFixed`属性，其值同`isFixed`属性。



