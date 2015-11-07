---
layout: post
title: python爬虫之小试爬虫
tags: [python, study]
category: Python
---
> 尝试写入门爬虫，小试python这把牛刀。

* TOC
{:toc}

## 启程

以[知乎——如何入门 Python 爬虫？](http://www.zhihu.com/question/20899988)为入口，
参考[Python爬虫入门教程](http://blog.csdn.net/column/details/why-bug.html)，[做一做爬虫闯关练习](http://www.heibanke.com/lesson/crawler_ex01/)，在urllib2基础上实现基本爬虫，cookielib实现post请求，试用Request模块，使用布隆过滤器做重复筛选。用python弄点有趣的东西玩一玩。


## 爬虫spider

网络就像是一张极大的图，图是由节点和弧构成的，可以从一个节点通过弧到另一个节点，那么理论上从一个节点出发通过弧可以走遍所有节点（出发节点的度要足够大）。网络中的节点便是网页，弧便是链接这些网页的超链接，通过遍历（BFC或DFC）可以访问到所有的网页。那么访问页面，保存页面，提取超链接，检查是否访问过，访问下一个页面就是爬虫要做的事了。

- 一般，对于一个站点而言，其首页起着导航、预览的功能，其出度足够大。因此，使用站点的首页适合作为爬虫的起点。
- 访问页面的过程。一般使用urllib2模块模拟浏览器发出HTTP请求便可在响应的content部分获取到页面内容，将内容保存至指定文件即可（使用os模块设计目录结构）；当然也会遇到一些复杂的情况，比如说需要通过POST发送表单数据通过身份验证，而后才能访问，这时可以使用HTTPfox插件抓包分析，可以使用request模块处理复杂HTTP请求。
- 提取超链接的过程。最基本的情况是通过a标签获取href属性的值，可能还需要做一定的筛选（如域名限制，路径限制），这些可使用正则表达式来匹配获取。但是现在多数站点会充分依赖Ajax做实时请求JSON数据，用javascript做内容的动态插入，这也就使超链接的存在方式变得复杂。另外，一些站点会依照RESTful的规范设计URL。
- 检查是否访问过。对于小型站点，我们当然可以通过设定一个set集合来放置已访问过的url，然后通过遍历集合判断url是否已访问过。可想而知，这种简单粗暴的方法效率极低，这时bloom filter便会成为一大救星。
- 访问下一个页面。访问下一个页面是需要url的，我们会想到url从哪里来，自然而然是要把未访问过的url放置在一个安全的地方。就暂且使用一个先进先出的队列来放未访问过的url，对的，广度优先遍历。

## urllib2/urllib

两个模块都是python自带的特殊模块，其可以对url进行处理并可向服务器发送请求，获取url对应资源。
**urllib**可完成url处理，HTTP访问，资源获取，资源下载。其方法且看[urllib模块中的方法](http://www.cnblogs.com/sysu-blackbear/p/3629420.html)
**urllib2**看似是urllib的升级版，但其实urllib中的一些方法urllib2中并没有封装（如urlencode，将URL中的键值对以连接符&划分，so，要完成post请求需依赖urllib）。那么urllib2有什么特殊的技能？urllib2的强大之处在于
1. 拥有Request方法，可将url、data、header组合生成为一个Request对象
2. urllib2中通过handler完成协议处理和各种功能。而urllib2中可自定义opener来管理handler，```urllib2.urlopen(req)```使用默认的opener发出请求


##### 小练习：指定起始页和结束页获取baidu搜索结果页

{% highlight python%}
#! /usr/bin/python
import urllib2,string,os

headers = {'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'}

# 创建页面储存目录
parent_dir = os.path.abspath('.')
file_dir = os.path.join(parent_dir, 'reptile_dir/')
if not os.path.exists(file_dir):
	os.mkdir(file_dir)

def baidu_search(url, begin_page=0, end_page=0):
	for page in range(begin_page, end_page+1):
		new_file = file_dir + string.zfill(page, 5) + ".html" 
		# e.g. 00001.html
		print("page" + str(page) + "begin download to" + new_file)
		req = urllib2.Request(url = url+str(page*10), headers = headers) 
		#一页有10个结果项
		try: html = urllib2.urlopen(req).read() 
		#使用默认的opener发出请求
		except urllib2.URLError, e: 
		#捕获URLError and HttpError
			if hasattr(e, 'code'):
				print e.code
			elif hasattr(e, 'reason'):
				print e.reason
		else:
			with open(new_file, 'w+') as f:
				f.write(html)
			print response.info() 
			#输出响应信息，一般为响应头信息
if __name__ = '__main__':
	target_url = raw_input(u'input url:\n')
	bg_page = int(raw_input(u'input begin page:\n'))
	end_page = int(raw_input(u'input end page:\n'))
	baidu_search(target_url, bg_page, end_page)
{% endhighlight %}

## 使用正则表达式匹配需要的内容

re模块包装了所有正则表达式相关的东西
[Python正则表达式](http://www.cnblogs.com/huxi/archive/2010/07/04/1771073.html)


##### 小练习：[黑板课第一关](http://www.heibanke.com/lesson/crawler_ex01/)

{% highlight python %}
#! /usr/bin/python
# -*- coding: utf-8 -*-

import re, urllib2

def getPage(url,headers):
	global init
	print url
	req = urllib2.Request(url=url, headers=headers)
	response = urllib2.urlopen(req)
	html = response.read()
	next_url = nextPage(html)
	if (next_url == "finished"):
		return
	else:
		getPage(next_url,headers)

def nextPage(html):
	nextNumRex = re.compile(r'<h3>.*?([\d]{5}).*?</h3>', re.S)
	next_num = nextNumRex.search(html)
	try:
		next_page = init + next_num.group(1)
	except Exception, e:
		print html
		return "finished"
	else:
		return next_page

init = "http://www.heibanke.com/lesson/crawler_ex00/"
headers = {  
    'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
}

getPage(init,headers)
{% endhighlight %}

## cookielib模块

Cookie是由服务器生成但保存在客户端的对象，Cookie不可跨域，但在同一域名下可全局使用，在客户端再次请求服务器时会将对应的Cookie置于请求头部发送。基于Cookie的种种特征，Cookie常常被用作存储用户标识或是存储全局跨页面数据。

cookielib则是一个用作客户端Cookie处理的模块，其可以获取服务端发送至客户端的cookie，亦可以在发送请求时设置并放置好cookie值。
[什么是cookie](http://my.oschina.net/xianggao/blog/395675)
[cookielib](https://docs.python.org/2/library/cookielib.html)

## HTTP协议分析工具HTTPFox

在处理一些表单登录请求时，为了能详细地看到请求发送的数据内容，分析请求场景。我们可以使用firefox的插件HTTPFox做HTTP请求分析。

有了HTTPFox+cookielib+urllib2+urllib这几大武器，便可以解决基本的post请求了

##### 小练习：[黑板课第二关]()

{% highlight python %}
#! /usr/bin/python
# -*- coding: utf-8 -*-
import urllib2, urllib, cookielib,re

headers = {
	"Host": "www.heibanke.com",
	"User-Agent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:33.0) Gecko/20100101 Firefox/33.0",
	"Referer": "http://www.heibanke.com/accounts/login/?next=/lesson/crawler_ex02/",
	"Content-Type":"application/x-www-form-urlencoded"
}

def login(pwd):
	global headers
	url = "http://www.heibanke.com/accounts/login/?next=/lesson/crawler_ex02/"
	user = "www"
	password = pwd	
	post_data = urllib.urlencode({
		"csrfmiddlewaretoken":"5vCqrK8SUqiLtvvBmnTbWxQHfsGPbI4c",
		"username":user,
		"password":password	
		})
	cookie = cookielib.CookieJar()
	opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookie))
	for i in cookie:
		print i
	req = urllib2.Request(url=url, headers=headers, data=post_data)
	response = opener.open(req).read()
	h3Rex = re.compile(r'<h3>(.*?)</h3>', re.S)
	h3Res = h3Rex.search(response).group(1)
	if (h3Res == '您输入的密码错误, 请重新输入'):
		return False
	else:
		print response
		return True
	

if __name__ == '__main__':
	for i in range(0,31):
		isTrue = login(i)
		if isTrue == True:
			print "Correct Password is",i
			break


{% endhighlight %}

## Request模块

[Request](http://cn.python-requests.org/zh_CN/latest/)是一个外部模块，"HTTP for Humans"其作用一目了然，更加人性化地处理HTTP请求，这意味着，相对于python自带的HTTP处理模块urllib和urllib2，Request将会完成请求封装并提供更加间接明了的接口。

> 安装外部模块，可使用python的包管理器pip或是easy_install，在使用pip安装request时可能出现```  Could not find a version that satisfies the requirement install (from versions: )
No matching distribution found for install
```这个错误，原因是从pip1.4版本开始，pip默认只安装PEP426标准版本，若一个模块未成为PEP426版本，则被认为是预发版本，在安装时需加上```--pre```标识```sudo pip install --pre requests``` 

Request闪光的地方在于其“高级用法”，比如说调用session对象。

## Bloom Filter

[布隆过滤器(Bloom Filter)详解](http://www.cnblogs.com/haippy/archive/2012/07/13/2590351.html)
在《数学之美》一书中对布隆过滤器有着间洁精要的介绍，随着集合中元素的增加，我们需要的存储空间越来越大，检索速度也越来越慢。不过世界上还有一种叫作散列表（又叫哈希表，Hash table）的数据结构。它可以通过一个Hash函数将一个元素映射成一个位阵列（Bit Array）中的一个点。这样一来，我们只要看看这个点是不是 1 就知道可以集合中有没有它了。在实施时我们需要一个m长的位数组代表位阵列；将url通过hash函数转换为位字节，将位字节在位数组中对应的位置置为1。查询位字节对应的数组位置是否全为1判断，url是否已出现过。但是，存在一种十分不幸的情况，虽说位字节对应的数组位置为1，但是是由多个url结果构成的，也就是说其实url根本没有出现过。这也就是布隆过滤器的误差了，不过这一误差不会导致漏网之鱼，大不了一个url会多查几次。同时，我们可以设想，位数组足够大误差的概率就越小。

##### 在Python中的实现

1. 可以直接使用bloomfilter模块
	1. ```https://github.com/jaybaird/python-bloomfilter```，无需安装第三方模块直接，```python setup.py install``` 安装即可
	2. ```https://github.com/axiak/pybloomfiltermmap```，需要安装Bitvector、VCforPython2.7等安装模块 
2. 使用位数组+hash函数+增加方法+查询方法
{% highlight bash %}
位数组：bitarray/bitVector
hash函数：murmur hash/cityhash/hvn hash
在pypi中查询murmur hash相关的模块，结合python适用版本和更新时间，查询到[mmh3](https://pypi.python.org/pypi/mmh3/2.3.1)模块最合适
{% endhighlight %}

{% highlight python %}
import mmh3
from bitarray import bitarray

class BloomFilter(object):
	"""docstring for BloomFilter"""
	def __init__(self, size, elem_count):
		self.hash_count = int(0.7*(size/elem_count))
		self.bit_arr = bitarray(size)
		self.bit_arr.setall(0)
		self.size = size
		print "%0.20f%%" %0.6185**(size/elem_count)
	def add(self, elem):
		for x in xrange(self.hash_count):
			index = mmh3.hash(elem, x) % self.size
			self.bit_arr[index] = 1
	def in_bf(self, elem):
		for x in xrange(self.hash_count):
			index = mmh3.hash(elem, x) % self.size
			if (self.bit_arr[index] == 0):
				return False
		return True
{% endhighlight %}

