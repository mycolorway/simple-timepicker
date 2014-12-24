# Simple timepicker

[![Circle CI](https://circleci.com/gh/mycolorway/simple-timepicker.png?circle-token=b32d9f1c2a82ed37b7cbb8a56bddd3f5845167f2)](https://circleci.com/gh/mycolorway/simple-timepicker)



基于彩程simple-module组件，用于快速选择时间。

依赖项：

- JQuery 2.0+
- [Simple Module](https://github.com/mycolorway/simple-module)
- [moment](https://github.com/moment/moment)

### 使用方法
首先，需要在页面里引用相关脚本以及css

```html
<link media="all" rel="stylesheet" type="text/css" href="path/to/timepicker.css" />
<script type="text/javascript" src="path/to/jquery.min.js"></script>
<script type="text/javascript" src="path/to/module.js"></script>
<script type="text/javascript" src="path/to/moment.js"></script>
<script type="text/javascript" src="path/to/timepicker.js"></script>

```

可以通过simple.timepicker方法，实例化timepicker组件

```js
simple.timepicker({
    target: 'input',
    time: '09:30',
    inline: false,
    format: 'HH:mm'
});

```

### API 文档

####初始化选项

__target__

selector|jQuery Object，一个接收timepicker的input元素，必选

__inline__

Boolean，是否弹出选择，这样，在input获取焦点的时候会自动弹出，默认为false

__offset__

Number，仅在inline为true时生效，input与timepicker的间隙。

__time__

String|Moment object

__format__

String，为timepicker选中日期的格式，是moment的format string，默认为'HH:mm'

#### 方法

__show()__

显示timepicker

__hide()__

隐藏timepicker

__getTime()__

获取时间，返回为moment对象

__setTime()__

设置时间，参数可以为String或者Moment Object

__destroy()__

销毁timepicker对象，重置状态