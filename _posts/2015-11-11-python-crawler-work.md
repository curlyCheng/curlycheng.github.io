---
layout: post
title: python爬虫之指定爬取
tags: [python, study]
category: Python
---
> 总结爬虫作业思路

* TOC
{:toc}

总括
---

需实现的效果如下：输入域名以及起始页面url，爬取该站点及其子站点下的页面文档，图片以及其他文档文件(如压缩文件，工作文档)。将爬取的文件按照网站原有目录保存至本地指定文件夹。

结合爬虫原理，可以确定我们需要一个队列存放待访问url，一个布隆过滤器来验证url是否已访问。同时我们可以确定需要的方法模块，包括入口模块、目录初始化模块、页面请求模块、链接提取模块、页面存储模块、图片存储模块、url处理模块。

模块介绍
---

##### 入口模块

任务：初始化和爬虫的整体循环，参考自知乎上的答案

{% highlight python %}
#著作权归作者所有。
#商业转载请联系作者获得授权，非商业转载请注明出处。
#作者：谢科
#链接：http://www.zhihu.com/question/20899988/answer/24923424
#来源：知乎
import Queue

initial_page = "http://www.renminribao.com"

url_queue = Queue.Queue()
seen = set()

seen.insert(initial_page)
url_queue.put(initial_page)

while(True): #一直进行直到海枯石烂
    if url_queue.size()>0:
        current_url = url_queue.get()    #拿出队例中第一个的url
        store(current_url)               #把这个url代表的网页存储好
        for next_url in extract_urls(current_url): #提取把这个url里链向的url
            if next_url not in seen:      
                seen.put(next_url)
                url_queue.put(next_url)
    else:
        break
{% endhighlight %}

##### 目录初始化模块

任务：以域名作为根目录名，查看指定存放目录下是否已存在该目录，若存在则删除该目录下所有文件，若不存在则新建该目录

{% highlight python %}
def initDir(self,root):
	if not root:
		parent_dir = os.path.abspath('.')
	else:
		parent_dir = root
	dir_name = self.site.replace('http://','')
	file_dir = os.path.join(parent_dir, dir_name)
	if not os.path.exists(file_dir):
		os.mkdir(file_dir)	
	else:
		shutil.rmtree(file_dir, True)
	self.dir = file_dir+os.sep
{% endhighlight %}

##### 页面请求模块

任务： 在urllib2、urllib模块的支持下，实现页面请求。

{% highlight python %}
def getPage(self):
	result = None
	url = self.url
	req = urllib2.Request(url = url, headers = self.headers)
	try: response = urllib2.urlopen(req) #use default opener get response
	except  urllib2.HTTPError, e: #catch URLError and HttpError
		if hasattr(e, 'code'):
			print e.code
			print self.url
		elif hasattr(e, 'reason'):
			print e.reason
	except httplib.HTTPException, e:
		print e
		print self.url
	else: result = response
	return result
{% endhighlight %}

##### 链接提取模块

任务： 使用正则表达式提取页面中的所有超链接，返回一个存放所有url的list。

在爬虫中需对超链接的各种特殊情况进行处理，特殊情况包括绝对路径（当前站点和子站点，外部站点）；相对路径（index.php，/index.php，./index.php，../../index.php）。面对各种规范的语法以及父站点子站点区分的情况，将相对路径转换为绝对路径较为靠谱，若使用正则表达式个别处理反而会很麻烦。因此，采取先使用正则表达式提取文档中所有超链接的url，再对url进行字符串处理的方式。因图片提取中也需使用到url处理，便单独出url处理模块。

{% highlight python %}
def extract_urls(self):
	findUrlRex = re.compile(r"""<a.*?href\s*=\s*['|"]{1}([^><"'#]+?)['|"]{1}.*?>.*?</a>""", re.I)
	result = findUrlRex.findall(self.current_page)
	return self.url_handler(result)
{% endhighlight %}

##### url处理模块

- 绝对路径：
	- 属于本站或子站域名下的，直接保留
	- 其他，剔除
- js调用的：
	js函数调用，或是空关键字，剔除
- 相对路径：
	- './'，'/'，或直接路径开头的，全部转换为'/'开头的相对路径
	- 路径中包含若干个'../'的，将先页面url与待处理url组合处理。产生'/'开头的相对路径
	- 相对路径与当前域名结合，产生绝对路径

{% highlight python %}
def url_handler(self,urls):
	res = []
	for url in urls:
		if (url.startswith('http://') and len(url)>7):
			if (url.find(self.site[7:].replace('www.','')) > -1):
				res.append(url)
			continue
		elif (url.find("(") > -1):
			continue
		else:
			if url.startswith(('/','./')):
				url = url.replace('./','/')
			else:
				url = '/'+url
		if (url.count('../') > 0):
			steps = url.count('../')
			path = self.url.replace(self.now_site,'').split('/')[-1-steps:-1]
			arr = url.split('/')
			for i in path:
				arr[arr.index('..')] = i
			url = '/'.join(arr)
		res.append(self.now_site+url)
	return res
{% endhighlight %}

#### 页面存储模块

存储包括页面文档和其他类型文档。对于页面文档需爬取页面中的图片路径，做存储图片处理。因此需对两种类型的文档进行区分。规范情况下可通过响应头中的'Content-Type'属性区分，但有一些文件其响应头未设定'Content-Type'属性。因此，最终选择通过后缀名区分，完成基础类型的获取。

对存储路径进行处理
- 已有后缀名的文件，将url转换为对应的本地路径即可
- 无后缀名的文件，若是有文件名则默认加上'.html'作为后缀，若无文件名则默认以index.html命名

为了减轻网络压力，多数站点会在服务器端使用gzip压缩页面，例如新浪只提供gzip压缩页面。因此需要对gzip解压进行处理。

使用文件读写实现本地存储

{% highlight python %}
def storePage(self):
	global page_count, file_count
	print self.url
	response = self.getPage()
	if not response:
		return
	app_prefix = (".doc",".docx",".zip",".rar",".txt",".xls",".xlsx")
	# isApp = response.headers['Content-Type'].find('application') + 1
	isApp = self.url.endswith(app_prefix)
	predata = response.read()
	pdata = StringIO.StringIO(predata)
	gzipper = gzip.GzipFile(fileobj=pdata)
	try:
		data = gzipper.read()
	except:
		data = predata
	self.current_page = data
	url = urllib.unquote(self.url).replace('http://','')
	if self.url == self.now_site:
		url = url + '/'
	prefix = url.endswith(('.html','.htm','.aspx','.php','.jsp'))
	if isApp or prefix:
		file_path = self.dir + url
		file_dir = self.dir + url[0:url.rfind('/')]
	else:
		if url.endswith('/'):
			file_dir = self.dir + url
			url = url + 'index.html'
			file_path = self.dir + url
		else:
			file_dir = self.dir + url[0:url.rfind('/')]
			url = url + '.html'
			file_path = self.dir + url
	if not os.path.exists(file_dir):
		os.makedirs(file_dir)	
	with open(file_path, "w+") as f:
		f.write(self.current_page)
		if not isApp:
			page_count = page_count + 1
			print "download", page_count, "pages."
			self.storeImage()
		else:
			file_count = file_count + 1
			print "download", file_count, "files."
{% endhighlight %}

#### 图片存储模块

包括图片url提取，url处理，图片下载存储，整体流程与文档下载类似。
在下载时使用urllib.urlretrieve直接下载

{% highlight python %}
def storeImage(self):
	global img_count
	imgReg = re.compile(r"""<img\s.*?\s?src\s*=\s*['|"]?(/[^\s'"]+).*?>""",re.I)
	imgRegRes = imgReg.findall(self.current_page)
	result = self.url_handler(imgRegRes)
	for img in result:
		url = img
		img = urllib.unquote(img).replace(self.now_site,'')
		index = img.rfind('/')
		file_dir = self.dir + (img[0:index])
		file_path = self.dir + img
		if os.path.exists(file_path):
			continue
		if not os.path.exists(file_dir):
			os.makedirs(file_dir)
		urllib.urlretrieve(url, file_path, cbk)
		img_count = img_count + 1
		print "downloaded %s images." %(img_count)
{% endhighlight %}