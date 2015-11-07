---
layout: post
title: python爬虫之左右开弓
tags: [python, study]
category: Python
---
> 这一篇将介绍在python爬虫中实现并行。python实现并行可通过多线程/多进程/协程来实现。通俗地说，多线程和多进程抢占式地进行调度，协程则是协调式调度

* TOC
{: toc}

启程
---
在爬虫中最大的瓶颈在于网络IO，若是单线作战老实巴交地排队执行，网络等待这一消耗是绝不可能避免的。这时就会想到若是在等待响应的过程中能去干点别的事就好了，恰好多线程和多进程可以提供多个“minions”供差遣。有了多人作战，就增大了在等待响应时调度至其他minion做其他工作的可能性，整体上便减小了网络IO的消耗。但是使用多线程或是多进程有弊端，那便是线程和进程都是有自己的上下文环境的，在调度时就需要完成环境保存和恢复，切换过多由小积大最后有可能付出额外代价，适得其反。

这时又想如果可避免这环境调度的消耗就好了，这时发现python中还有协程这等工具，利用协程的事件驱动特性可实现异步IO。

多线程
---

[关于Threading模块的具体介绍](http://www.cszhi.com/20130528/python-threading.html)

### 实现

多线程的实现便不多说了，可以通过start_new_thread创建一个，可以调用threading.Thread构造函数，亦可以创建一个threading.Thread的子类实例化之。

### 通信

python多线程的通信可以通过两种渠道，一是Queue消息队列，另一是Pipe管道。已实现同步需求。

### 公共资源

需要注意的是共享变量的保护，但是不用担心，python的threading模块中有现成的lock方法可供使用

### 多线程与多核

在java中我们可以实现多线程调用多核运行，实现真正的并发。但在python中，不论开多少线程至始至终都只能使用一个核。罪魁祸首是python的GIL锁。

> 因为Python的线程虽然是真正的线程，但解释器执行代码时，有一个GIL锁：Global Interpreter Lock，任何Python线程执行前，必须先获得GIL锁，然后，每执行100条字节码，解释器就自动释放GIL锁，让别的线程有机会执行。这个GIL全局锁实际上把所有线程的执行代码都给上了锁，所以，多线程在Python中只能交替执行，即使100个线程跑在100核CPU上，也只能用到1个核。

python设计此锁必然有其考虑，相比其他语言，效率比较低下的python若是占有着cpu，对整体性能的影响恐怕并非美好。

### 难点

###### thread.join(self,[timeout])：
主线程阻塞，直至该线程结束。若设置timeout则限制主线程阻塞时间。可以看下面两段代码
{% highlight python %}
for thread in thread_list:
	thread.start()
	thread.join()
# 在线程1执行完毕后再执行线程2
{% endhighlight %}
{% highlight python %}
for thread in thread_list:
	thread.start()
for thread in thread_list:
	thread.join()
# 线程1线程2交替执行
{% endhighlight %}
第一段代码在线程1启动后就将主线程挂起，线程2未执行到启动语句，此时只有一个子线程存在。
第二段代码在线程1线程2启动后再设定join，此时有两个线程存在，两个线程间调度因此会出现交替执行的结果。但主线程需要在两线程执行完毕后才可继续执行。
*必须在start之后设定join*

###### setDaemon
每一个线程都有一个daemon标识，可通过```t.setDaemon(True)```来设定，也可通过```t.daemon=True```设定。daemon标识表明了这一线程是否是守护线程。何为守护线程？即在后台默默运行的线程，就像是JAVA的垃圾回收进程，在所有非守护线程（如主线程）执行完毕后程序就结束了，不会考虑守护线程此时的情况。简而概之，非守护线程占优先，守护线程地位低。*在线程启动前设置线程类型*
{% highlight python %}
def main(thread_num):
	thread_list = list()
	for x in xrange(0,thread_num):
		thread_name = "threading_%s" %x
		thread_list.append(threading.Thread(target=threading_func, name=thread_name, args=(20,)))
	for thread in thread_list:
		thread.start()
if __name__ == "__main__":
	main(2)
	print "ok"
# 未设置子线程为守护线程，ok输出代表主线程执行完毕，ok输出后子线程仍在运行
{% endhighlight %}
{% highlight python %}
def main(thread_num):
	thread_list = list()
	for x in xrange(0,thread_num):
		thread_name = "threading_%s" %x
		thread_list.append(threading.Thread(target=threading_func, name=thread_name, args=(20,)))
	for thread in thread_list:
		thread.setDaemon()
		thread.start()
if __name__ == "__main__":
	main(2)
	print "ok"
# 设置子线程为守护线程，ok输出后程序便退出
{% endhighlight %}


### queue使用

> 在主线程中使用了 queue.join()，导致主线程阻塞。queue.task_done() 表示完成一个 task，并递减没有完成的队列数，当队列全部完成时候，没有task可执行，因此需要发送一个信号，通知被阻塞的主线程，继续运行。
作者：cleverdeng
链接：http://www.zhihu.com/question/20218924/answer/14379770
来源：知乎


协程
---

> 子程序调用是通过栈实现的，一个线程就是执行一个子程序。
子程序调用总是一个入口，一次返回，调用顺序是明确的。而协程的调用和子程序不同。
协程看上去也是子程序，但执行过程中，在子程序内部可中断，然后转而执行别的子程序，在适当的时候再返回来接着执行。

这很容易让我们想到python的yield。
