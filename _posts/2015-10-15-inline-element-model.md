---
layout: post
category: CSS
tags: [inline, line-box]
title: 图解CSS(二)——行内世界
---
> 行内世界里生活着行内元素和匿名文本，CSS中的行内元素包括img,span,a,code,em,i等。行内世界也有自己的规则，行内世界里的成员按照这些规则确定自己的位置。这篇日志就来说说行内世界。

* TOC
{:toc}

## 行内简单介绍

我们都知道，块级元素是十分霸道的存在，占领自己所在的一大行块区域，（在不做任何特殊设置的情况下）没东西能和它同行。而行内世界则是和谐的多。

{% highlight html %}
<p>
  Today is <span style="color: red">Thursday</span>.There are <a href="">many things</a> have to do. <big>Wonderful Day</big>.
</p>
{% endhighlight %}
![inline-example]({{site.img_dir}}{{page.dir}}/inline-model1.png)
在块级元素p的包含块内现在有一行内容，这一行中存在"Today is"这种匿名文本，也存在span、a、big标签包裹住的行内元素。

倘若我们给p设定100px的包含块宽度，残忍地缩小生存空间，结果是这样的
<img style="width:30%;" src="{{site.img_dir}}{{page.dir}}/inline-box2.png" alt="">
发现内容没有一行走到黑，灵活地扭了扭，变成了七行文本。

当然如果同时给p设定过小高度，这回就真的overflow了。

## 文本行结构

##### 整体

上文发现文本可以一行变七行，其实每一行都被一个叫行框(line box)的虚拟框包住。
行框是何人？可以理解为一方草莽英雄，它底下有一帮兄弟。每一个兄弟是一个行内框(inline-box)，也是虚拟框，一个行内框包一个匿名文本或一个行内元素。一个匿名文本或行内元素是最底层的，但是它还是拥有一个内容区(content area)，这个内容区大小由文本内容和字体大小决定。

![inline-example]({{site.img_dir}}{{page.dir}}/inline-model2.png)

接下来我们从生态圈的底层开始分析：

##### 内容区

接上文，这个内容区大小由文本内容和字体大小决定。
字体大小决定了一个em框的高度，em框的高度决定内容区的高度,
如图，设定font-size为15px;em boxes高度为15px;content area高度为15px;

![inline-example]({{site.img_dir}}{{page.dir}}/em.png)

content area这个东西似曾相识啊，对，在盒模型里也有一个内容区。那么这个content area能加margin，padding，border这些属性么？答案是能，但是不会对行内框的高度产生影响，[这个之后细讲](#section-7)。

##### 行内框

我们之前说到行内框包裹匿名文本和行内元素，那么行内框的高度又是怎么决定的？

![inline-example]({{site.img_dir}}{{page.dir}}/inline-model2.png)
再次出现这张图，我们可以看到，"containing"文本的inline box和content area是等高的。而"box"多了点东西，两头多的那东西叫做行间距(leading)，这就与line-height有关系了。一句话，**内容区+行间距=行内框**

![inline-example]({{site.img_dir}}{{page.dir}}/inline-box.png)

##### 行框

之前说过行框是统领行内框的老大，他的高度要由行内框决定。
最高行内框的脑袋和最低行内框的脚底的高度差就是行框的高度。


## 行间距

说到行间距，有了前面的铺垫就简单多了。跟行间距密切相关的属性是line-height，行间距等于line-height-font-size，半间距等于(line-height-font-size)/2（可能为负）,
把半间距分别增加到内容区的顶部和底部，就得到了行内框。但是注意行内框的高度并不影响内容区的高度，内容照常显示，只是行高变化了，这表示可能出现上下两行内容重叠的情况。



## 框属性对行结构的影响

> 前面说到内容区可使用margin, padding, border这些框属性;那么这些框属性对行高有什么影响？

先说两个名词

- 行内非替换元素： 指内容被标签包裹住的行内元素，设定后不能在外部更改，如span,a

- 替换元素： 指内容通过外部引入的元素，内容可通过外部更改，如img

##### 行内非替换元素

- 对于行内非替换元素而言，内容块影响行内框高度，框属性不影响行内框高度
- 对于行内非替换元素而言，内容块高度与font-size有关，与height属性无关
- 设定padding和border，因这两个属性是可见的(设置background)，因此会显示样式
- 设定margin，首先margin是不可见的。在垂直方向上受行高限制，margin会被隐藏，无效果；
在水平方向上，会增加和相邻内容的距离。

##### 替换元素
- 替换元素被认为是有固定高度和宽度的
- 会用替换元素整体（包括内容、外边距、边距和内边距）来定义元素的行内框

<p data-height="464" data-theme-id="20013" data-slug-hash="KdXywK" data-default-tab="result" data-user="curlyCheng" class='codepen'></p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

我们可以联想到，替换元素和行内块元素很相似。可以通过设置display:inline-block，改变元素的显示方式，达到替换元素在行内的效果。

## 附录

- 本文总结自《CSS权威指南》基本视觉格式化章节->行内元素和文本属性->垂直对齐