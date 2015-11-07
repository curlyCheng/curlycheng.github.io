---
layout: post
title: Javascript精要
tags: javascript
category: Javascript
---
> 本文记录javascript精要

* TOC
{:toc}

数据类型
---

#### 分类

js的数据类型可总括为：原始类型和对象类型，以及两个特殊原始值null和undefined。
**原始类型**：可认为是js的组成原子，数字、字符串、布尔值。其为不可变值。
**对象类型**：对象是属性的集合，普通对象，两个特殊对象：数组，函数。其为引用类型，属性值可变。
**null**：它是一个关键字，typeof检查类型得到”object“，可理解其为一个空对象。
**undefined**：它是一个预定义的全局属性	，将其作为值赋给变量，可理解为无值。typeof检查类型得到“undefined”，无家可归（未定义||未初始化）的变量都被归为此类。

{% highlight javascript %}

var prince;
console.log(prince) // undefined
console.log(priceness) // Error:not defined
console.log(typeof priceness) // undefined

{% endhighlight %}

#### 类型检查

- typeof操作符检测类型
![]({{site.img_dir}}{{page.dir}}/typeof-return.jpg)

> 注意: 由于 typeof 也可以像函数的语法被调用，比如 typeof(obj)，但这并不是一个函数调用。 那两个小括号只是用来计算一个表达式的值，这个返回值会作为 typeof 操作符的一个操作数。 实际上不存在名为 typeof 的函数。

- instanceof操作符检测对象类
instanceof根据原型链判断“继承”关系
```
	x = new Date();
	x instanceof Date; // True
	/*左值为变量，右值为构造函数*/
```
- class特性（参照6.8.2节）以及constructor属性（参照6.8.1节和§9.2.2节）

#### 变量声明提前

变量声明提前，但初始化仍在定义时进行

{% highlight javascript %}

	function f(){
	var scope;//在函数顶部声明了局部变量
	console.log(scope);//变量存在，但其值是"undefined"
	scope="local";//这里将其初始化并赋值
	console.log(scope);//这里它具有了我们所期望的值
	}

{% endhighlight %}

---

对象
---

#### 全局对象

全局对象可理解位Javascript预定义的环境

> 当JavaScript解释器启动时（或者任何Web浏览器加载新页面的时候），它将创建一个新的全局对象，并给它一组定义的初始属性

在控制台输入this.可查看这些全局的物件：

> - 全局属性，比如undefined、Infinity和NaN。
- 全局函数，比如isNaN()、parseInt()和eval()
- 构造函数，比如Date()、RegExp()、String()、Object()和Array()
- 全局对象，比如Math和JSON

#### 包装对象

之所以说javascript里的一切都是对象，就是因为即使是原始类型也可通过构造函数转换为对应的包装对象。原始类型字面量是不存在属性和方法的，但是却可以引用属性和方法，在这个过程中，js将通过构造函数创建一个临时对象，一旦引用结束临时对象被销毁。

---

函数
---

#### 定义方式

- 函数定义表达式

{% highlight javascript %}

	var square = function(x) {return x * x}

{% endhighlight %}
变量声明提前，函数对象定义未提前

- 函数声明语句
通过function声明，函数名为指向函数对象的变量，函数名和函数对象都提前
{% highlight javascript %}

	function square(x) {
		return x * x
	}
{% endhighlight %}



#### 作用域链

js中没有块作用域的概念，顶替之的是函数作用域，每一个函数都有自己的作用域。

作用域链是一个对象链，链中的对象包裹着函数的参数以及局部变量。在调用函数时，创建一个新的作用域链以供调用查询。

#### 原型

每一个对象都有一个祖先——原型对象。

通过对象直接量创建的对象，继承自Object.prototype

通过构造函数创建的对象，继承自构造函数prototype的值，```Array.prototype```

而Array.prototype的属性继承自Object prototype，这一系列的继承关系也就构成了原型链。对于js来说可以通过原型链产生继承关系，实现“类”。


#### 继承

---

数组
---

#### delete运算符
将元素从数组删除，但数组长度不变，var声明的变量是无法通过delete删除的。
{% highlight javascript %}
arr = ['a','b','c']
> ["a", "b", "c"]
delete arr[1]
> true
arr.length
> 3
arr
> ["a", undefined, "c"]
arr[1]
> undefined
0 in arr
> true
1 in arr
> false
{% endhighlight %}
