---
layout: post
title: ubuntu安装与配置小册
category: Linux
tags: [tool,linux]
---
> 迁移来之前记录的ubuntu安装、配置文章，方便更新。

* TOC
{:toc}

安装相关
---
#####  卸载ubuntu
[Win7与Ubuntu双系统时卸载Ubuntu的方法--linux公社](http://www.linuxidc.com/Linux/2010-03/25129.htm)
MBRFix+分区删除卷

##### 硬盘安装ubuntu
[Ubuntu 14.04 下载、安装、配置 整理汇总--linux公社](http://www.linuxidc.com/Linux/2014-04/100370.htm)
安装需注意：
>  1. vmlinuz这个文件，在64位iso里叫vmlinuz.efi，使用时把后缀去掉。

2. 用EasyBCD配置引导文件时，注意64位Win 7采用的是GPT分区表，所以，C盘不是(hd0,0)而是(hd0,1)——前提是你只有一块硬盘或你把Win7装在了主硬盘上，如果是装在了第二块硬盘上，那么C盘是(hd1,1)，是1而不是0的原因：GPT分区表默认隐藏了一个系统保留分区，100M，所以你的C盘不在0区而在1区。

3. 64位Win7还会带来另一个问题，就是GPT分区的签名，如果不做任何处理，按照1+2两点你可以登入Ubuntu的体验版，但是通过桌面安装时，会发现在分区时无法识别你的Win7分区。所以还需要打开桌面安装前，打开终端，输入一行命令：

sudo dd if=/dev/zero of=/dev/sda bs=1 count=8 seek=512

目的是消除GPT分区表签名。

##### 网卡问题
可使用手机USE共享热点联网，之后在设置->软件和更新->附加驱动
安装网卡驱动

#####  主文件夹配置
若用的是中文系统，终端操作主文件夹实在是很不方便。但自定义文件夹后，被删的还会回来，被改的不能代替原有的角色。应该是有一个配置文件存在的，它就是```~/.config/user-dirs.dirs```
{% highlight bash %}

# This file is written by xdg-user-dirs-update
# If you want to change or add directories, just edit the line you're
# interested in. All local changes will be retained on the next run
# Format is XDG_xxx_DIR="$HOME/yyy", where yyy is a shell-escaped
# homedir-relative path, or XDG_xxx_DIR="/yyy", where /yyy is an
# absolute path. No other format is supported.
#
XDG_DESKTOP_DIR="$HOME/desktop"
XDG_DOWNLOAD_DIR="$HOME/downloads"
#XDG_TEMPLATES_DIR="$HOME/模板"
#XDG_PUBLICSHARE_DIR="$HOME/公共的"
#XDG_DOCUMENTS_DIR="$HOME/文档"
#XDG_MUSIC_DIR="$HOME/音乐"
#XDG_PICTURES_DIR="$HOME/图片"
#XDG_VIDEOS_DIR="$HOME/视频"

再创建一个文件：
echo "enabled=false" > ~/.config/user-dirs.conf
{% endhighlight %}

重新登录一下，便可见效。

##### 删除Amazon链接
```sudo apt-get remove unity-webapps-common ```


日常工具
---

##### 输入法
安装搜狗输入法，针对14.04版本以上，15.04需要再做一步操作（百度一下，你就知道）。
到[搜狗输入法for linux官网](http://pinyin.sogou.com/linux/)下载deb安装包，dpkg或软件中心安装，安装完成后，设置->语言支持，键盘输入法方式系统  设置为fctix （搜狗输入法建立在fctix框架之上）。注销重新登录，进一步偏好设置在搜狗输入法设置中，高级->fctix设置中英文优先级。

##### office
自带的liboffice难以满足跨平台要求，可尝试wps for linux顶替之，
卸载liboffice```sudo apt-get remove libreoffice-common```
wps for linux官网下载deb包，dpkg或软件中心安装。

##### 通讯工具
国人必备企鹅
[http://zhidao.baidu.com/question/456744409070188845.html?fr=iks&word=wine+qqintl.zip&ie=gbk](http://zhidao.baidu.com/question/456744409070188845.html?fr=iks&word=wine+qqintl.zip&ie=gbk)

##### 云盘
在百度云未兼顾linux又不想费力安装bcloud之前，还是用一些兼顾linux系统的新鲜力量，dropbox要翻墙，我腿短暂不考虑。最终选择坚果云，各平台兼容。官网下载deb包，若提示缺少依赖文件，```sudo apt-get -f install```

##### 思维导图
xmind free版足够

##### 阅读器
从FBReader到okular到calibre，针对epub格式，FBReader使用极不方便；okular功能强大，有目录，能画能写能图，但要安装libepub库才可支持epub格式；目前使用的是calibre，满足基本要求（目录，能划），支持epub

##### 图片编辑工具
ubuntu自带有照片处理工具shotwell，可以满足照片处理的基本要求。但想要有photoshop的功能还需要GIMP，其实用的并不爽。

##### chrome安装
{% highlight bash %}
sudo apt-get install libappindicator1 libindicator7  
sudo dpkg -i google-chrome-stable_current_amd64.deb   
sudo apt-get -f install 
{% endhighlight %}

开发辅助
---

##### 命令行辅助
查看shell，```cat /etc/shells```，觉得ubuntu自备shells还不够强大，安装zsh和Oh-my-zsh
参考[知乎专栏mac talk-oh-my-zsh](http://zhuanlan.zhihu.com/mactalk/19556676)
> 配置opendir ```vi ~/.bashrc```，加入```alias opendir='nautilus'```

##### host修改

没钱养vpn，那就屌丝地改host吧

```sudo gedit /etc/hosts```
[Google 可用Hosts永久更新站](http://igge.gq/)
[Google hosts 2015 持续更新](http://www.awolau.com/hosts/google-hosts.html)
```/etc/init.d/networking restart```

开发工具
---

1. sublime
 sublime->package control->解决中文无能问题
```
sudo apt-get install build-essential libgtk2.0-dev
[然后跟着做](http://jingyan.baidu.com/article/f3ad7d0ff8731609c3345b3b.html)
```
->加个[evernote-markdown](https://packagecontrol.io/packages/Evernote)
1. [nodejs安装](/node/node-js-env-build.html)
1. [Android Studio安装](http://www.ray-world.com/?p=618)，[更新镜像服务](http://tools.android-studio.org/)，[SDK下载](http://tools.android-studio.org/index.php/sdk)
1. git：```sudo apt-get update && sudo apt-get install git```

1. mysql [中文乱码解决](http://blog.csdn.net/zht666/article/details/8783396)
