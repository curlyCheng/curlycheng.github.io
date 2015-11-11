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

- typeof操作符
可以区分基础类型，原始类型和对象的区分
![]({{site.img_dir}}{{page.dir}}/typeof-return.jpg)

- classof函数
通过class特性区分
可以区分内置构造函数（String，Date...），但无法区分自定义构造函数

- constructor属性
通过构造函数区分
可以区分各个构造函数

- instanceof操作符或isPrototypeOf()

instanceof根据原型链判断“继承”关系，但原始类型较特殊
```
	x = new Date();
	x instanceof Date; // True
		/*左值为变量，右值为构造函数*/
	Date.prototype，，.isPrototypeOf(x)
```

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


#### 属性

对象属性包括自有属性，继承属性（包括内置方法）。检测对象的属性是否存在可通过```in,!==undefined```，检测对象中是否存在自有属性```o.hasOwnProperty(p)```,检测是否存在可枚举的自有属性```o.propertyIsEnumerable(p)```

对象继承的内置方法是不可枚举的

{% highlight javascript %}
Object.prototype.propertyIsEnumerable('toString') //false
{% endhighlight %}

for..in.. 可遍历对象中所有的可枚举属性
Object.keys(o) 返回一个数组，这个数组由对象中可枚举的自有属性的名称组成
Object.getOwnPropertyNames(o) 返回一个数组，这个数组由对象中所有自有属性的名称组成

数据类型属性的特性包括：value，writable，enumerable，configurable
可通过Object.getOwnPropertyDescriptor查询对象中某属性的特性情况，如：```Object.getOwnPropertyDescriptor(Object.prototype,"toString")```
可通过Object.defineProperty设置属性特性```Object.defineProperty(Object.prototype,"toString",{enumerable:true})```

{% highlight javascript %}
Object.defineProperty(Object.prototype, "extend", {
	writable: true,
	enumerable: false,
	configurable: true,
	value: function(o) {
		if (o == undefined) return
		names = Object.getOwnPropertyNames(o);
		for (var i=0, len= names.length; i<len; i++) {
			if (names[i] in this) continue;
			var desc = Object.getOwnPropertyDescriptor(o, names[i]);
			Object.defineProperty(this, names[i], desc);
		}
	}
});
{% endhighlight %}

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

#### 方法

一个方法无非是个保存在一个对象的属性里的JavaScript函数
```o.m = f;```

#### 构造函数

构造函数调用创建一个新的空对象，这个对象继承自构造函数的prototype属性。

#### 参数

当调用函数的时候传入的实参比函数声明时指定的形参个数要少，剩下的形参都将设置为undefined值。

标识符arguments是指向实参对象的引用，实参对象是一个类数组对象。修改实参数组的元素同样会修改实参的值。arguments有callee和caller两个方法。

#### 作用域链

js中没有块作用域的概念，顶替之的是函数作用域，每一个函数都有自己的作用域。

作用域链是一个对象链，链中的对象包裹着函数的参数以及局部变量。在调用函数时，创建一个新的作用域链以供调用查询。

#### 闭包

函数的执行依赖于变量作用域，这个作用域是在函数定义时决定的，而不是函数调用时决定的

{% highlight javascript %}
function bind(f,o){
if(f.bind)return f.bind(o);//如果bind()方法存在的话，使用bind()方法
else return function(){//否则，这样绑定
return f.apply(o,arguments);
};
}

{% endhighlight %}


#### this

this 是一个关键字，若是通过方法调用，this指向调用方法的对象；若是函数调用，this不是全局变量就是undefined


---

继承
---

#### 原型

每一个对象都有一个祖先——原型对象。

通过对象直接量创建的对象，继承自Object.prototype

通过构造函数创建的对象，继承自构造函数prototype的值，```Array.prototype```

而Array.prototype的属性继承自Object prototype，这一系列的继承关系也就构成了原型链。对于js来说可以通过原型链产生继承关系，实现“类”。

在ECMAScript5中使用```Object.getPrototypeof(o)```可以查询到对象的原型。在ECMAScript3中通过```o.constructor.prototype```检测对象原型。可以通过```p.isPrototypeOf(o)``` 来检测p是否是o的原型

#### 继承


{% highlight javascript %}
/**
 * 返回继承自p的类的实例化对象
 * @param  {原型对象}
 * @return {创建的对象}
 */
function inherit(p) {
    if (p == null) throw TypeError();
    if (Object.create)
        return Object.create(p)
    t = typeof p;
    if (t != "object" && t != "function")
        throw TypeError();
    function f(){};
    f.prototype = p;
    return new f();
}
{% endhighlight %}

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
