---
layout: post
title: Ruby&Rails ubuntu下安装
tag: [ruby, rails, install]
categories: [ROR]
---
> 本文介绍ruby及ruby on rails的安装过程。

1.创建新用户（在系统只有root用户的前提下），换句话说，不要使用root用户安装

2.安装必要的套件

若只安装ruby，可跳过


	sudo apt-get update

	sudo apt-get upgrade

	sudo apt-get install build-essential bison openssl libreadline6 libreadline6-dev curl git-core zlib1g zlib1g-dev libssl-dev libyaml-dev libsqlite3-0 libsqlite3-dev sqlite3 libxml2-dev libxslt-dev autoconf libc6-dev

3.安装RVM，也许官网有更新安装方法，若安装失败可看下官网

	gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3

	curl -L https://get.rvm.io | bash -s stable

	source ~/.rvm/scripts/rvm

验证安装完成

	rvm -v


4.用RVM安装Ruby

	版本可自定
	rvm install 2.2.3

	安装后可能出现
	RVM is not a function, selecting rubies with 'rvm use ...' will not work.
	参看https://ruby-china.org/topics/3705


5.用gem安装bundler和rails


	换源
	gem source -r https://rubygems.org/
	gem source -a https://ruby.taobao.org

	gem install bundler
	gem install rails

