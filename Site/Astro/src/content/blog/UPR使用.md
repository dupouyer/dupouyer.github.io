---
title: UPR使用
date: 2026-01-27
categories:
  - Unity
tags:
  - Unity
  - UPR
---

---
title: UPR使用
date: 2020-06-04 15:56:37
updated: 2020-06-04 15:56:37
description: Unity UPR 的使用介绍
categories: Unity
tags: tools
---

# 环境准备
## 项目准备
- 登入 [Unity UPR 官网](https://upr.unity.com/), 登入账号，选择我的项目，点击创建项目。  
![新建项目](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/1.png)  
按要求填写相关项目信息。
- 进入新建好的项目，点击新建测试
![新建测试](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/2.png)  
根据测试需求开启相关测试选项。  
PS: 项目包名需要与目标测试包保持一致。  
![创建完成](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/3.png)
创建完成  
## 测试包准备
如果需要测试查看 Mono 和 Lua 的，则需要导入 UPRTools_V0.6.2.unitypackage。  
不查看这两项数据的可以跳过此步骤。
- 导入 unitypackage
- 设置 UPRTools
- 发布

## anroid 平台
在 [官网](https://upr.unity.com/download) 下载最新的 UPR 安卓版并安装   
根据提示，UPR 需要开启悬浮窗口权限，设置为开启。  
- 启动 UPR  
 <img src="https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/4.png" width = "300" height = "500" alt="启动UPR" align=center />
- 扫描网页上的测试二维码开启测试  
![轮盘](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/5.png)
- 左上角会出现轮盘操作菜单，顺时针从左到右分别是开启测试，添加 Tag , 创建对象快照
- 停止测试后网页项目会同时停止
- 测试完成。

## windows 平台
在 [官网](https://upr.unity.com/download) 下载最新的 UPR PC版本并安装启动
![启动](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/6.png)
- 拷贝测试项的 Session ID 填入，并 Load.
- 选择测试手机，可通过 IP 连接，也可通过 ABD（建议使用 ADB ）
- 点击 Start Test  
![开启](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/7.png)
- 点击 Stop and ProcessData 结束测试  
![结束](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/8.png)
- 前往网页项目，查看测试报告  
![查看](https://raw.githubusercontent.com/dupouyer/dupouyer.github.io/hexo/source/_posts/img/2020-6-4/9.png)

# 数据分析
