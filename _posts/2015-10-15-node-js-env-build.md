---
layout: post
title: ubuntu下nodejs环境配置
category: node
tags: [node, linux, install]
---
> 本文将介绍ubuntu下的nodejs环境配置，附加记录node包使用历史

* TOC
{:toc}

## ubuntu下的nodejs环境配置

> 看了网络上种种恐怖经验，没敢使用apt-get安装

##### 官网下载node已编译好的文件

[node官网](https://nodejs.org/en/)下载已编译好的文件，解压后即得到可以使用的node以及npm。要做的是将其设置为全局的。

{% highlight bash %}
~ sudo ln -s 文件夹路径/bin/node /usr/bin/node
~ sudo ln -s 文件夹路径/bin/npm /usr/bin/npm
~ node -v
~ npm -v 
{% endhighlight %}

来自[Linux下Nodejs安装（完整详细）](http://my.oschina.net/blogshi/blog/260953)

##### 通过nodejs的git仓库下载源文件安装

{% highlight bash %}
~ git clone https://github.com/nodejs/node.git
~ cd node
~ git branch -r
~ git checkout v0.12.7-release
~ ./configure
~ make
~ sudo make install
~ sudo ln -s /usr/local/bin/node /usr/bin/node
~ sudo ln -s /usr/local/bin/npm /usr/bin/npm
~ node -v
~ npm -v
{% endhighlight %} 

来自[准备Nodejs开发环境Ubuntu](http://blog.fens.me/nodejs-enviroment/)
按链接中教程无法使用express
> 最新express4.0+版本中将命令工具分家出来了(项目地址:https://github.com/expressjs/generator),所以我们还需要安装一个命令工具,命令如下: 
```
npm install -g express-generator
```

## node包使用历史

- [gulp](http://www.gulpjs.com.cn/)： 前端开发自动化工具，使用简单，插件丰富
- [coffee](http://coffee-script.org/)： 使Javascript更加简洁方便的语言，通过编译产生js代码
