---
layout: post
title: python学习之管中窥豹
tags: [python, study]
category: Python
---
> 粗粗看过[简明Python教程](http://www.kuqin.com/abyteofpython_cn/index.html)，边看边用[廖雪峰的Python教程](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000)。记一记思路和总结。

* TOC
{:toc}

## 关键字if,while,for,break,continue使用：	

##### 练练手
五个小朋友猜数字，输入猜测的数字，输出提示（高或低），直到猜对为止
```
python3中使用 print函数输出，取消raw_input，使用input函数输入
```

## 函数使用：

##### 要点
1. 函数参数类型及使用方法

##### 练练手
学生信息输出程序。输入学生学号，姓名，性别（默认为男），以及一些选填项（联系方式，地址），分数。使用平均分计算函数计算平均分。调用函数，输出学生所有信息和平均分。

## 模块使用：
模块即是一个python文件，内含有变量、函数。通过import导入，from...import是导入模块中的一个或多个类。

##### 练练手
os模块的使用：编写一个文件备份程序，选择文件和目录，备份地址，备份文件以日期命名，备份为zip格式


## 数据结构使用：

list: ["jerry","tom","kevin"]，可变，有索引

tuple: ("jerry","tom","kevin")，不可变，有索引

string: "abcde fcd"，不可变，有索引，str类的对象

dict: {"name": "kevin", "age": 18, "friends": list1}，不可变，键值对

set: {1,2,3}，不可变，键的集合，不存值

序列特征: 索引和切片，典型序列：list、tuple、string
 

## 实现类，继承，实例化，多态：

##### 要点
1. 属性访问限制：```__xxx 私有属性， _xxx 非私有但请私有化使用， __xxx__ 特殊属性或方法名```
2. 继承：在__init__构造函数中需调用父类的__init__构造函数
3. 多态，鸭子类型，只要有需要的方法就可填补其他类的位置
4. 使用type判断基本数据类型，使用isinstance判断继承类型

##### 练练手
建立Member类，具有实例属性name，方法get_name

Teacher类继承Member类，具有实例属性students，方法get_students

Student类继承Member类，具有类属性count，实例属性teacher，私有属性grade，方法set_grade和get_grade，grade存放的是cal_ave函数计算的平均分

实例化教师类和学生类，最后输入教师名，输出教师下的所有学生信息

## 文件操作

{% highlight python %}
with open('/path/to/file', 'r') as f:
    print(f.read())
{% endhighlight %}

## 进程和线程

##### 要点： 
1. multiprocessing模块就是跨平台版本的多进程模块。multiprocessing模块提供了一个Process类来代表一个进程对象
2. 如果要启动大量的子进程，可以用进程池的方式批量创建子进程
3. 通过Queue，Pipes实现进程间通信
4. subprocess模块可以让我们控制子进程输入和输出

1. Python的标准库提供了两个模块：_thread和threading，_thread是低级模块，threading是高级模块，对_thread进行了封装。绝大多数情况下，我们只需要使用threading这个高级模块
2. 多进程中，同一个变量，各自有一份拷贝存在于每个进程中，互不影响，而多线程中，所有变量都由所有线程共享，所以，任何一个变量都可以被任何一个线程修改。使用threading.Lock()生成线程锁
3. Python的线程虽然是真正的线程，但解释器执行代码时，有一个GIL锁：Global Interpreter Lock，任何Python线程执行前，必须先获得GIL锁，然后，每执行100条字节码，解释器就自动释放GIL锁，让别的线程有机会执行。这个GIL全局锁实际上把所有线程的执行代码都给上了锁，所以，多线程在Python中只能交替执行，即使100个线程跑在100核CPU上，也只能用到1个核。
4. Python虽然不能利用多线程实现多核任务，但可以通过多进程实现多核任务。多个Python进程有各自独立的GIL锁，互不影响。
5. 绑定ThreadLocal，绑定线程和局部变量

1. 实现多任务:多进程、多线程、在单进程基础上利用异步IO实现事件驱动模型（协程）
2. 计算密集型 vs. IO密集型

##### 练练手
工厂里有一传送带，传送带上有三个安放货物的格子，A在传送带一端放置物品，B在另一端取下物品，两人拿一件物品需要休息一会儿，休息时间随机。运送100个货物并记下时间


## 爬虫
[python学习之小试爬虫](/python-reptile-use-urllib2.html)