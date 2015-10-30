---
layout: post
title: vagrant使用记录小册
category: 开发工具
tags: [tool,记录小册]
---
> 迁移一篇之前写的vagrant使用方法记录，方便更新。

* TOC
{: toc}

### [vagrant](https://www.vagrantup.com/)

> 建立在虚拟机基础上的虚拟环境管理工具。
对于前提——虚拟机，官方推荐使用[VirtualBox](http://www.virtualbox.org/)，因为免费/容易获取/支持各平台/vagrant内嵌。
对于被管理的对象——虚拟环境，vagrant就是为了避免创建虚拟机繁琐的过程而出现的，它将一个虚拟环境封装为一个基础镜像，并给了一个生动的名字——box，所以这里的虚拟环境就是box。
而管理，也就是添加，使用，销毁这些操作了。

### 使用

1. ```vagrant init```
一个普通的目录要成为vagrant可用的目录，需要初始化一下。初始化之后可以发现在目录下多了一个Vagrantfile文件，查看此文件，发现有很多被注释的配置示例，之后再说明。

2. ```vagrant box add```
目前我们只是拥有一个vagrant可用的目录。下一步自然是需要一个虚拟环境，在box列表中没有所需的虚拟环境时可以这么做：[HashiCorp's Atlas box catalog](https://atlas.hashicorp.com/boxes/search)里聚集了各种可用的box，进入挑选一番，比如说看中了ubuntu/trusty64，在终端运行```vagrant box add ubuntu/trusty64```，vagrant会从服务器下载ubuntu/trusty64并添加进box列表，可用```vagrant box list```查看。当然也可以手动将box下载至本地，再添加```vagrant box add boxname ~/box/ubuntu/trusty64```。

3. 配置目录虚拟环境
修改Vagrantfile文件
或者在初始化时```vagrant init boxname```

4. ```vagrant up```
一切就绪，启动虚拟环境，打开virtual box可以发现该虚拟机已启动。

5. ```vagrant ssh```
以ssh登录虚拟环境，OK，已进入box，之后就可以通过终端在你的虚拟环境里为所欲为了。。。（没有ui界面）

6. ```vagrant halt```
挂起，顾名思义，关闭当前虚拟环境

7. ```vagrant destroy``` 
彻底销毁当前虚拟环境

7. 同步文件夹
在box中```ls /vagrant```，可以发现目录下的内容和宿主目录下的内容一致。这就是同步host和guest的通道

8. ```vagrant share```
需要一个[HashiCorp's Atlas](https://atlas.hashicorp.com/)账户，```vagrant login```登录后，执行```vagrant share```，得到一个url，通过这个url可以访问到虚拟环境服务器

9. ```vagrant package```
为所欲为之后，发现目前的虚拟环境之后有重复利用的机会，没有熟悉的快照肿么办。打个包，不仅能存下当前环境，还能随身带随时用。```
vagrant package --help```

10. 一个box可以被重复使用，不同目录使用时，box的内容都是初始化的。