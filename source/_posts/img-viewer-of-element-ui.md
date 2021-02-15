---
title:  "element-ui 的 image-viewer 简单分析"
date:   2019-12-28 12:08:23 +0800
categories: frontend
tags:
  - vue.js
  - element
---

# element 组件 image-viewer 的简单分析

组件源代码详见[此页面](https://github.com/ElemeFE/element/blob/dev/packages/image/src/image-viewer.vue)

这个组件作为 `el-image` 的附属, 相关内容没有写在 element 的文档里. 翻阅这个组件的代码主要是由于在项目过程中发现了一个奇怪的 bug: 在点击作为缩略图的 `el-image` 组件试图打开完整图片的时候, `image-viewer` 并不能显示 `el-image` 图片本身.

Element 作为一个成熟的组件库，自然拥有图片放大预览像个的组件。这个组件提供的基本功能有：

- 渐入 / 渐出
- 放大 / 缩小
- 旋转
- 图片查看模式切换
- 切换图片

## 组件参数

先看调用这个组件时的参数

| 参数名          | 类型       | 默认值   | 描述                                            |
| --------------- | ---------- | -------- | ----------------------------------------------- |
| `url-list`      | `Array`    | `()=>[]` | 希望在预览时可以通过左右箭头切换的图片的url列表 |
| `z-index`       | `Number`   | `2000`   |                                                 |
| `on-switch`     | `Function` | `()=>{}` | 图片切换时调用的函数                            |
| `on-close`      | `Function` | `()=>{}` | 关闭时调用的函数                                |
| `initial-index` | `Number`   | `0`      | 点开预览时，第一张图片在url-list中对应的下标    |

+++ `props` 对象
```javascript
  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    onSwitch: {
      type: Function,
      default: () => {}
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },
```
+++

这个组件在el-image内调用时使用的参数是：

```html
<image-viewer :z-index="zIndex" :initial-index="imageIndex" v-show="showViewer" :on-close="closeViewer" :url-list="previewSrcList"/>
```

`previewSrcList`来自于调用`el-image`输入的参数。

`imageIndex`在这里是用这个函数算出来的：

```javascript
imageIndex() {
    return this.previewSrcList.indexOf(this.src);
}
```

也就是说，如果调用`el-image`时输入的`previewSrcList`没有`el-image`本身对应的图片，`image-viewer`被打开时是不会有任何图片被展示的。这点就很致命了，尤其是**缩略图**打开后预览**高清图**的情况。

## 图片相关的数据

当前图片的数据存放在`data`字段下的`transform`对象。

```javascript
transform: {
    scale: 1,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false
}
```
## 渐入渐出

调用的是`viewer-fade`, **不可定制**

## 放大缩小/旋转

通过`handleActions`函数调用相关方法。

### 放大缩小

代码：

```javascript
// 放大：
transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
// 缩小：
if (transform.scale > 0.2) {
    transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
}
```

直接编辑图片展示的大小这个属性。

### 旋转

同样也是直接编辑`transform`对象下`deg`属性

```javascript
// 逆时针:
	transform.deg += rotateDeg;
// 顺时针:
	transform.deg -= rotateDeg;
```

### 动画

所有属性的更改都会涉及到这行代码：

```javascript
transition: enableTransition ? 'transform .3s' : '',
```

进而为属性的更改加上动画效果。

## 图片切换

调用`prev()`和`next()`函数完成

```javascript
prev() {
    if (this.isFirst && !this.infinite) return;
    const len = this.urlList.length;
    this.index = (this.index - 1 + len) % len;
},
next() {
    if (this.isLast && !this.infinite) return;
    const len = this.urlList.length;
    this.index = (this.index + 1) % len;
},
```

还蛮简单的，就不分析了。

## 图片模式切换

一共定义了两个模式`CONTAIN`和`ORIGINAL`

`CONTAIN`模式会将图片全屏，`ORIGINAL`模式会显示原图大小

```javascript
const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'el-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'el-icon-c-scale-to-original'
  }
};
```

模式切换通过调用`toggleMode()`函数实现

```javascript
toggleMode() {
  if (this.loading) return;
  const modeNames = Object.keys(Mode);
  const modeValues = Object.values(Mode);
  const index = modeValues.indexOf(this.mode);
  const nextIndex = (index + 1) % modeNames.length;
  this.mode = Mode[modeNames[nextIndex]];
  this.reset();
}
```

如果要添加更多的模式，只需要在`Mode`对象下添加即可，不需要再修改其他的代码。

## 图片加载时的情形

这个组件维护了一个变量：`loading`，来标志是否在加载。加载失败或加载中的情况直接调用了`img`下的`@load`和`@error`来处理。

如果想要改变加载时展示的图片，最方便的做法是将`<template>`下的`<img>`换成`<el-image>`，再用`el-image`的相关插槽来改变
