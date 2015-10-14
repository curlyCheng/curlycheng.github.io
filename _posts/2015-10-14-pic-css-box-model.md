---
layout: post
category: CSS
tags: [css, position, margin]
title: 图解CSS(一)——盒模型
---
> 本文将介绍css盒模型

* TOC
{:toc}

## 盒模型

![box-model]({{site.img_dir}}{{page.dir}}/box-model.png)

- Element box: margin -> border -> padding -> content area
- background范围：content-area+padding+border <img width="100px" src="{{site.img_dir}}{{page.dir}}/background-model.png" alt="">
- 相邻块margin合并

## box-sizing

> box-sizing属性是一个css属性，来设置盒模型类型。
对于IE浏览器，IE7+支持该属性

{% highlight css %}
div.box {
	width: 220px;
	height: 50px;
	padding: 100px;
	border: 10px;
	margin: 20px;
}
{% endhighlight %}

##### box-sizing: content-box

![content-box]({{site.img_dir}}{{page.dir}}/box-model1.png)

CSS2.1规范盒模型
width属性代表content area宽度
height属性代表content area高度

##### box-sizing: border-box

![border-box]({{site.img_dir}}{{page.dir}}/box-model2.png)

IE6使用的盒模型类型
width属性-2×padding-2×border = content area的宽度(>=0)
height属性-2×padding-2×border = content area的高度(>=0)

## 格式化

##### 水平格式化

> - 元素框内水平方向的属性之和必须等于包含块宽度 
- width,margin属性可设置为auto 
- padding和border不能设置为auto，默认值为0 
- 如果设置width、margin-left或margin-
right中的某个值为auto，而余下两个属性指定为特定的值，那么设置为auto的属性会确定所需的长度，从而使元素框的宽度等于父元素的width
- 如果设置margin-left或margin-
right为auto，而width为特定值，则margin-left和margin-right平分剩余宽度
- 如果设置width为auto，margin-left和margin-right一个为auto一个为特定值，则width占有剩余宽度
- 当全为特定值，通过调节margin-right使总宽度等于包含块宽度(可为负外边距)

<iframe style="width: 100%; height:300px" src="http://codepen.io/curlyCheng/embed/NGaPya" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

##### 垂直格式化

> - height,margin属性可设置为auto
- 如果正常流中一个块元素的margin-top或margin-bottom设置为auto，它会自动计算为0。
- 如果一个块级正常流元素的height设置为一个百分数，这个值则是包含块height的一个百分数。
- 如果块级正常流元素的高度设置为auto，而且只有块级子元素。其默认高度将是从最高块级子元素的边框到最低块级子元素边框之间的距离；如果块级元素有上内边距或下内边距，或者有上边框或下边框，其高度则是从其最高子元素的上外边距边界到其最低子元素的下外边距边界之间的距离
- 如果设置margin-top，margin-bottom百分数，则是按包含块width计算margin值。

<iframe style="width: 100%; height:300px" src="http://codepen.io/curlyCheng/embed/yYzNbW" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

通过margin，height设置正常流中的块元素垂直居中几乎不可能。不如看看不在正常文档流中的块元素

## 绝对定位的块元素

##### 水平方向

> - left+margin+border+padding+width+right=包含块的width。(水平方向从左到右)
- 有五个属性可设为auto:left,margin-left,width,margin-right,right
- 默认值为：left:auto; margin-left:0px; width:0px; margin-right:0px; right:auto;
- 设定left和right，其规律与上述盒模型水平格式化一致
- 设定width和margin，left、right为auto，则按静态位置放置;设定left、right其中一个为auto，则该属性占有剩余宽度


##### 垂直方向

> - 垂直方向与水平方向相似，能设为auto的属性为height，top，bottom
- 	

<p data-height="464" data-theme-id="20013" data-slug-hash="vNeGxZ" data-default-tab="result" data-user="curlyCheng" class='codepen'>See the Pen <a href='http://codepen.io/curlyCheng/pen/vNeGxZ/'>vNeGxZ</a> by curlyCheng (<a href='http://codepen.io/curlyCheng'>@curlyCheng</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
 

[块元素垂直居中的实现](http://douglasheriot.com/tutorials/css_vertical_centre/demo4.html)
