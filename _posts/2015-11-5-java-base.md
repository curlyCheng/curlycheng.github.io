---
layout: post
title: Head First Java笔记
tags: ["java"]
category: Java
---
> 迁移一篇java基础知识笔记，来自于对Head First入门书的要点总结

* TOC
{:toc}

## 基本概念

**1\. Java的运行机制**

源代码Party.java -> 编译器检查语法并编译 -> 没有错误生成字节码文件Party.class -> JVM(java虚拟机)运行class文件，将字节码文件转为操作系统可用的文件

**2\. Java的程序结构**

源文件 -> 类 -> 方法 -> 语句

**3\. Java执行实质**

执行程序实质是命令JVM加载xxx类，开始执行它的main，直到main结束为止。所以文件名与main所在的类名需要一致

---

## 类和对象

**类和对象的关系**

类是对象的模板，类通过实例化产生对象

**类的结构**

类中包括实例变量和方法，实例变量的赋值在对象中完成，类只是模板

---

## 变量

> java中的变量分为主数据类型变量和对象引用变量，变量就像一个容器

**主数据类型变量**

如 int a; float b;之类的。

类型不同决定容器种类不同或者容器大小不同，一些是杯子一些是盆子，一些杯子大一些杯子小。 long,int,short,byte。

赋值就是把值的字节组合放到容器里。

**对象引用类型变量**
    
    
    Cat Tom = new Cat();
    

声明变量： 产生一个容器。 实例化：在内存堆上分配空间给新对象。 赋值： 把将新对象的地址放到容器中。
    
    
    Cat Gafe = Tom；
    

将Tom容器中的字节组合复制到Gafe容器中。

**数组**

> 数组是对象
    
    
    int [] nums = new int[7];
    Cat [] cats = new Cat[7];
    
---

## 通过方法操作实例变量和对象行为

**实例变量封装**

将实例变量设为私有(private)，通过公有的getter和setter方法操作实例变量。 无需初始实例变量，它们有默认的预设值(0,false,null...)

**实例变量和局部变量的差别**

实例变量在类中，局部变量在方法中。

实例变量有默认值，无需初始化。局部变量没有默认值，必须初始化。

---

## Java的API

> 在Java中，类是被包装在包(package)中的。

**指定类的方法：**

  1. import指定

  2. 使用全名,package.class

**包的命名**

  1. 标准函数库中的包，如`java.lang`,`java.io`

  2. 标准函数库的扩展，如`javax.swing`

**java.lang**

包含一些基础类，因此被预先加载

---  

## 继承和多态

**继承**

`class Dog extends Animal{}`

子类继承父类的方法，private实例变量和方法不会被继承。

验证继承： Dog is a Animal 

在子类中引用父类方法：`super.eat();`


**方法覆盖，方法重载**


1. 覆盖：参数一样；返回类型必须兼容；不能降低方法权限

1. 重载：参数不同；返回类型自由；可修改方法权限

**多态**

运用多态时,引用类型可以是实际对象类型的父类

`Animal peter = new Dog();`

参数也可以是多态


**类继承权限控制**

1. 非共有类只能在同一个包中继承

1. final标识类，说明类在继承树的末端，不能被继承

1. 让类只拥有    private的构造程序

---

## 接口和抽象类

**抽象类**

有些类不需要初始化

    abstract public class Dog extends Animal{
        public abstract void eat() {}; //抽象方法没有实体
        public void roam(){
            System.out.println("Hi"); 
        }
    }

抽象类只能用来继承，抽象类可包括抽象方法和非抽象方法。

抽象方法只能出现在抽象类里。


**接口**

接口实现继承多个类

    public interface Pet {
        public abstract void play(){
            ...
        } //接口的方法都是抽象的
    }

    public class Dog extends Animal implements Pet, Moveable {
        public void play() {
            //实现抽象方法
        }
    }

**类继承机制**

Java所有的类都是Object(java.lang.Object)的直接或间接子类。

---

## 构造器与垃圾收集

实例变量->对象->垃圾回收堆

局部变量->方法->栈

栈：

方法调用时，栈块放至栈顶，方法执行完毕后，栈块释放。栈顶的栈块是正在执行的方法。

堆：

实例变量占据对象空间，初始化之后在堆中产生实例化对象，并联系实例变量和对象。

**构造函数**

在对象初始化时`Dog peter = new Dog()`,实际是调用构造函数。

在没有自定义构造函数时，编译器会自动为类生成构造函数`public Dog(){}`，

构造函数没有返回值，函数名与类名相同。

可自定义构造函数，实现实例变量初始化

    public Dog(int dogSize){
        size = dogSize;
    }

构造函数可重载

**父类，继承和构造函数**

构造函数链，栈顶到栈底的构造函数: Object->Animal->Dog

调用父类构造函数：super(),编译器会自动把无参数的super函数加到构造函数最前面。

每个构造函数可以选择super()或者this()，但不可以同时使用。

**对象生命周期**

最后一个引用消失时，对象就变为可回收的。

---

## 数字与静态

**静态变量**

调用静态`static`方法，不需要实例化类，用类本身调用即可`Math.abs()`.

换句话说，静态方法与对象无关，与类有关。

在静态方法中调用非静态变量，编译器会不知道是哪一个实例的变量。同理，静态方法中不能调用非静态方法。

同一个类的所有实例共享一份静态变量。

静态变量会在该类的任何对象创建之前就完成初始化，
静态变量会在该类的任何静态方法执行之前就初始化。

**final**

final 静态变量是常量

    public static final double PI = 3.1415926; //必须初始化

调用：Math.PI

1. final变量不能被改变

1. final方法不能被覆盖

1. final类不能被继承

**包装类**

想要以对象方式来处理主数据类型，就要把它包装起来。

    int类型->Integer类， 类型<->类

    int i = 27;

    Integer intWrap = new Integer(i);

调用对象方法：
    
    int i = intWrap.intValue();

**日期操作**

使用java.util.Calendar处理日期

**执行过程**

父类static -> 子类static -> main -> 父类constructor -> 子类constructor

---

## 异常处理

**异常处理的原因**

一些方法会有风险，在某些时候会抛出异常错误。编译器会检查你是否已经了解调用该方法会产生的错误。

编译器不会检查RuntimeException及其子类的异常。

**关于异常**

异常是一种Exception类型的对象，Exception类型对象可以是任何它的子类的实例。

支持多态，当抛出多个异常时，异常要从小到大处理。

**异常抛出**

    public void eat() throws BadException { //声明异常
        if (too much) {
            throw new BadException(); //创建异常对象并抛出
        }
    }

**finally**

清理现场

    try {
        ...
    } catch(Exception ex) {
        ...
    } finally {
        ...
    }
    code ...

不管如何（即使return）都会执行finally

带有finally的try必须要声明异常

    void go() throws FooException {
        try {
            ...
        } finally {
            ...
        }
    }

**duck**

继续抛出，踢皮球

---

## 线程

**线程的产生**

Thread线程类，线程是独立的，代表独立的执行空间。

Java虚拟机自动启动主线程，其他线程人为控制。

Runnable接口，对线程要执行的任务进行定义。
    
    public class MyRunnable implements Runnable {
        public void run() {}
    }

    Runnable threadJob = new MyRunnable();

Thread对象，创建线程，创建线程执行空间。

    Thread thread = new Thread(threadJob); //给Thread取得threadJob的run方法
    thread.start(); //开始启动线程

**并发性问题**

两个不同执行空间中的线程对堆上同一个对象进行操作

synchronized 同步化方法，锁住存取数据的方法

同步化可能带来死锁问题，两个线程两个对象就可以产生死锁问题。

练习：聊天室程序

---

## Collection


