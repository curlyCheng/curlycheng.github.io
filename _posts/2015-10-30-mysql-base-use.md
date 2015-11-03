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

#### 3张表，doctor表中有id,name,peformance三个字段，department表中有id和name两个字段，relation表中有doctor_id和department_id两个字段。

选出骨科的所有医生
{% highlight sql %}
select D.name from doctor D join relation R on R.doctor_id = D.id join department_02 P on P.id = R.department_id where P.name = '骨科';
select name from doctor where id in (select doctor_id from relation where department_id = (select id from department_02 where name = '骨科'));
select * from doctor where id in (select R.doctor_id from relation R,department_02 D where R.department_id = D.id and D.name='骨科');
{% endhighlight %}
选出骨科绩效排名第一的医生
{% highlight sql %}
select * from doctor where id in (select R.doctor_id from relation R,department_02 D where R.department_id = D.id and D.name='骨科') order by peformace desc limit 1;
{% endhighlight %}
选出所有科室绩效排名第一的医生
{% highlight sql %}
select * from (select * from doctor D,relation R where D.id = R.doctor_id  ORDER BY D.peformace desc)`temp` group by department_id;
{% endhighlight %}

> 启示：mysql执行顺序from... where...group by... having.... select ... order by...