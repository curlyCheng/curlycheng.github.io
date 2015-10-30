---
layout: post
title: SQL实例记录
tags: [数据库, sql]
category: Database
---

> 记录每天的数据库练习

#### 按日期统计一天赛事胜负场次

表内容：
2005-05-09 胜
2005-05-09 胜
2005-05-09 负
2005-05-09 负
2005-05-10 胜
2005-05-10 负
2005-05-10 负

结果：
           胜 负
2005-05-09 2 2
2005-05-10 1 2

{% highlight sql %}
select game_date, sum(case when game_status='胜' then 1 else 0 end) as ' 胜', sum(case when game_status='负' then 1 else 0 end) as '负' from game_record_01 group by game_date;
{% endhighlight %}

> 启示：sum和count的区别，前者是字段内容之和后者是记录数之和。使用if/elseif/else/endif或case/when/then/else/end

#### 请取出tb_send表中日期(SendTime字段)为当天的所有记录?(SendTime字段为datetime型，包含日期与时间)

{% highlight sql %}
select * from tb_send where datediff(curdate(),SendTime)=0;
{% endhighlight %}

> 启示：mysql的[Date内建函数](http://www.w3school.com.cn/sql/sql_dates.asp)