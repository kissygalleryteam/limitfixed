## 综述

Limitfixed是。

* 版本：1.2
* 作者：阿克
* demo：[http://gallery.kissyui.com/limitfixed/1.2/demo/index.html](http://gallery.kissyui.com/limitfixed/1.2/demo/index.html)

## 初始化组件

````
    KISSY.use('gallery/limitfixed/1.2/index', function (S, LimitFixed) {
         var limitfixed = new LimitFixed('#fixed', {
            limit: '$container',
            holder: true/false
         });
         limitfixed.render();
    });
````

## API说明

```
KISSY.use("gallery/limitfixed/1.2/", function(S, LimitFixed) {
		// <Selector|Element|Node> #fixed参数表示要浮动的元素。只支持单个元素。
	var lf = new LimitFixed("#fixed", {
		// <Selector|Element|Node>浮动元素的浮动范围。默认document
		limit: $container
		// <Boolean> 是否创建占位元素。可以避免浮动时影响布局。默认false
		holder: true,
		// <String> 浮动的方向。默认为y，表示纵向浮动；可选值"x"，表示横向浮动；可选值"xy"，表示横向和纵向都可浮动。
		direction: "y",
		// <String> 浮动的实现方式。默认IE6下用absolute，其他情况下用fixed
		type: "fixed",
		// <String> 浮动状态下添加的className。
		clsFixed: "fixed-sticky",
		// <Element|Node> 浮动时用于占位的元素。默认自动创建，也可以传入指定的元素作为占位元素（指定元素的样式和位置不会动）。
		placeholder: $holder
	});
	lf.render()
})
```

### 属性

- $fixed <Node> 浮动元素
- $limit <Node> 浮动的容器
- rendered <Boolean> 是否已初始化

### 方法

- render()
	- 初始化渲染。没有初始化就不会生效。
- scroll()
	- 调整浮动元素的位置信息，在scroll时调用。
- resize()
	- 重置浮动元素位置，并根据新的情况调整位置。在布局发生变化时调用。

### 事件

- fixed(ev)
	- ev.fixed，表示当前是否浮动状态。
	- 只在状态发生变化的情况下触发。
