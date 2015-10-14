---
layout: post
title: 使用jekyll和github pages建立博客
tag: [jekyll, git, blog]
categories: [每日惊奇]
---
> 在无域名且无服务器的情况下，如何建立一个实用的个人博客？结合github pages和jekyll可以产生一个不错的解决方案。在渴望拥有个人blog的欲望驱使下，搜寻到了该解决方案，摸索摸索，折腾折腾，人生第一个原生blog√。这篇日志将介绍jekyll的基本以及建立blog过程中觉得有必要记录的部分。

* TOC
{:toc}

## Jekyll和github Pages？

在开始时，搜索到阮一峰老师的[搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)这篇文章，文章里介绍了什么是github pages，什么是jekyll，并且提供了一个极简的建博教程。很不错的入门文章。

Jekyll是一个使用ruby语言编写的静态网页生成器，使用者要做的是按照 Jekyll的规范建好目录、写好内容，而jekyll做的则是将用户写好的东西转换为静态页面。

github pages可以理解为托管在github上的静态网页。github允许用户将自定义的网页上传，
<em>这种上传并不是单纯的上传，而是会经过Jekyll程序的再处理。</em>

**简单的说，Jekyll负责提供编写工具，使博主可以方便敏捷地开发、维护blog；github则提供托管功能，使blog在网络中存在。**

## Jekyll初始化

[Jekyll官方文档](http://jekyll.bootcss.com/docs/home/)+参考[使用 Jekyll 的站点](http://jekyll.bootcss.com/docs/sites/)，动手建立一个blog。

Jekyll是使用ruby开发的一个套件，在本机使用Jekyll必然是需要ruby环境的，ruby安装参考另一篇博文[Ruby&Rails ubuntu下安装](/ror/ruby-rails-install.html)。RubyGems是ruby的套件管理工具，在ruby安装时会附带安装上，有了这么一个工具安装ruby套件便十分简单了。
jekyll官方引擎和github Pages使用的jekyll引擎在解析方面有一些不同，避免预览效果和线上效果差异，可在本地安装github pages环境(包含jekyll)，参考[https://help.github.com/articles/using-jekyll-with-pages/](https://help.github.com/articles/using-jekyll-with-pages/)。

~~~~~~~~~~~~   
	
	gem install bundler #=>bundler是一个gem包管理工具，按照Gemfile内容管理应用需使用的包。
	
	# 在工作目录下建立一个Gemfile，写入gem 'github-pages'
	
	gem install github-pages #=>安装github-pages

	bundle exec jekyll serve #=>在bundler下运行jekyll

~~~~~~~~~~~~

以下具体参考Jekyll官方文档-> 基本用法

```bash
	jekyll build # =>当前文件夹中的内容将会生成到 ./site 文件夹中。建立gitignore文件忽略./site
	jekyll serve # =>同时也集成了一个开发用的服务器，启动之使用浏览器在本地进行预览。
```

接下来，就可以自由开发了，Jekyll支持[Liquid模板语言](https://docs.shopify.com/themes/liquid-basics)。

## 开发历程

#### Blog结构

![Blog结构]({{site.img_dir}}{{page.dir}}/curly_blog.png)

- _includes: 
	- excerpt.html: 将文章摘要部分作为片段提出
- _layouts:
	- default.html: 定义外部框架
	- post.html: 定义博文模板
	- mode: 适用普通内容模板
	- tl-mode: 使用内容向左对齐的模板
- css:
	screen.css: 所有样式，包括部分自适应

[源代码](https://github.com/curlyCheng/curlycheng.github.io)

#### 分类目录

设定Yaml头信息Categories，Jekyll在build时会按Category生成对应目录，从而确定文章url。

``` 	
site.categories #=>获取站点所有分类目录  
cate in site.categories #=>cate是一个数组，cate[0]存放类目名，cate[1]存放类目下post对象。
```

#### 标识

设定Yaml头信息Tags，多个Tags以数组形式设定，要实现标识检索功能可参考[在 Jekyll 里生成一个标签云 (Tag Cloud)](http://jekyll.bootcss.com/docs/resources/)

#### _config.yml

1. 可以理解为全局属性设定。可自定义内容，在页面中使用```site.xxx```。
1. 修改_config.yml后需要重新启动jekyll才会生效。
1. 更改post的url，比如设置为目录/文章.html，```
permalink: /:categories/:title.html```

#### markdown

jekyll中可选择使用四种markdown解释器(将markdown内容翻译为HTML代码)，分别是maruku、rdiscount、redcarpet、kramdown

* maruku： jekyll官方引擎默认的markdown解释器，支持扩展，对中文支持不佳,项目已停止维护，[【语法地址】](https://github.com/bhollis/maruku/blob/master/docs/markdown_syntax.md)。

* rdiscount： [【支持扩展】](http://dafoster.net/projects/rdiscount/)，语法参照[Discount](http://www.pell.portland.or.us/~orc/Code/discount/#Language.extensions) 
	
{% highlight ruby %}
					
rdiscount:
  extensions:
    - autolink      # greedily urlify links
    - footnotes     # footnotes
    - smart         # typographic substitutions with SmartyPants

{% endhighlight %}

* redcarpet： 支持扩展

{% highlight ruby %} 

markdown: redcarpet
redcarpet:
  extensions: ["fenced_code_blocks", "tables", "highlight", "strikethrough"]

{% endhighlight %}

* kramdown：支持自定义配置，支持生成TOC,还有Math engine。[【快速了解】](http://kramdown.gettalong.org/quickref.html)

> 通过在_config.yml中配置markdown: kramdown，选择jekyll使用的解释器。

以上参考自[Markdown的各种扩展http://segmentfault.com/a/1190000000601562](http://segmentfault.com/a/1190000000601562) 

#### 代码高亮

pygments根据语言产生不同的代码高亮效果，其实是通过对markdown文本解释，对code块中的内容进行标识。因此，也就需要与markdown解释器共同作用了。

> 在_config.yml中配置highlighter: pygments

	pygmentize -f html -a .highlight -S default > pygments.css
	将生成的css文件放到css文件夹下
	在html模板中引入css文件

	若使用redcarpet解释器，在md文件中可使用
	``` ruby
	  //...ruby code
	```
	制定ruby代码块高亮

	若使用kramdown解释器，需要先在_config.yml中做如下设置
	kramdown:
	  input: GFM
	在md文件中使用highlight标签包裹代码

就对pygments的支持情况来看，redcarpet表现更佳，但是kramdown自带TOC功能

~~~ 
* TOC
{:toc}
~~~

最终选择kramdown。看sf社区里有人说觉得github pages的markdown编译器很渣，下有答说并
不是渣，只是语法有很多不同，表示同意。

## 联想

在写样式文件时，发现无法书写父子样式，无法统一处理颜色，对开发效率有影响。不得不感慨到sass，less预处理工具的人性化和易维护。

**todo: 尝试引入sass，优化样式文件**。

**todo: 添加tag检索功能**

**<span style="text-decoration:line-through">todo: 解决markdown样式优化,代码无法高亮问题</span>**

**todo: 参考好奇心日报开发paint子站**[jekyll官方文档-github-pages](http://jekyll.bootcss.com/docs/github-pages/)



